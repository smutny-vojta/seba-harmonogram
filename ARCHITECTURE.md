# Architecture

This document describes the overall architecture and design decisions of the **seba-harmonogram** application. It covers the directory structure, architectural patterns, data flow, and key technologies used in the project. This serves as a reference for current and future developers to understand how the application is organized and how different parts interact with each other.

## Overview

**seba-harmonogram** is a Progressive Web Application (PWA) built for managing a summer camp schedule ("harmonogram"). It is a full-stack application running entirely within the Next.js framework — there is no separate backend service. The application is in Czech.

**Runtime & Package Manager:** Bun  
**Framework:** Next.js 16 (App Router)  
**Language:** TypeScript 5 (strict mode)  
**Database:** MongoDB (native driver via `mongodb` package)  
**Authentication:** Better Auth  
**UI:** TailwindCSS v4 + shadcn/ui (Radix UI primitives)

---

## Directory Structure

```
/
├── src/
│   ├── app/                  # Next.js App Router: routes, layouts, API handlers
│   │   ├── api/              # Route handlers (e.g. Better Auth catch-all)
│   │   ├── dashboard/        # Protected dashboard area
│   │   │   ├── harmonogram/  # Schedule-related pages (aktivity, lokace)
│   │   │   ├── layout.tsx    # Dashboard shell: sidebar, header, theme
│   │   │   └── page.tsx      # Dashboard home
│   │   ├── globals.css       # Global CSS & Tailwind tokens
│   │   ├── layout.tsx        # Root layout: font, metadata, PWA viewport
│   │   └── manifest.ts       # Web App Manifest for PWA
│   │
│   ├── components/           # Shared, reusable UI components
│   │   ├── layout/           # Layout-specific components (Sidebar, PageTitle)
│   │   ├── ui/               # shadcn/ui primitives (generated, do not edit manually)
│   │   ├── ErrorBoundary.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── config/               # App-wide static configuration
│   │   └── navigation.ts     # Sidebar navigation tree (typed, as const)
│   │
│   ├── features/             # Feature slices (core business logic)
│   │   ├── activities/       # Activity templates & locations
│   │   ├── harmonogram/      # Scheduled entries
│   │   └── auth/             # Authentication & authorization
│   │
│   ├── hooks/                # Shared custom React hooks
│   ├── lib/                  # Infrastructure singletons and utilities
│   │   ├── db.ts             # MongoDB client singleton
│   │   ├── env.ts            # Validated environment variables
│   │   ├── safe-action.ts    # next-safe-action client factory
│   │   └── utils.ts          # cn() class merging helper
│   │
│   ├── scripts/              # One-off server-side scripts (seed, migrate)
│   └── proxy.ts              # Potential API proxy utility
│
├── docker/                   # Docker configuration files
├── docker-compose.yml        # Local MongoDB container
├── biome.json                # Linter + formatter config (Biome)
├── next.config.ts            # Next.js config (PWA, compiler)
└── tsconfig.json             # TypeScript config (strict, path aliases)
```

---

## Architectural Patterns

### 1. Feature Slice Architecture

All business domains live under `src/features/<domain>/`. Each feature slice is self-contained and follows a strict three-layer internal structure:

The canonical implementation template for new domain features is in `FEATURE_TEMPLATE.md`.

| File          | Role                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- |
| `schema.ts`   | Zod schemas for validation + MongoDB typed `Collection` exports                        |
| `types.ts`    | TypeScript types inferred from Zod schemas via `z.infer<>`                             |
| `dal.ts`      | Data Access Layer — all MongoDB queries, ID mapping, persistence only                  |
| `actions.ts`  | Next.js Server Actions — input validation, orchestration, calls DAL, revalidates cache |
| `consts.ts`   | Domain constants (enums, static arrays)                                                |
| `components/` | (optional) Feature-specific React components                                           |

**Dependency flow within a slice:**
```
consts → schema → types → dal → actions
```

Cross-feature imports go from `harmonogram` → `activities` (e.g., reusing `ActivityCategoryEnum`), but never in reverse.

### 2. Data Access Layer (DAL)

The DAL (`dal.ts`) is the **single point of contact** between the application and MongoDB. Its responsibilities are:
- Accepting raw input typed via `NewXxxType` (omitting `_id`, `createdAt`, `updatedAt`)
- Instantiating `ObjectId` for new documents
- Remapping `_id` to `id` (string) on reads, so the rest of the application never handles `ObjectId` directly above the DAL boundary

Write validation boundary is `actions.ts` via `actionClient.inputSchema(...)`, not DAL.

### 3. Server Actions with `next-safe-action`

All mutations are Server Actions wrapped with `next-safe-action`. This provides:
- Automatic Zod input validation via `.inputSchema()`
- Typed return values on the client
- Centralized server error handling in `src/lib/safe-action.ts`

Actions call the DAL, then call `revalidatePath()` to invalidate the Next.js cache.

### 4. MongoDB Schema Strategy

MongoDB collections are typed using the native driver's generic `Collection<T>` type. Each document type `T` is inferred from a Zod schema, keeping runtime validation and TypeScript types in sync from a single source of truth.

- `ObjectId` instances are used internally (DAL and schema layer)
- String IDs are used at the application/UI layer
- `_id` is **always generated server-side** (`new ObjectId()` in the DAL — never by MongoDB's default on insert)

### 5. Authentication & Authorization

Authentication is handled by **Better Auth** with:
- MongoDB adapter for session storage
- `admin` plugin for role-based access control (RBAC) via `createAccessControl`
- Server-side auth: `auth.ts` (used in API routes and Server Components/Actions)
- Client-side auth: `auth-client.ts` (`createAuthClient`) used in Client Components

Roles defined in `src/features/auth/roles.ts`:
- `instructor` — read-only access to schedule
- `programManager` — full CRUD on schedule entries
- `headProgramManager` — full CRUD + admin actions
- `headManager` — same as headProgramManager

### 6. UI Architecture

- **shadcn/ui** components live in `src/components/ui/` and are generated/managed by the `shadcn` CLI. They should not be edited manually.
- **Layout components** (`Sidebar`, `PageTitle`) live in `src/components/layout/`.
- The dashboard layout wraps content in `ThemeProvider` → `TooltipProvider` → `SidebarProvider`, establishing the global UI context tree.
- The app is locked to **dark theme** (`forcedTheme="dark"`).
- Font: **Figtree** (Google Fonts, variable font via `next/font/google`).

---

## Data Flow

```
User Action (Client Component)
  │
  ▼
Server Action (actions.ts)   ← next-safe-action validates input
  │
  ▼
DAL function (dal.ts)        ← Zod re-validates, constructs ObjectId
  │
  ▼
MongoDB Collection           ← Native driver query
  │
  ▼
Result mapped (ObjectId → id string)
  │
  ▼
revalidatePath() → Next.js cache invalidated → UI re-renders
```

---

## Key Path Aliases

Defined in `tsconfig.json`:

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@features/*`   | `src/features/*`   |
| `@components/*` | `src/components/*` |
| `@hooks/*`      | `src/hooks/*`      |
| `@lib/*`        | `src/lib/*`        |

---

## Infrastructure

- **Local development:** MongoDB runs in Docker via `docker-compose.yml`. Use `bun run db:start` and `bun run dev`.
- **Environment variables:** Validated at startup in `src/lib/db.ts` and `src/lib/env.ts`. Missing variables cause an immediate hard crash.
- **PWA:** Configured via `@ducanh2912/next-pwa` and `src/app/manifest.ts`.
