import { z } from "zod";
import { FIXED_TERMS_2026 } from "./config";

export const TERM_KEYS = FIXED_TERMS_2026.map((term) => term.termKey) as [
  string,
  ...string[],
];

export const TermKeyEnum = z.enum(TERM_KEYS);
