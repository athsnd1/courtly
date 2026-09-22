import { api } from '../lib/api';

interface CaseTaskProp {
    event: React.SubmitEvent<HTMLFormElement>;
    title: string;
    assignedTo: string;
    dueDate: string;
    caseId: string;
}

export async function createCaseTask ({ event, title, assignedTo, dueDate, caseId }: CaseTaskProp) {

    event.preventDefault();

    const response = await api.post(`/cases/${caseId}/tasks`, {
        title, assignedTo, dueDate
    });

    return response.data;
}