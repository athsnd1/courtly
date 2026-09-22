import { api } from "@/lib/api";


export default async function findCases (search: string) {
    const response = await api.get(`/cases`, {
        params: { search },
    });

    return response.data;
};