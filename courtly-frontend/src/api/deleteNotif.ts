import { api } from "@/lib/api";


export default async function deleteNotif (notifId: string) {

    const response = await api.delete(`/notifications/${notifId}`);

    return response.data;
}