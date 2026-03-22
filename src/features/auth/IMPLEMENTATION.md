# Plán implementace: Zvací odkazy & Přihlašování telefonem

Tento dokument slouží jako technický manuál a checklist pro přesnou implementaci přihlašovacího systému (telefon + heslo) přes skryté zvací odkazy. 

Tento systém zaručuje, že:
- Instruktoři se nemohou svévolně registrovat.
- K přihlášení jim stačí telefonní číslo a heslo (žádné e-maily).
- Aplikace je sama ihned a neomylně přiřadí ke správnému Turnusu a Oddílu podle toho, jaký odkaz jim Hlavas poslal.
- Všechny jejich aktivní relace (sessions) na všech zařízeních bezpečně vyprší přesně ve chvíli konce turnusu.

---

## 1. Databázová vrstva (Dokončeno ✅)
- [x] **`schema.ts`**: Kolekce `invitations` obsahuje token, `turnusId`, `oddilId`, roli uživatele a expiruje přesně za 24 hodin (`expiresAt`).
- [x] **Better Auth Config**: Povolena registrace přes e-mail a heslo, definována nová custom pole ve schématu uživatele (`phoneNumber`, `turnusId`, `oddilId`).

---

## 2. Server Actions pro generování (Pro Hlavase)
- [ ] Vytvořit soubor `actions.ts` v `src/features/auth`.
- [ ] **Action `generateInvitationAction`**:
  1. Ověří, že volající uživatel má roli `headManager` nebo `headProgramManager`.
  2. Přijme parametry: `turnusId`, `oddilId`.
  3. Vygeneruje náhodný, silný token (např. pomocí `crypto.randomBytes(32).toString('hex')`).
  4. Uloží do tabulky `invitations` (platnost 24 hodin, stav `isUsed: false`).
  5. Vrátí vygenerovaný token na Frontend, aby ho Hlavas mohl zkopírovat jako odkaz.

---

## 3. UI: Registrační stránka z pozvánky
- [ ] Vytvořit Next.js stránku: `src/app/pozvanka/[token]/page.tsx`.
- [ ] Stránka na serveru (`Server Component`):
  1. Vezme `token` z URL.
  2. Ověří v DB, že existuje, že `expiresAt` nenastalo v minulosti, a že `isUsed === false`.
  3. Pokud token nesedí, ukáže chybovou hlášku "Pozvánka vypršela nebo je neplatná".
  4. Pokud je OK, vykreslí speciální formulář pro lektora (s inputy: Telefonní číslo, Heslo, Ztrvrzení hesla).

---

## 4. Server Actions pro registraci s tokenem (Z pohledu Instruktora)
- [ ] **Action `registerWithInviteAction`** uložená v `actions.ts`:
  1. Přijme `token`, `telefon` a `heslo` z formuláře instuktora.
  2. Znovu validuje validitu tokenu v DB (security check).
  3. **"E-mail Hack":** K vytvoření e-mailu pro Better Auth se k číslu připojí fixní doména -> e-mail bude `+420777123456@tabor.local`.
  4. Zavolá registraci: `auth.api.signUpEmail({ email: "...", password: "..." })`.
  5. Pomocí `auth.api.setRole` přiřadí roli vyčtenou ze zvacího tokenu.
  6. Upraví uživateli (nebo dodá při registraci dodatečná pole) custom values z tokenu: `turnusId` a `oddilId` + uloží reálné `phoneNumber`.
  7. **Magie ukončení Session:** Vytáhne si z DB přesné datum ukončení daného turnusu v 11:00 a **natvrdo updatuje** čerstvě vytvořenou `session` v databázi, aby její hodnota `expiresAt` odpovídala tomuto datu.
  8. Označí zvací token v databázi jako: `isUsed: true`.

---

## 5. Běžné přihlašování instuktora
- [ ] Upravit Login Formulář, aby měl místo "E-mailu" políčko "Telefon".
- [ ] Upravit Log in logic v `features/auth/components/LoginContainer`:
  1. Klient odešle telefon.
  2. Kód před zavoláním `authClient.signIn.email( { email: telefon + "@tabor.local", heslo } )` k němu opět napevno přidá skrytou doménu.
  3. Hotovo, člověk je přihlášený.
