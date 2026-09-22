import type { NextFunction, Request, Response } from "express";
import { z, type ZodSchema } from "zod";
import { noteSchema } from "../validators/note.validator";


export function validateNote (schema: ZodSchema) {

    return (req: Request, res: Response, next: NextFunction) => {

        const result = noteSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: "Invalid note data", error: z.treeifyError(result.error)});
        }

        req.body = result.data;

        next();
    };
};