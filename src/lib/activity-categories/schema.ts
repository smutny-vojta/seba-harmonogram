import { z } from "zod";
import { ACTIVITY_CATEGORIES_ARRAY } from "./config";

export const ActivityCategoryEnum = z.enum(ACTIVITY_CATEGORIES_ARRAY);
