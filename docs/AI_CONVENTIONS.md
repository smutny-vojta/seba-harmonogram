# AI Conventions

Canonical checklist for AI assistants working on this repository.

## Mandatory startup sequence

Before any edits, gather project context in this order:

1. Read [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md).
2. Read [docs/README.md](docs/README.md).
3. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
4. Read [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md).
5. Read task-relevant feature docs (for auth: [docs/features/auth/IMPLEMENTATION.md](docs/features/auth/IMPLEMENTATION.md)).

Do not start implementation before this sequence is completed.

## Stack and runtime

- Next.js App Router, React, TypeScript (strict), MongoDB native driver, Better Auth.
- Use Bun commands for all workflows.

## Architecture

- Follow feature slices under `src/features/<name>/`.
- Expected feature files: `consts.ts`, `schema.ts`, `types.ts`, `dal.ts`, `actions.ts`.
- Only `dal.ts` may query MongoDB.
- Keep `ObjectId` in DAL; remap `_id` to `id` string when returning read models.

## Typing rules

- Domain models: use `type` + `z.infer`.
- React component props: use `interface <ComponentName>Props`.
- Never use `any`.
- Use `import type` for type-only imports.
- Do not use TypeScript `enum`; use Zod enums or `as const` objects.

## React and UI

- Prefer Server Components; add `"use client"` only when needed.
- Do not use `React.FC`.
- Use `cn()` from `@/utils/cn` for conditional classes.
- Keep `src/components/ui/` (shadcn generated) unchanged unless explicitly requested.

## Server actions

- Start action files with `"use server"`.
- Use `actionClient` from `@/lib/safe-action`.
- Always validate input using `.inputSchema(...)`.
- Keep actions thin: authorize, call DAL, revalidate.
- Call `revalidatePath` after mutations.
- Return serializable values only.

## Imports and helpers

- Use path aliases (`@/*`, `@features/*`, `@components/*`, `@hooks/*`, `@lib/*`).
- `src/lib` may import from `src/utils`.
- `src/utils` must not import internal app modules.
- Keep feature-specific helpers in `src/features/<feature>/utils.ts` unless shared.

## Localization and errors

- User-facing UI text must be Czech.
- Validation and exposed error messages must be Czech.

## Environment

- Do not read `process.env` directly in feature/component code.
- Use validated access through `@/lib/env` or established wrappers like `@/lib/db`.
