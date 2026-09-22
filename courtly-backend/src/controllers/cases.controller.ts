import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import * as CaseService from "../services/cases.services";

export async function createCaseController (req: Request, res: Response) {

    const { userId, orgId } = getAuth(req);

    const createdCase = await CaseService.createCase(userId as string, orgId as string, req.body);

    res.status(201).json(createdCase);
};

export async function getCaseController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    const { id: caseId } = req.params;

    const { caseGotten, creatorName, orgName, isCreator } = await CaseService.getCase(caseId as string, userId as string);

    res.status(200).json({ caseGotten, creatorName, orgName, isCreator });

};

export async function getAllCasesController (req: Request, res: Response) {

    const { orgId, userId, orgRole } = getAuth(req);
    const { search } = req.query;

    const cases = await CaseService.getAllCases(orgId as string, userId as string, orgRole as string, search as string);

    res.status(200).json(cases);

};

export async function deleteCaseController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { id: caseId } = req.params;

    await CaseService.deleteCase(caseId as string, userId as string);

    res.status(204).json({ message: "Case deleted successfully" });
};

export async function addDocumentController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { id: caseId } = req.params;

    const docCreated = await CaseService.addDocument(userId as string, caseId as string, req.body);

    if (!docCreated) {
        return res.status(500).json({ message: "Failed to upload document" });
    };

    return res.status(201).json({ message: "Document uploaded successfully" });
};

export async function deleteDocumentController (req: Request, res: Response) {
    
    const { userId } = getAuth(req);
    const { caseId, docId } = req.params;

    await CaseService.deleteDocument(userId as string, caseId as string, docId as string);

    return res.status(204).json({ message: "Document deleted successfully" });

};

export async function getDocUrlController (req: Request, res: Response) {

    const { caseId, docId } = req.params;
    const { download } = req.query;

    const signedUrl = await CaseService.getDocUrl(caseId as string, docId as string, download as string);

    return res.status(200).json(signedUrl);
};

export async function changeStatusController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { caseId } = req.params;
    const { status } = req.body;

    await CaseService.changeCaseStatus(caseId as string, userId as string, status as string);

    return res.status(200).json({ message: "Case updated successfully" });

};

export async function createNoteController (req: Request, res: Response) {

    const { caseId } = req.params;
    const { userId } = getAuth(req);
    const { note, visibility } = req.body;

    await CaseService.createCaseNote(userId as string, caseId as string, note, visibility);

    return res.status(201).json({ message: "Note created successfully" });
};

export async function deleteNoteController (req: Request, res: Response) {

    const { caseId, noteId } = req.params;
    const { userId } = getAuth(req);

    await CaseService.deleteCaseNote(userId as string, caseId as string, noteId as string);

    return res.status(204).json({ message: "Note deleted successfully" });
};

export async function createTaskController (req: Request, res: Response) {

    const { caseId } = req.params;
    const { userId } = getAuth(req);

    await CaseService.createCaseTask(userId as string, caseId as string, req.body );

    return res.status(201).json({ message: "Task created successfully" });
};

export async function deleteTaskController (req: Request, res: Response) {

    const { caseId, taskId } = req.params;
    const { userId } = getAuth(req);

    await CaseService.deleteCaseTask(userId as string, caseId as string, taskId as string);

    return res.status(204).json({ message: "Task deleted successfully" });
};

export async function changeTaskStatusController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { status } = req.body;
    const { caseId, taskId } = req.params;

    await CaseService.changeTaskStatus(userId as string, caseId as string, taskId as string, status as string);

    return res.status(200).json({ message: "Task status changed successfully" });
};

export async function getCaseActivitiesController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    const { events, totalEvents, eventsByType } = await CaseService.getCaseActivities(userId as string);

    return res.status(200).json( { events, totalEvents, eventsByType } );
};

export async function getAllDocsController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    const { documents, recentDocs } = await CaseService.getDocuments(userId as string);

    return res.status(200).json({ documents, recentDocs });
};

export async function getCaseTasksController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    const { tasks, tasksDue } = await CaseService.getCaseTasks(userId as string);

    return res.status(200).json({ tasks, tasksDue });
};

export async function createHearingController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { caseId } = req.params;

    await CaseService.createHearing(userId!, caseId as string, req.body);

    return res.status(200).json({ message: "Hearing created succesfully" });
};

export async function deleteHearingController (req: Request, res: Response) {

    const { userId } = getAuth(req);
    const { caseId, hearingId } = req.params;

    await CaseService.deleteHearing(userId!, caseId as string, hearingId as string);

    return res.status(204).json({ message: "Hearing deleted successfully" });
};

export async function getHearingsController (req:Request, res: Response) {

    const { userId } = getAuth(req);
    
    const hearings = await CaseService.getHearings(userId as string);

    return res.status(200).json(hearings);
};

export async function getDataController (req: Request, res: Response) {

    const { userId } = getAuth(req);

    const { numCases, numHearings, numTasks, numDocs } = await CaseService.getData(userId as string);

    return res.status(200).json({ numCases, numHearings, numTasks, numDocs });
}