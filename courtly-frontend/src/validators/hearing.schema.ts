import { z } from "zod";

export const hearingSchema = z.object({
    date: z.string(),
    time: z.string(),
    court: z.string().min(1, "Please specify a court"),
    description: z.string().optional()
});

export type HearingData = z.infer<typeof hearingSchema>;