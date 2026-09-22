import { api } from "@/lib/api";



export default async function getActivities () {
    const response = await api.get("/cases/activities");

    return response.data;
}