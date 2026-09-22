import { api } from "@/lib/api";


export default async function deleteCaseHearing ({ caseId, hearingId }: { caseId: string, hearingId: string }) {

    const response = await api.delete(`/cases/${caseId}/hearings/${hearingId}`);

    return response.data;
}