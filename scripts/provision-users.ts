/**
 * User Provisioning Script
 *
 * Creates or updates user accounts from a JSON file.
 * Usage: npx tsx scripts/provision-users.ts <path-to-users.json>
 *
 * JSON format:
 * [
 *   { "name": "Jan Novák", "phoneNumber": "+420123456789", "role": "instr" },
 *   { "name": "Petr Svoboda", "phoneNumber": "+420987654321", "role": "programak" }
 * ]
 *
 * Valid roles: "instr", "programak", "hlavni_programak", "hlavas"
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../src/lib/db";
import { user } from "../src/schema/auth";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const VALID_ROLES = ["instr", "programak", "hlavni_programak", "hlavas"] as const;
type Role = (typeof VALID_ROLES)[number];

interface UserInput {
  name: string;
  phoneNumber: string;
  role: Role;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return crypto.randomUUID();
}

function validateUsers(data: unknown): UserInput[] {
  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of user objects.");
  }

  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const prefix = `User #${i + 1}`;

    if (!entry || typeof entry !== "object") {
      errors.push(`${prefix}: must be an object.`);
      continue;
    }

    if (!entry.name || typeof entry.name !== "string") {
      errors.push(`${prefix}: "name" is required and must be a string.`);
    }

    if (!entry.phoneNumber || typeof entry.phoneNumber !== "string") {
      errors.push(`${prefix}: "phoneNumber" is required and must be a string.`);
    }

    if (!entry.role || !VALID_ROLES.includes(entry.role as Role)) {
      errors.push(
        `${prefix}: "role" must be one of: ${VALID_ROLES.join(", ")}. Got: "${entry.role}".`
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }

  // Check for duplicate phone numbers
  const phones = data.map((u: UserInput) => u.phoneNumber);
  const duplicates = phones.filter((p: string, i: number) => phones.indexOf(p) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate phone numbers found: ${[...new Set(duplicates)].join(", ")}`);
  }

  return data as UserInput[];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error("Usage: npx tsx scripts/provision-users.ts <path-to-users.json>");
    process.exit(1);
  }

  const absolutePath = resolve(inputPath);
  console.log(`Reading users from: ${absolutePath}\n`);

  let rawData: unknown;
  try {
    const fileContent = readFileSync(absolutePath, "utf-8");
    rawData = JSON.parse(fileContent);
  } catch (err) {
    console.error(`Failed to read/parse JSON file: ${(err as Error).message}`);
    process.exit(1);
  }

  const users = validateUsers(rawData);
  console.log(`Found ${users.length} user(s) to provision.\n`);

  let created = 0;
  let updated = 0;

  for (const input of users) {
    // Check if user already exists by phone number
    const existing = await db.query.user.findFirst({
      where: eq(user.phoneNumber, input.phoneNumber),
    });

    if (existing) {
      // Update existing user
      await db
        .update(user)
        .set({
          name: input.name,
          role: input.role,
        })
        .where(eq(user.id, existing.id));

      console.log(`  ↻ Updated: ${input.name} (${input.phoneNumber}) — role: ${input.role}`);
      updated++;
    } else {
      // Create new user
      await db.insert(user).values({
        id: generateId(),
        name: input.name,
        phoneNumber: input.phoneNumber,
        phoneNumberVerified: true,
        role: input.role,
      });

      console.log(`  ✓ Created: ${input.name} (${input.phoneNumber}) — role: ${input.role}`);
      created++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Total:   ${users.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
