import { verifyWebhook } from "@clerk/express/webhooks";
import express from "express";
import * as WebhookService from "../services/webhooks.services";

const router = express.Router();

router.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  
    try {
        
        const event = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
        });

        switch (event.type) {
            case "user.created":
                await WebhookService.createUser(event.data);
                break;

            case "user.deleted":
                await WebhookService.deleteUser(event.data);
                break;
            
            case "user.updated":
                await WebhookService.updateUser(event.data);
                break;

            case "organization.created":
                await WebhookService.createOrganization(event.data);
                break;

            case "organizationMembership.created":
                await WebhookService.createOrganizationMembership(event.data);
                break;

            case "organizationMembership.deleted":
                await WebhookService.deleteOrganizationMembership(event.data);
                break;

            case "organization.deleted":
                await WebhookService.deleteOrganization(event.data);
                break;
            
            default:
                req.log.info(`Unhandled webhook event type: ${event.type}`);
        }

        res.status(200).json({ status: "Success" });

    } catch (error) {
        req.log.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

});

export default router;