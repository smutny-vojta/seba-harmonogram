<!--
Soubor: docs/SHARED_TEMPLATE.md
Ucel: Sablona a pravidla pro sdilene moduly v src/lib a src/utils.
Parametry/Vstupy: Struktura souboru, import pravidla, rozhodovaci matice.
Pozadavky: Konzistence napric sdilenou vrstvou a nulove cross-feature importy.
-->

# Sablona Sdilenych Modulu

Tento dokument je kanonicka sablona pro sdilene moduly v:

- `src/lib`
- `src/utils`

Pouzij tuto sablonu pro kod, ktery se znovu pouziva napric vice feature.

## 1) Rozhodovaci Matice Ulozeni

Pouzij tento postup pro kazdou novou sdilenou cast:

1. Je to maly bezstavovy helper bez app importu?
  - Uloz do `src/utils/<name>.ts`.
2. Je to znovupouzitelny modul s domenovou logikou, validaci nebo orchestraci?
  - Uloz do `src/lib/<module>/...` (folder modul).
3. Je to runtime infrastruktura (DB client, env, safe-action client)?
  - Je povolen single-file modul v `src/lib/<name>.ts`.

## 2) Hranice Importu

- `src/features/<name>/` nesmi importovat z jinych feature.
- Sdilena logika napric feature se musi importovat ze `src/lib` nebo `src/utils`.
- `src/lib` muze importovat ze `src/utils`.
- `src/utils` nesmi importovat interni app moduly (`@/...`).
- Kompozice vice feature patri do app vrstvy `src/app`.

## 3) Doporucena Struktura Folder Modulu

Pokud ma sdileny modul vice odpovednosti, vytvor folder modul:

~~~text
src/lib/<module>/
  index.ts          # pouze verejne exporty
  config.ts         # konstanty a staticke mapy
  schema.ts         # zod schema (pokud je treba runtime validace)
  types.ts          # sdilene typy (z.infer, aliasy, rozhrani)
  service.ts        # orchestrace/business operace
  mappers.ts        # pomocne konverzni funkce (volitelne)
  dal.ts            # DB pristup pouze kdyz je modul server-only (volitelne)
~~~

### 3.1 Povinne a Volitelne Soubory

- `index.ts`: povinny pro folder moduly.
- `types.ts`: povinny, pokud modul verejne exportuje typy nebo ma vice internich typu.
- `config.ts`: povinny, pokud modul obsahuje konstanty/staticke mapy.
- `schema.ts`: povinny, pokud modul dela runtime validaci vstupu/vystupu.
- `service.ts`: povinny, pokud modul obsahuje orchestraci nad ramec cistych konstant/helperu.
- `mappers.ts`, `dal.ts`: volitelne podle use-case.

## 4) Lehke Single-File Moduly

Single-file modul je v poradku, pokud plati vsechno:

- Soubor ma mene nez cca 80 radku.
- Ma jednu jasnou odpovednost.
- Nemicha odpovednosti (napr. validace + DB + mapovani dohromady).
- Verejne API je male a stabilni.

Pokud modul preroste tyto hranice, migruj ho na folder strukturu.

## 5) Sablona Pro Shared Utils

Pouzivej pouze pro obecne bezstavove helpery:

~~~text
src/utils/<name>.ts
~~~

Pravidla:

- Bez importu z `@/...`.
- Bez feature-specificke domenove terminologie.
- Bez DB, auth nebo framework orchestrace.

## 6) Priklady Archetypu

### 6.1 Sdileny Domenovy Modul

~~~text
src/lib/camp-categories/
  index.ts
  config.ts
  schema.ts
  types.ts
~~~

### 6.2 Sdileny Service Modul

~~~text
src/lib/group-defaults/
  index.ts
  types.ts
  service.ts
  dal.ts
  generators.ts
~~~

### 6.3 Infrastrukturani Wrapper

~~~text
src/lib/db.ts
src/lib/env.ts
src/lib/safe-action.ts
~~~

## 7) Kontrolni Seznam Kvality

Pred mergem over:

1. V `src/features` nejsou zadne cross-feature importy.
2. Struktura shared modulu odpovida teto sablone.
3. Verejne exporty jsou centralizovane v `index.ts` u folder modulu.
4. `types.ts` existuje tam, kde jsou sdilene typy soucasti verejneho API.
5. Modul prochazi lint a type checkem.
