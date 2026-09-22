import { api } from "@/lib/api";


interface DeleteCaseNoteProp {
    caseId: string;
    noteId: string;
};

export async function deleteCaseNote ({ caseId, noteId }: DeleteCaseNoteProp) {
    const response = api.delete(`/cases/${caseId}/notes/${noteId}`);

    return (await response).data;
}