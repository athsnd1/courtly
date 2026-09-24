import express from "express";
import * as NotifController from "../controllers/notifications.controller";
import { validateNotifStatus } from "../middleware/notif.middleware";
import { notifStatusSchema } from "../validators/notif.validator";

const router = express.Router();

router.get("/", NotifController.getNotificationsController);

router.get("/stream", NotifController.notifStreamController);

router.patch("/all", NotifController.markAllAsReadController);

router.patch("/:notifId", validateNotifStatus(notifStatusSchema), NotifController.changeNotifStatusController);

router.delete("/:notifId", NotifController.deleteNotifController);

export default router;