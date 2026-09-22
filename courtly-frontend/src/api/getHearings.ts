import { api } from "@/lib/api";

export default async function getHearings () {

    const response = await api.get("/cases/hearings");

    return response.data;
}