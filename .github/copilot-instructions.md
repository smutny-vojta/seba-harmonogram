# GitHub Copilot Instructions — seba-harmonogram

## Project Context

seba-harmonogram is a Czech summer-camp schedule management PWA.

- Stack: Next.js 16 App Router, React 19, TypeScript 5 (strict), MongoDB native driver, Better Auth, next-safe-action, Tailwind v4, shadcn/ui.
- Runtime and package manager: Bun.
- Locale: Czech. User-facing text and validation messages must be in Czech.

## Build and Test

Use Bun commands unless a task explicitly requires otherwise:

- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run lint`
- `bun run format`
- `bun run db:start`
- `bun run db:stop`
- `bun run db:reset`

## Architecture

- Follow feature slices under `src/features/<name>/` with files: `consts.ts`, `schema.ts`, `types.ts`, `dal.ts`, `actions.ts`.
- Only `dal.ts` may access MongoDB.
- Keep `ObjectId` inside DAL. On reads, remap `_id` to `id` string before returning.
- Server actions must be thin wrappers over DAL using `actionClient` and should call `revalidatePath` after mutations.

## Conventions

- Use `type` (not `interface`) for domain models and `import type` for type-only imports.
- Never use `any`; use `unknown` + narrowing.
- Do not use TypeScript `enum`; use Zod enums or `as const` objects.
- Use path aliases (`@/*`, `@features/*`, `@components/*`, `@hooks/*`, `@lib/*`), not deep relative paths.
- Prefer Server Components; add `"use client"` only when required by hooks/events/browser APIs.
- Use `cn()` from `@/lib/utils` for conditional class merging.

## Auth Pattern

- Server-side auth access: `@/features/auth/auth.ts`.
- Client-side auth hooks: `@/features/auth/auth-client`.
- Roles are defined in `@/features/auth/roles.ts`.

## Reference Docs (Link, Don’t Embed)

- Architecture details: `ARCHITECTURE.md`
- Coding and naming rules: `STYLEGUIDE.md`
- Auth implementation notes: `src/features/auth/IMPLEMENTATION.md`
- Setup and project overview: `README.md` (parts of the stack section may be outdated)
