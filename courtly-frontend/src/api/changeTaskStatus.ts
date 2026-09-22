import { api } from "@/lib/api";

interface ChangeTaskStatusProp {
    caseId: string;
    taskId: string;
    status: string;
}

export async function changeTaskStatus ({ caseId, taskId, status }: ChangeTaskStatusProp ) {
    const response = await api.patch(`/cases/${caseId}/tasks/${taskId}`, { status });

    return response.data;
}