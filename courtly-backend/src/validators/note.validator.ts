import { z } from "zod";

export const noteSchema = z.object({
    note: z.string().min(1),
    visibility: z.enum(["PRIVATE", "ORGANIZATION"])
});

export type NoteType = z.infer<typeof noteSchema>;