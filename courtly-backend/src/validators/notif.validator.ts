import z from "zod";

export const notifStatusSchema = z.object({
    readStatus: z.boolean()
});

