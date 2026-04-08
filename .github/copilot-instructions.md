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

## Mandatory Startup Protocol

Before writing or editing code, always:

1. Read `docs/AI_CONVENTIONS.md`.
2. Read `docs/README.md`.
3. Read `docs/ARCHITECTURE.md` and `docs/STYLEGUIDE.md`.
4. Read feature-specific docs relevant to the task (for auth use `docs/features/auth/IMPLEMENTATION.md`).

If context is missing, gather it first and only then implement changes.

## Canonical Rules

- Use [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md) as the single source of truth for coding conventions.
- Use [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for structural and layering decisions.
- Use [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md) for typing/naming/style details.
- If guidance conflicts across docs, prefer [AGENTS.md](AGENTS.md), then [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md), then other docs.

## Reference Docs (Link, Don’t Embed)

- AI conventions checklist: `docs/AI_CONVENTIONS.md`
- Architecture details: `docs/ARCHITECTURE.md`
- Coding and naming rules: `docs/STYLEGUIDE.md`
- Auth implementation notes: `docs/features/auth/IMPLEMENTATION.md`
- Setup and project overview: `docs/README.md` (parts of the stack section may be outdated)
