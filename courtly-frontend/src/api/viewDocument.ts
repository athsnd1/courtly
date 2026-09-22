import { api } from "@/lib/api";


export default async function viewDocument (caseId: string, docId: string) {

    const response = await api.get(`/cases/${caseId}/documents/${docId}/url`);

    window.open(response.data, "_blank");
};