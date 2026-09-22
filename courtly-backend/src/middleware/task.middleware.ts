import z, { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";


export function validateTask (schema: ZodSchema) {

    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: "Invalid task data", error: z.treeifyError(result.error) });
        }

        req.body = result.data;

        next();
    };
};