# GitHub Copilot Instructions — seba-harmonogram

## Project Context

**seba-harmonogram** is a Czech summer-camp schedule management PWA. Full-stack with Next.js 16 App Router, React 19, TypeScript 5 (strict mode), MongoDB (native driver), Better Auth, next-safe-action, TailwindCSS v4, shadcn/ui, and Bun as the package manager. The application locale is **Czech** — UI-facing strings and validation messages are in Czech.

---

## Feature Slice Pattern

When generating code for any business feature, follow the **feature slice** structure under `src/features/<name>/`:

1. **`consts.ts`** — static arrays and string constants
2. **`schema.ts`** — Zod schemas + `Collection<T>` exports
3. **`types.ts`** — `z.infer<>` types only, no logic
4. **`dal.ts`** — all MongoDB queries (only place allowed to access DB)
5. **`actions.ts`** — Server Actions, thin wrappers over DAL

**Example — generating a new DAL function:**
```ts
// src/features/activities/dal.ts
export async function getActivityById(id: string) {
  const doc = await ActivityCollection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() }; // always remap _id → id string
}
```

---

## Zod Schema Pattern

```ts
// Full schema includes _id
export const FooSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"), // Czech messages
  // ...
});

// Input schema omits DB-managed fields
export const NewFooSchema = FooSchema.omit({ _id: true, createdAt: true, updatedAt: true });

// Types always inferred from schemas
export type FooType = z.infer<typeof FooSchema>;
export type NewFooType = z.infer<typeof NewFooSchema>;

// Typed MongoDB collection
export const FooCollection: Collection<FooType> = db.collection("foos");
```

---

## Server Action Pattern

```ts
"use server";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { NewFooSchema } from "./schema";
import { createFoo } from "./dal";

export const createFooAction = actionClient
  .inputSchema(NewFooSchema)
  .action(async ({ parsedInput }) => {
    const result = await createFoo(parsedInput);
    revalidatePath("/dashboard/foo");
    return result.insertedId.toString(); // return string, never ObjectId
  });
```

---

## Key Rules for Autocomplete

- **Types**: always `type`, never `interface` for domain models; always `import type` for type-only imports
- **IDs**: generate `_id` as `new ObjectId()` in DAL; convert to string before returning; never expose `ObjectId` outside DAL
- **Paths**: always use aliases (`@/lib/...`, `@features/...`) — never relative `../../`
- **Components**: Server Components by default; add `"use client"` only for hooks/events
- **CSS classes**: use `cn()` from `@/lib/utils` for conditional merging
- **No `any`**: use `unknown` + type guards if shape is truly unknown
- **No `enum`**: use `z.enum(['a', 'b'])` or `as const` objects

---

## Auth

```ts
// Server-side (Server Components, Server Actions, Route Handlers)
import { auth } from "@/features/auth/auth.ts";
const session = await auth.api.getSession({ headers: await headers() });

// Client-side (Client Components)
import { authClient } from "@/features/auth/auth-client";
const { data: session } = authClient.useSession();
```

Roles: `instructor` | `programManager` | `headProgramManager` | `headManager` — defined in `@/features/auth/roles.ts`.

---

## Naming Quick Reference

| What | Convention |
|------|-----------|
| React component file | `PascalCase.tsx` |
| Non-component module | `camelCase.ts` |
| Custom hook file | `use-kebab-case.ts` |
| Zod schema | `PascalCaseSchema` |
| Zod-inferred type | `PascalCaseType` |
| MongoDB collection | `PascalCaseCollection` |
| Module constant | `SCREAMING_SNAKE_CASE` |
| Route segment | Czech, kebab-case |
