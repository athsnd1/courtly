import type { Response } from "express";

const clients = new Map<string, Set<Response>>();

export function addClient (userId: string, res: Response) {

    if (!clients.has(userId)) {
        clients.set(userId, new Set());
    }

    clients.get(userId)!.add(res);

};

export function removeClient (userId: string, res: Response) {

    clients.get(userId)?.delete(res);

    if (clients.get(userId)?.size === 0) {
        clients.delete(userId);
    }

};

export function sendNotifications (userId: string) {

    const userClients = clients.get(userId);

    if (!userClients) return;

    for (const res of userClients) {
        res.write("event: notification\n");
        res.write("data: new\n\n");
    }
}