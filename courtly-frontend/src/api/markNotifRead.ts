import { api } from "@/lib/api";

interface MarkNotifReadProps {
    notifId: string;
    readStatus: boolean
};

export default async function markNotifRead ({ notifId, readStatus }: MarkNotifReadProps) {

    const response = await api.patch(`/notifications/${notifId}`, {
        readStatus: readStatus
    });

    return response.data;
}