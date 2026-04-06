# Style Guide

This document defines the coding standards for **seba-harmonogram**. All rules are grounded in the actual codebase conventions. Enforcement is via **Biome** (linter + formatter) and TypeScript compiler options.

---

## Tooling

| Tool         | Purpose                | Config          |
| ------------ | ---------------------- | --------------- |
| Biome 2.x    | Lint + format          | `biome.json`    |
| Prettier     | Tailwind class sorting | `.prettierrc`   |
| TypeScript 5 | Type checking          | `tsconfig.json` |

Run checks: `bun run lint`  
Auto-format: `bun run format`

---

## TypeScript

### Strictness

The project uses **maximum TypeScript strictness**. The following compiler flags are enabled and must be respected:

- `strict: true` — all strict checks enabled
- `noUnusedLocals` + `noUnusedParameters` — no dead code
- `noUncheckedIndexedAccess` — array/object access always returns `T | undefined`
- `noFallthroughCasesInSwitch` — every switch case must break/return
- `erasableSyntaxOnly` — no `const enum`, no `namespace` syntax
- `isolatedModules` — no cross-file type-only constructs that require type information

### Types vs Interfaces

- **Use `type`** for all domain types (inferred from Zod or composed). Do not use `interface` unless extending third-party types requires it.
- All domain types are defined in `types.ts` and inferred from Zod schemas:

```ts
// ✅ Correct
export type ActivityType = z.infer<typeof ActivitySchema>;

// ❌ Avoid
export interface ActivityType { ... }
```

### `import type`

Always use `import type` for type-only imports:

```ts
// ✅ Correct
import type { NewActivityType } from "./types";

// ❌ Incorrect
import { NewActivityType } from "./types";
```

### Avoid `any`

Never use `any`. Use `unknown` and narrow with type guards if the shape is truly unknown.

---

## Naming Conventions

### Files & Directories

| Type                  | Convention            | Example                                                      |
| --------------------- | --------------------- | ------------------------------------------------------------ |
| React components      | `PascalCase.tsx`      | `AppSidebar.tsx`, `PageTitle.tsx`                            |
| Non-component modules | `camelCase.ts`        | `dal.ts`, `safe-action.ts`, `auth-client.ts`                 |
| Feature-slice files   | fixed names           | `schema.ts`, `types.ts`, `dal.ts`, `actions.ts`, `consts.ts` |
| Route segments        | **Czech**, kebab-case | `aktivity/`, `lokace/`                                       |
| Hook files            | `use-kebab-case.ts`   | `use-mobile.ts`                                              |

### Variables & Functions

| Type                      | Convention                         | Example                                       |
| ------------------------- | ---------------------------------- | --------------------------------------------- |
| Functions                 | `camelCase`                        | `createActivity`, `listActivities`            |
| React components          | `PascalCase`                       | `AppSidebar`, `SidebarFooterContent`          |
| Arrow function components | `PascalCase` const                 | `const SidebarFooterContent = () => ...`      |
| Constants (module-level)  | `SCREAMING_SNAKE_CASE`             | `NAVIGATION`, `APP_ROLES`, `ROLE_LABELS`      |
| Zod schemas               | `PascalCase` + `Schema` suffix     | `ActivitySchema`, `NewActivityLocationSchema` |
| MongoDB collections       | `PascalCase` + `Collection` suffix | `ActivityCollection`                          |
| Types from Zod            | `PascalCase` + `Type` suffix       | `ActivityType`, `NewActivityLocationType`     |
| Enum/string unions        | `PascalCase` + `Enum` suffix       | `ActivityCategoryEnum`                        |

---

## Feature Slice Structure

Every feature under `src/features/<name>/` must follow this file layout:

Canonical file-by-file template is documented in `FEATURE_TEMPLATE.md`.

```
<feature>/
  consts.ts     # static arrays, string literals, enum values
  schema.ts     # Zod schemas + MongoDB Collection exports
  types.ts      # z.infer<> types only — no logic
  dal.ts        # all DB access — no HTTP, no Next.js API
  actions.ts    # Server Actions — thin wrappers over DAL
  components/   # (optional) feature-specific UI components
```

**Never** place database queries outside of `dal.ts`. **Never** import `dal.ts` directly in Client Components.

---

## Zod Schemas

