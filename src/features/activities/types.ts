import z from "zod";
import { ActivityLocationSchema, NewActivityLocationSchema } from "./schema";

export type ActivityLocationType = z.infer<typeof ActivityLocationSchema>;

export type NewActivityLocationType = z.infer<typeof NewActivityLocationSchema>;
