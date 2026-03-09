import {
  headManager,
  headProgramManager,
  instructor,
  programManager,
} from "./permissions";

/**
 * Regex pro české telefonní číslo (9 číslic bez předvolby).
 * Příklad: "123456789"
 */
export const CZECH_PHONE_REGEX = /^\d{9}$/;

/** Předvolba pro české telefonní číslo */
export const CZECH_PHONE_PREFIX = "+420";

export const ROLES = {
  STRINGS: [
    "instructor",
    "programManager",
    "headProgramManager",
    "headManager",
  ] as const,
  OBJECTS: {
    instructor,
    programManager,
    headProgramManager,
    headManager,
  },
};
