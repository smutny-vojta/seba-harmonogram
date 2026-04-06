<!--
Soubor: src/features/FEATURE_TEMPLATE.md
Ucel: Dokumentace k feature nebo sablona pro vyvoj feature.
Parametry/Vstupy: Navody, pravidla a implementacni poznamky.
Pozadavky: Udrzovat aktualni, konkretni a konzistentni s kodem.
-->

# Unified Domain Feature Template

This document is the canonical template for every domain CRUD feature in src/features.

Use this template for business domains such as activities, activityLocations, harmonogram, turnus, oddily, and similar.

Do not use this template for core infrastructure modules like auth.

## 1) Target Folder Layout

Create one folder per feature:

~~~text
src/features/<featureName>/
  consts.ts
  schema.ts
  types.ts
  dal.ts
  actions.ts
  <FeatureName>View.tsx
  seed.ts                      # optional but recommended
  components/                  # optional but recommended
    <FeatureName>Menu.tsx
    <FeatureName>Grid.tsx
    <FeatureName>Card.tsx
    <FeatureName>Dialogs.tsx
~~~

Dependency flow inside a feature:

~~~text
consts.ts -> schema.ts -> types.ts -> dal.ts -> actions.ts
~~~

## 2) consts.ts Template

Use for static values only.

~~~ts
export const <FEATURE_NAME>_SORT = {
  NAME_ASC: "name_asc",
  CREATED_DESC: "created_desc",
} as const;

export const <FEATURE_NAME>_DEFAULTS = {
  PAGE_SIZE: 50,
} as const;
~~~

## 3) schema.ts Template

Rules:
- Full DB schema includes _id: ObjectId.
- Item schema uses id: string.
- New schema omits _id and server-managed audit fields.
- All operation input schemas are declared in schema.ts and ordered as: create, read, update, delete.
- Validation messages should be in Czech for user-facing inputs.

~~~ts
import { ObjectId } from "mongodb";
import { z } from "zod";

export const <FeatureName>Schema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Nazev je povinny"),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const <FeatureName>ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const New<FeatureName>Schema = <FeatureName>Schema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

const <FeatureName>IdSchema = z.object({
  id: z.string().min(24),
});

export const <FeatureName>OperationSchemas = {
  create: New<FeatureName>Schema,
  read: <FeatureName>IdSchema,
  update: <FeatureName>IdSchema.extend(New<FeatureName>Schema.shape),
  delete: <FeatureName>IdSchema,
} as const;
~~~

## 4) types.ts Template

Rules:
- Use type, never interface for domain models.
- Use z.infer only.

~~~ts
import type { z } from "zod";
import type {
  <FeatureName>Schema,
  <FeatureName>ItemSchema,
  New<FeatureName>Schema,
} from "./schema";

export type <FeatureName>Type = z.infer<typeof <FeatureName>Schema>;
export type <FeatureName>ItemType = z.infer<typeof <FeatureName>ItemSchema>;
export type New<FeatureName>Type = z.infer<typeof New<FeatureName>Schema>;
~~~

## 5) dal.ts Template

Rules:
- DAL is the only place that can access MongoDB.
- Generate _id explicitly with new ObjectId().
- Keep ObjectId inside DAL.
- Always map _id to id on reads.
- Keep audit fields in DAL.
- DAL does not validate business input. It only persists already validated data.

