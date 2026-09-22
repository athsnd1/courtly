export type CaseType =
  | "CIVIL"
  | "CRIMINAL"
  | "CORPORATE"
  | "COMMERCIAL"
  | "FAMILY"
  | "LABOR"
  | "PROPERTY"
  | "TAX"
  | "OTHER";

export type CaseStatus =
  | "ACTIVE"
  | "CLOSED"
  | "PENDING";

export type PartyType =
  | "PLAINTIFF"
  | "DEFENDANT"
  | "CLAIMANT"
  | "RESPONDENT"
  | "APPELLANT"
  | "APPELLEE"
  | "PETITIONER"
  | "WITNESS"
  | "VICTIM"
  | "ACCUSED"
  | "COMPLAINANT"
  | "INTERVENOR"
  | "THIRD_PARTY"
  | "OTHER";


export type EventType =
  | "ORG_CREATED"
  | "CASE_CREATED"
  | "DOCUMENT_UPLOADED"
  | "LAWYER_ASSIGNED"
  | "TASK_ASSIGNED"
  | "TASK_DELETED"
  | "STATUS_CHANGED"
  | "HEARING_SCHEDULED"
  | "NOTE_DELETED"
  | "NOTE_ADDED"
  | "DOCUMENT_DELETED";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED";

export type NoteVisibility =
  | "PRIVATE"
  | "ORGANIZATION";

export interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  orgId: string | null;
}

export interface Organization {
  id: string;
  clerkOrgId: string;
  name: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: CaseType;
  status: CaseStatus;
  description: string | null;
  orgId: string;
  createdBy: string;
}

export interface CaseLawyer {
  caseId: string;
  lawyerId: string;
}

export interface CaseParty {
  id: string;
  caseId: string;
  name: string;
  type: PartyType;
}

export interface Document {
  id: string;
  caseId: string;
  uploadedBy: string;
  name: string;
  path: string;
  type: string;
  size: string;
  uploader: User;
  case: Case;
  dateCreated: string;
}

export interface CaseEvent {
  id: string;
  caseId: string;
  type: EventType;
  description: string;
  createdBy: string;
  date: string;
}

export interface Task {
  id: string;
  caseId: string;
  assignedTo: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  assignee?: User;
}

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  court: string;
  hearingCreator: User;
  case: Case;
  description: string | null;
}

export interface Note {
  id: string;
  caseId: string;
  authorId: string;
  content: string;
  visibility: NoteVisibility;
  createdAt: string;

  author?: User;
}

export interface CaseDetails extends Case {
  lawyers: CaseLawyer[];
  caseParties: CaseParty[];
  caseDocuments: Document[];
  caseEvents: CaseEvent[];
  caseTasks: Task[];
  caseHearings: Hearing[];
  caseNotes: Note[];
}

export interface FullCase {
  id: string;
  caseNumber: string;
  title: string;
  type: CaseType;
  status: CaseStatus;
  description: string | null;
  orgId: string;
  createdBy: string;

  lawyers: CaseLawyer[];
  caseParties: CaseParty[];
  caseDocuments: Document[];
  caseEvents: CaseEvent[];
  caseTasks: Task[];
  caseHearings: Hearing[];
  caseNotes: Note[];
}

export enum NotificationType {
  CASE_CREATED = "CASE_CREATED",
  LAWYER_ASSIGNED = "LAWYER_ASSIGNED",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  STATUS_CHANGED = "STATUS_CHANGED",
  HEARING_SCHEDULED = "HEARING_SCHEDULED",
  DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
  NOTE_ADDED = "NOTE_ADDED",
}

export interface Notification {
  id: string;
  userId: string;
  caseId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;

  user: User
  case: Case
}