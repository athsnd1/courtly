import { z } from "zod";


export const taskSchema = z.object({
    title: z.string().min(1),
    assignedTo: z.string().min(1),
    dueDate: z.string()
});

export type TaskSchemaType = z.infer<typeof taskSchema>;