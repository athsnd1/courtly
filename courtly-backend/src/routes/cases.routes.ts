import express from "express";
import { validate } from "../middleware/validate.middleware";
import { CaseSchema } from "../validators/case.validator";
import * as CasesController from "../controllers/cases.controller";
import { validateNote } from "../middleware/note.middleware";
import { noteSchema } from "../validators/note.validator";
import { validateTask } from "../middleware/task.middleware";
import { taskSchema } from "../validators/task.validator";
import { validateHearing } from "../middleware/hearing.middleware";
import { hearingSchema } from "../validators/hearing.validator";

const router = express.Router();

router.post("/", validate(CaseSchema), CasesController.createCaseController);

// Static GET routes first
router.get("/", CasesController.getAllCasesController);
router.get("/documents", CasesController.getAllDocsController);
router.get("/activities", CasesController.getCaseActivitiesController);
router.get("/tasks", CasesController.getCaseTasksController);
router.get("/hearings", CasesController.getHearingsController);
router.get("/data", CasesController.getDataController);

// Static/specific routes before dynamic :id routes
router.get("/:caseId/documents/:docId/url", CasesController.getDocUrlController);

// POST
router.post("/:id/documents", CasesController.addDocumentController);
router.post(
  "/:caseId/notes",
  validateNote(noteSchema),
  CasesController.createNoteController
);
router.post(
  "/:caseId/tasks",
  validateTask(taskSchema),
  CasesController.createTaskController
);
router.post(
  "/:caseId/hearings",
  validateHearing(hearingSchema),
  CasesController.createHearingController
);

// DELETE
router.delete("/:caseId/documents/:docId", CasesController.deleteDocumentController);
router.delete("/:caseId/notes/:noteId", CasesController.deleteNoteController);
router.delete("/:caseId/tasks/:taskId", CasesController.deleteTaskController);
router.delete("/:caseId/hearings/:hearingId", CasesController.deleteHearingController);
router.delete("/:id", CasesController.deleteCaseController);

// PATCH
router.patch("/:caseId", CasesController.changeStatusController);
router.patch(
  "/:caseId/tasks/:taskId",
  CasesController.changeTaskStatusController
);

// Dynamic case route LAST
router.get("/:id", CasesController.getCaseController);

export default router;