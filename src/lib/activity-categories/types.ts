import type { z } from "zod";
import { ACTIVITY_CATEGORIES } from "./config";
import type { ActivityCategoryEnum } from "./schema";

export type ActivityCategory = z.infer<typeof ActivityCategoryEnum>;
export type ActivityCategoryMeta =
  (typeof ACTIVITY_CATEGORIES)[ActivityCategory];
