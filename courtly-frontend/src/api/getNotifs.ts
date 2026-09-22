import { api } from "@/lib/api";


export default async function getNotifs () {

    const response = await api.get("/notifications");

    return response.data;
}