- Define the **full document schema** first (including `_id: z.instanceof(ObjectId)`).
- Derive `New*Schema` using `.omit({ _id: true, createdAt: true, updatedAt: true })`.
- Infer types from schemas — never write types manually for domain models.
- Validation messages should be in **Czech** (matching the application locale).

```ts
// ✅ Correct
export const ActivityLocationSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1, "Název je povinný"),
  indoor: z.boolean().default(false),
});

export const NewActivityLocationSchema = ActivityLocationSchema.omit({ _id: true });

export type ActivityLocationType = z.infer<typeof ActivityLocationSchema>;
```

---

## Data Access Layer (DAL)

- All DAL functions are `async` and return typed results.
- DAL stores already validated data and does not perform business input validation.
- Always generate `_id` explicitly with `new ObjectId()` — do not rely on MongoDB defaults.
- On reads, always destructure `_id` and remap it to `id: _id.toString()`. The `ObjectId` type must not leak above the DAL boundary.
- Timestamps (`createdAt`, `updatedAt`) are managed in the DAL, not by callers.

```ts
// ✅ Correct — ID remapped, ObjectId never leaks
export async function getActivityById(id: string) {
  const doc = await ActivityCollection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}
```

---

## Server Actions

- Every file with Server Actions must start with `"use server";`.
- Use the `actionClient` from `@/lib/safe-action` — never create raw Server Actions without it.
- Input must always be validated with `.inputSchema(ZodSchema)`.
- Server Actions are the single validation boundary for write operations.
- Call `revalidatePath()` after any mutation. Use the exact route path string.
- Return only serializable values (string, number, plain object) — never return `ObjectId` or `Date`.

```ts
// ✅ Correct
"use server";

export const createActivityAction = actionClient
  .inputSchema(NewActivitySchema)
  .action(async ({ parsedInput }) => {
    const result = await createActivity(parsedInput);
    revalidatePath("/dashboard/harmonogram/aktivity");
    return result.insertedId.toString();
  });
```

---

## React Components

### Server vs Client

- Prefer **Server Components** by default. Add `"use client"` only when the component uses browser APIs, React hooks (`useState`, `useEffect`, `usePathname`, etc.), or event handlers.
- Layout components that compose context providers (`ThemeProvider`, `SidebarProvider`) are Server Components passing children through.

### Component Conventions

- Export named functions for top-level page components and layouts:
  ```ts
  export default async function Layout({ children }: ...) { ... }
  ```
- Use arrow function const for internal, non-exported sub-components:
  ```ts
  const SidebarFooterContent = () => { ... };
  ```
- Props types are always inline `Readonly<{ ... }>` for layout/page components.
- Never use `React.FC` or `React.FunctionComponent`.

### CSS & Tailwind

- Use the `cn()` utility from `@/lib/utils` for conditional/merged class names:
  ```ts
  import { cn } from "@/lib/utils";
  className={cn("base-class", condition && "conditional-class")}
  ```
- TailwindCSS v4 is used — use standard Tailwind utilities only. No `@apply` unless in `globals.css`.
- Do not use inline style objects unless the value is **dynamic** (computed at runtime). Prefer Tailwind classes for all static styles.

---

## Authentication Guards

- Server-side auth checks use `auth` from `@/features/auth/auth.ts` (await the session).
- Client-side auth uses `authClient` from `@/features/auth/auth-client.ts`.
- Permission checks use the Better Auth `ac.check()` mechanism with the defined statements (`scheduleEntry`, etc.).

---

## Formatting Rules (Biome)

- **Indent:** 2 spaces
- **No tabs**
- **Trailing commas** in multi-line structures
- **Imports are auto-organized** by Biome's `organizeImports` assist action
- Import order convention: external libraries → `@/lib` → `@/features` → `@/components` → relative

---

## Environment Variables

- All env vars must be validated at application startup.
- Never access `process.env.X` directly in component or feature code — add a validated accessor to `src/lib/env.ts` or follow the pattern in `src/lib/db.ts`.
- Missing required env vars must throw an error immediately (fail-fast), not silently degrade.

---

## Error Handling

- Server Action errors are caught centrally in the `handleServerError` callback in `src/lib/safe-action.ts`.
- Error messages exposed to users should be in **Czech**.
- Use `ErrorBoundary` / `ErrorComponent` from `src/components/` for client-side rendering errors.
