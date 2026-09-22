import { api } from "@/lib/api";

interface CaseNotePropType {
    event: React.SubmitEvent<HTMLFormElement>;
    caseId: string;
    note: string;
    visibility: string;
}

export default async function createCaseNote ({ event, caseId, note, visibility }: CaseNotePropType) {

    event.preventDefault();

    const response = api.post(`/cases/${caseId}/notes`, { note, visibility });

    return (await response).data;

};