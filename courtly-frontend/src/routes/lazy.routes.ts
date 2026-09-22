import { lazy } from "react";

export const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
export const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
export const CasesPage = lazy(() => import("@/pages/CasesPage"));
export const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
export const ActivityPage = lazy(() => import("@/pages/ActivityPage"));
export const TasksPage = lazy(() => import("@/pages/TasksPage"));
export const DocumentsPage = lazy(() => import("@/pages/DocumentsPage"));
export const CreateOrgPage = lazy(() => import("@/pages/CreateOrgPage"));
export const EditCasePage = lazy(() => import("@/pages/EditCasePage"));
export const CaseInfoPage = lazy(() => import("@/pages/CaseInfoPage"));
export const OrgInfoPage = lazy(() => import("@/pages/OrgInfoPage"));
export const EditOrgPage = lazy(() => import("@/pages/EditOrgPage"));
export const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
export const AddCasePage = lazy(() => import("@/pages/AddCasePage"));