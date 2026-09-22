import { api } from "@/lib/api";



interface DeleteCaseTaskProp {
    caseId: string;
    taskId: string;
}

export async function deleteCaseTask ({ caseId, taskId }: DeleteCaseTaskProp) {

    const response = await api.delete(`/cases/${caseId}/tasks/${taskId}`);

    return response.data;
}