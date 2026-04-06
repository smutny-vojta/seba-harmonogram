/**
 * Soubor: src/features/auth/consts.ts
 * Ucel: Konstanty feature "auth" pouzivane napric dalsimi vrstvami.
 * Parametry/Vstupy: Staticke mapy, seznamy a defaultni hodnoty.
 * Pozadavky: Bez vedlejsich efektu; pouze deklarativni data.
 */

export const REGEX = {
  /** Regex pro heslo (alespoň 1 velké písmeno, 1 číslo, 8 znaků) */
  PASSWORD: /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/,

  /**
   * Regex pro české telefonní číslo (9 číslic bez předvolby).
   * Příklad: "123456789" (pro formuláře mnohem příjemnější než nutit lidi psát +420)
   */
  PHONE: /^\d{9}$/,
} as const;

export const PHONE_PREFIX = "+420";
