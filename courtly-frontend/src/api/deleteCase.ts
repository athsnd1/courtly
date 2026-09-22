import { api } from "@/lib/api";


export default async function deleteCase (caseId: string) {
    const response = await api.delete(`/cases/${caseId}`);

    return response.data;
}