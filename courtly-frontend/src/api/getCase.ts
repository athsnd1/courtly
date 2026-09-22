import { api } from "@/lib/api";


export default async function getCase (caseId: string) {

    const response = await api.get(`/cases/${caseId}`);

    return response.data;
}