import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.config";
import { getOrg } from "../utils/getOrg";


export async function requirePro (req: Request, res: Response, next: NextFunction) {

    const { orgId } = getAuth(req.body);

    const org = await getOrg(orgId as string);

    const orgSub = await prisma.subscription.findUnique({
        where: {
            orgId: org.id
        }
    });

    const isPro = orgSub?.plan === "PRO" && orgSub?.status === "ACTIVE";

    if (!isPro) {
        return res.status(401).json({ message: "Pro subscription needed to access this feature" });
    }

    next();
}