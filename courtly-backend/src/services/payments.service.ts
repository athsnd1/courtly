import axios from "axios";
import logger from "../config/logger.config";
import prisma from "../config/prisma.config";

export async function handleSub (subData: { email: string, orgId: string }) {

    try {
        
        const { email, orgId } = subData;

        const org = await prisma.organization.findUnique({
            where: {
                clerkOrgId: orgId
            }
        });

        if (!org) {
            throw new Error("Organization not found")
        }

        const reference = `courtly-${orgId}-${Date.now()}`;

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                plan: process.env.PAYSTACK_PRO_PLAN_CODE,
                reference
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
            }
        );

        await prisma.payment.create({
            data: {
                orgId: org.id,
                plan: "PRO",
                amount: 5000,
                currency: "NGN",
                status: "PENDING",
                provider: "PAYSTACK",
                providerRef: response.data.data.reference
            }
        });

        return {
            authorizationUrl: response.data.data.authorization_url,
            reference: response.data.data.reference
        };

    } catch (error) {
        console.error(error);
        throw error;
    }
};
