import { NotificationType } from "@prisma/client";
import prisma from "../config/prisma.config";
import { getUser } from "../utils/getUser";
import { getCaseFromId } from "../utils/getCaseFromId";
import { sendNotifications } from "../utils/notificationSSE";
import { emailQueue } from '../queues/email.queue';



export async function createNotification (clerkUserId: string, caseId: string, notifType: NotificationType, title: string, message: string) {

    const user = await getUser(clerkUserId);

    const caseGotten = await getCaseFromId(caseId);

    await prisma.notification.create({
        data: {
            userId: user.id,
            caseId: caseGotten.id,
            type: notifType,
            title,
            message
        }
    });

    sendNotifications(clerkUserId); //send sse notification

    await emailQueue.add(
        "send-email", 
        {
            to: user.email,
            subject: "Task Assigned",
            message,
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            }
        }
    );

};

export async function createNotifs (clerkUserId: string, caseId: string, notifType: NotificationType, title: string, message: string) {

    const user = await getUser(clerkUserId);

    const caseGotten = await getCaseFromId(caseId);

    const notifsToMake = caseGotten.lawyers.filter(({lawyerId}) => lawyerId != user.id).map(({ lawyer }) => ({
        userId: lawyer.id,
        caseId,
        type: notifType,
        title,
        message
    }));

    if (notifsToMake.length > 0) {
        await prisma.notification.createMany({
            data: notifsToMake,
        });

        for (const notif of notifsToMake) {
            const lawyer = caseGotten.lawyers.find(
                ({ lawyerId }) => lawyerId === notif.userId
            );

            if (lawyer) {
                sendNotifications(lawyer.lawyer.clerkId);
                await emailQueue.add(
                    "send-email", 
                    {
                        to: lawyer.lawyer.email,
                        subject: notifType.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "), 
                        message
                    },
                    {
                        attempts: 3,
                        backoff: {
                            type: "exponential",
                            delay: 5000
                        },
                        removeOnComplete: true,
                        removeOnFail: false
                    }
                );
            }
        }
    }

};

export async function getNotifications (clerkUserId: string) {

    const user = await getUser(clerkUserId);

    const notifications = await prisma.notification.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            case: {
                select: {
                    id: true
                }
            }
        },
        take: 50
    });

    const unreadCount = notifications.filter((notif) => notif.read === false).length ?? 0;

    return { notifications, unreadCount };

};

export async function updateNotifStatus (clerkUserId: string, notifId: string, readStatus: boolean) {

    const user = await getUser(clerkUserId);

    return await prisma.notification.update({
        where: {
            id: notifId,
            userId: user.id
        },
        data: {
            read: readStatus
        }
    });
    
};

export async function deleteNotif (clerkUserId: string, notifId: string) {

    const user = await getUser(clerkUserId);

    return await prisma.notification.delete({
        where: {
            id: notifId,
            userId: user.id
        }
    });

};

export async function markAllAsRead (clerkUserId: string) {

    const user = await getUser(clerkUserId);

    return await prisma.notification.updateMany({
        where: {
            userId: user.id
        },
        data: {
            read: true
        }
    });
};