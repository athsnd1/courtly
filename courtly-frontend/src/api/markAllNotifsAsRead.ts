import { api } from "@/lib/api";


export default async function markAllNotifsAsRead () {

    const response = await api.patch("/notifications/all");

    return response.data;
}