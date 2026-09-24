import type { Request, Response } from "express";
import { getLawyers } from "../services/lawyers.service";
import { getAuth } from "@clerk/express";

export async function getLawyersController (req: Request, res: Response) {

    const { orgId, userId } = getAuth(req);
    const { search } = req.query;

    const lawyers = await getLawyers(userId as string, orgId!, search as string);

    res.json(lawyers);
}