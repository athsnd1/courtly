import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { getUser } from "../utils/getUser";
import * as PaymentsService from "../services/payments.service";


export async function handleSubController (req: Request, res: Response) {

    try {

        const { userId, orgId } = getAuth(req);

        const user = await getUser(userId as string);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const result = await PaymentsService.handleSub({ email: user.email, orgId: orgId as string });

        return res.status(200).json(result);
        
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            message: "Something went wrong"
        });
    }

};

export async function getCurrentSubController (req: Request, res: Response) {

    const { orgId } = getAuth(req);

    const { plan: orgPlan, status: orgPlanStatus } = await PaymentsService.getCurrentSub(orgId as string);

    return res.status(200).json({ orgPlan, orgPlanStatus });
};

export async function cancelSubController (req: Request, res: Response) {


    try {
        const { userId, orgId } = getAuth(req);

        if (!userId || !orgId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await PaymentsService.cancelSub(orgId as string);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}