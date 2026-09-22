import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import * as NotifService from "../services/notifications.services";
import { addClient, removeClient } from "../utils/notificationSSE";

export async function getNotificationsController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    const { notifications, unreadCount } = await NotifService.getNotifications(userId as string);

    return res.status(200).json({ notifications, unreadCount });


};

export async function changeNotifStatusController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { notifId } = req.params;
    const readStatus = req.body.readStatus;

    await NotifService.updateNotifStatus(userId as string, notifId as string, readStatus);

    return res.status(200).json({ message: "Notification status changed succesfully" });
};

export async function deleteNotifController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { notifId } = req.params;

    await NotifService.deleteNotif(userId as string, notifId as string);

    return res.status(200).json({ message: "Notification deleted successfully" });
};

export async function notifStreamController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
    });


    res.write(": connected\n\n");

    addClient(userId as string, res);

    req.on("close", () => {
        console.log("SSE CONNECTION CLOSED");
        removeClient(userId as string, res);
    });
};