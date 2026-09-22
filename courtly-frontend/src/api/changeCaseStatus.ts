import { api } from "@/lib/api";

interface ChangeCaseStatusProps {
    caseId: string;
    caseStatus: string;
}

export default async function changeCaseStatus ({ caseId, caseStatus }: ChangeCaseStatusProps) {

    const response = await api.patch(`/cases/${caseId}`, { status: caseStatus });

    return response.data;
}