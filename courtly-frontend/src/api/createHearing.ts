import { api } from "@/lib/api";
import type { HearingData } from "@/validators/hearing.schema";

type CreateHearingProp = {
    hearingData: HearingData;
    caseId: string;
}

export default async function createHearing ({ hearingData, caseId }: CreateHearingProp) {

    const response = await api.post(`/cases/${caseId}/hearings`, hearingData);

    return response.data;
}