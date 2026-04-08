# Online harmonogram 2 (REFARKTORIZOVANÝ)

> Před vpuštěním do produkce zkontrolovat `//!` komentáře v kódu a na produkci pustit `docker compose exec app npm run db:push` a `docker compose exec app npm run db:seed`.

## Popis projektu
Tento projekt je web(ová aplikace) pro správu harmonogramu a dalších provozních záležitostí (Seba 2026). Slouží instruktorům k získávání informací o harmonogramu, službách, jídelníčku a dalších provozních záležitostech. Programákům a hlavnímu vedoucímu slouží jako administrační nástroj pro správu těchto dat a plánování harmonogramu.

## Technologie

### Core
- **Runtime:** Node.js
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI)

### Databáze
- **DB Engine:** SQLite (`better-sqlite3`)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Migration Tool:** Drizzle Kit

## Struktura aplikace

## Konvence: lib vs utils

- `src/lib`: strukturovane znovupouzitelne moduly (mini-knihovny v ramci aplikace).
- `src/utils`: male bezstavove genericke helpery.
- `src/lib` muze importovat ze `src/utils`.
- `src/utils` nesmi mit interni app importy (`@/...`, relativni importy na aplikacni moduly).
- Feature-specific helpery patri do `src/features/<feature>/utils.ts` (nebo `utils/`) a pri znovupouziti napric features se presouvaji do `src/lib` nebo `src/utils`.

### Role a Přístupy
Aplikace rozlišuje uživatelské role (uloženo v DB), primárně:
- **Instruktor:** Je uživatelem s přístupem k informacím, harmonogramu, službách, jídelníčku a dalším provozním záležitostem.
- **Programák / Hlavní vedoucí:** Je správcem webu, který má přístup k administračnímu rozhraní pro správu dat a plánování harmonogramu.

### Adresářová struktura (`/app`)
- `(auth)`: Přihlašování a registrace.
  - `/prihlaseni`: Uživatel zadá telefonní číslo pro přihlášení.
    - Pokud je uživatel registrován, zadává heslo.
    - Pokud není registrován, vytváří si heslo a registruje se.
  - `/odhlaseni`: Odhlášení uživatele.
- `(instruktori)`: Frontend pro instruktory.
  - `/`: Hlavní stránka s informacemi a aktuálními zprávami.
  - `/harmonogram`: Zobrazení denního programu.
  - `/instruktori`: Seznam instruktorů a jejich kontaktů.
  - `/jidelnicek`: Zobrazení jídelníčku.
  - `/sluzby`: Přehled ranních, odpoledních a večerních služeb.
- `(programaci)/admin`: Administrační rozhraní.
  - Správa entit: Aktivity, Instruktoři, Jídelníček, Oddíly, Role, Služby, Turnusy.
  - `(harmonogram)`: Editor harmonogramu.