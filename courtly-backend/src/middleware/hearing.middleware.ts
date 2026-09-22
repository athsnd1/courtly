import type { NextFunction, Request, Response } from "express";
import { z, type ZodSchema } from "zod";
import { hearingSchema } from "../validators/hearing.validator";


export function validateHearing (schema: ZodSchema) {

    return (req: Request, res: Response, next: NextFunction) => {

        const result = hearingSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: "Invalid hearing data", error: z.treeifyError(result.error)});
        }

        req.body = result.data;

        next();
    };
};