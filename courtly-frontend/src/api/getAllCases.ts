import { api } from "@/lib/api";


export default async function getAllCases () {
    const response = await api.get("/cases");
    return response.data;
}