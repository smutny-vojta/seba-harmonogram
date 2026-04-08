# AI Agent Rules for seba-harmonogram

This file defines mandatory rules for any AI coding assistant working in this repository.

## Priority

1. Follow this file first for AI workflow behavior.
2. Follow project coding rules in [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md).
3. Follow architecture and style details in:
   - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
   - [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md)
   - [docs/FEATURE_TEMPLATE.md](docs/FEATURE_TEMPLATE.md)

## Mandatory Startup Protocol

Before writing or editing code, every AI assistant must:

1. Read [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md).
2. Read [docs/README.md](docs/README.md) for project context.
3. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md).
4. Read feature-specific docs relevant to the task (for auth also [docs/features/auth/IMPLEMENTATION.md](docs/features/auth/IMPLEMENTATION.md)).
5. Only then propose or implement changes.

If context is missing, stop and gather it first.

## Rule Source Of Truth

- Canonical coding rules live in [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md).
- Do not duplicate or reinterpret rules from that file; follow it directly.
- If a rule in another document conflicts, use the precedence from the Priority section above.

## Before editing code

- Read [docs/AI_CONVENTIONS.md](docs/AI_CONVENTIONS.md) and relevant feature docs.
- Prefer minimal, targeted changes that preserve existing style.
- Validate changed files and fix introduced errors.
