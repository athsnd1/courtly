import { verifyWebhook } from "@clerk/express/webhooks";
import express from "express";
import * as WebhookService from "../services/webhooks.service";
import logger from "../config/logger.config";
import crypto from "crypto";

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
                logger.info(`Unhandled webhook event type: ${event.type}`);
        }

        res.status(200).json({ status: "Success" });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

});

router.post("/paystack", express.raw({ type: "application/json" }), async (req, res) => {

    try {

        const signature = req.headers["x-paystack-signature"];

        const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(req.body).digest("hex");

        if (hash !== signature) {
            return res.status(401).json({
                message: "Invalid signature",
            });
        }

        const event = JSON.parse(req.body.toString());

        console.log(event);

        if (event.event === "subscription.create") {
            await WebhookService.handleSubCreate(event.data);
        }

        if (event.event === "charge.success") {
            await WebhookService.handlePaymentSuccess(event.data);
        } 
        
        if (event.event === "subscription.disable") {
            await WebhookService.handleSubDisable(event.data);
        } 

        if (event.event === "subscription.not_renew") {
            await WebhookService.handleSubNotRenew(event.data);
        }

        return res.sendStatus(200);
        
    } catch (error) {
        logger.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }

});

export default router;