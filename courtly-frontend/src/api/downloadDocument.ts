import { api } from "@/lib/api";

export default async function downloadDocument (caseId: string, docId: string) {

    const response = await api.get(`/cases/${caseId}/documents/${docId}/url?download=true`);

    const link = document.createElement("a");
    link.href = response.data;
    link.download = `${response.data}-${Date.now()}`;
    link.click();
};