~~~ts
import { type Collection, ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { mapMongoIdToId, toObjectId } from "@/lib/dal-utils";
import type {
  <FeatureName>Type,
  <FeatureName>ItemType,
  New<FeatureName>Type,
} from "./types";

export const <FeatureName>Collection: Collection<<FeatureName>Type> =
  db.collection("<collectionName>");

export async function get<FeatureName>ById(
  id: string,
): Promise<<FeatureName>ItemType | null> {
  const doc = await <FeatureName>Collection.findOne({ _id: toObjectId(id) });
  if (!doc) return null;
  return map<FeatureName>ToItem(doc);
}

export async function list<FeatureName>(): Promise<<FeatureName>ItemType[]> {
  const docs = await <FeatureName>Collection.find().sort({ createdAt: -1 }).toArray();
  return docs.map(map<FeatureName>ToItem);
}

export async function create<FeatureName>(data: New<FeatureName>Type) {
  const now = new Date();

  return <FeatureName>Collection.insertOne({
    ...data,
    _id: new ObjectId(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function update<FeatureName>({
  id,
  data,
}: {
  id: string;
  data: New<FeatureName>Type;
}) {
  return <FeatureName>Collection.updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
  );
}

export async function delete<FeatureName>(id: string) {
  return <FeatureName>Collection.deleteOne({ _id: toObjectId(id) });
}

export async function prune<FeatureName>() {
  return <FeatureName>Collection.deleteMany({});
}

function map<FeatureName>ToItem(doc: <FeatureName>Type): <FeatureName>ItemType {
  return mapMongoIdToId(doc);
}
~~~

## 6) actions.ts Template

Rules:
- File starts with use server.
- Use actionClient.
- Actions are the single validation boundary for writes.
- Revalidate route after every mutation.
- Return serializable values only.
- Put authorization check in every mutating action.

~~~ts
"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { getSessionUncached, hasRole } from "@/features/auth/utils";
import {
  create<FeatureName>,
  update<FeatureName>,
  delete<FeatureName>,
} from "./dal";
import {
  <FeatureName>OperationSchemas,
} from "./schema";

async function assertCanMutate() {
  const session = await getSessionUncached();
  const roleString = session?.user?.role;

  const allowed =
    hasRole(roleString, "programManager") ||
    hasRole(roleString, "headProgramManager") ||
    hasRole(roleString, "headManager");

  if (!allowed) {
    throw new Error("Nemate opravneni upravovat data.");
  }
}

export const create<FeatureName>Action = actionClient
  .inputSchema(<FeatureName>OperationSchemas.create)
  .action(async ({ parsedInput }) => {
    await assertCanMutate();
    const result = await create<FeatureName>(parsedInput);
    revalidatePath("<routePath>");
    return result.insertedId.toString();
  });

export const update<FeatureName>Action = actionClient
  .inputSchema(<FeatureName>OperationSchemas.update)
  .action(async ({ parsedInput }) => {
    await assertCanMutate();
    const { id, ...data } = parsedInput;
    const result = await update<FeatureName>({ id, data });
    revalidatePath("<routePath>");
    return result.modifiedCount;
  });

export const delete<FeatureName>Action = actionClient
  .inputSchema(<FeatureName>OperationSchemas.delete)
  .action(async ({ parsedInput }) => {
    await assertCanMutate();
    const result = await delete<FeatureName>(parsedInput.id);
    revalidatePath("<routePath>");
    return result.deletedCount;
  });
~~~

## 7) <FeatureName>View.tsx Template

Rules:
- Prefer Server Component.
- Load all required read models in one place.

~~~tsx
import <FeatureName>Grid from "@features/<featureName>/components/<FeatureName>Grid";
import <FeatureName>Menu from "@features/<featureName>/components/<FeatureName>Menu";
import { list<FeatureName> } from "./dal";

export default async function <FeatureName>View() {
  const items = await list<FeatureName>();

  return (
    <div className="flex h-full flex-col gap-y-4">
      <<FeatureName>Menu count={items.length} />
      <<FeatureName>Grid items={items} />
    </div>
  );
}
~~~

## 8) Components Skeleton

Use this consistent split:
- Menu: counters and primary actions.
- Grid: layout and empty state.
- Card: item rendering.
- Dialogs: create, edit, delete actions.

All client-side forms should:
- Parse FormData in one helper.
- Use next-safe-action useAction hook.
- Show Czech toasts for success and error.

## 9) seed.ts Template

Rules:
- Optional but recommended for local development.
- Support prune mode.
- Return IDs if another feature depends on seeded entities.

~~~ts
import { create<FeatureName>, prune<FeatureName> } from "./dal";
import type { New<FeatureName>Type } from "./types";

const TEMPLATES: New<FeatureName>Type[] = [];

export async function seed<FeatureName>Feature(options?: { prune?: boolean }) {
  if (options?.prune) {
    await prune<FeatureName>();
  }

  for (const item of TEMPLATES) {
    await create<FeatureName>(item);
  }
}
~~~

## 10) Feature Checklist

Before merging a new feature:

- Folder structure matches this template.
- No Mongo query outside dal.ts.
- No ObjectId outside schema.ts and dal.ts.
- Every mutation action has role guard and revalidatePath.
- Input validated by Zod in actions.
- Types are z.infer based.
- User-facing validation strings are Czech.
- Build and lint pass with Bun.

## 11) Special Case: auth Feature

Auth remains a core feature with its own structure:
- auth.ts
- auth-client.ts
- roles.ts
- schema.ts
- types.ts
- utils.ts
- actions.ts
- components/

Do not force auth into the domain CRUD template above.
