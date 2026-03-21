// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Regex pro české telefonní číslo (9 číslic bez předvolby).
 * Příklad: "123456789"
 */
export const CZECH_PHONE_REGEX = /^\d{9}$/;

/**
 * Regex pro české telefonní číslo (9 číslic S předvolbou).
 * Příklad: "+420123456789"
 */
export const CZECH_PHONE_REGEX_WITH_PREFIX = /^\+420\d{9}$/;

/** Předvolba pro české telefonní číslo */
export const CZECH_PHONE_PREFIX = "+420";

/** Regex pro 6 místný kód */
export const OTP_REGEX = /^\d{6}$/;

/** Regex pro heslo (alespoň 1 velké písmeno, 1 číslo, 8 znaků) */
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
