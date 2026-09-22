import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import LoadingPage from "@/pages/LoadingPage";
import WelcomePage from "@/pages/WelcomePage";
import { DashboardPage, ActivityPage, CalendarPage, CasesPage, NotificationsPage, TasksPage, DocumentsPage, EditCasePage, CaseInfoPage, EditOrgPage, OrgInfoPage, SettingsPage, AddCasePage } from "./lazy.routes";
import ErrorPage from "@/pages/ErrorPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import SignUpPage from "@/pages/SignUpPage";
import SignInPage from "@/pages/SignInPage";
import CreateOrgPage from "@/pages/CreateOrgPage";
import ProtectedRoute from './protected.routes';
import ChooseOrgPage from "@/pages/ChooseOrgPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";

const router = createBrowserRouter([

    {
        path: "/",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <WelcomePage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/privacy",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <PrivacyPolicyPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/terms",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <TermsPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/sign-up",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <SignUpPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/sign-in",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <SignInPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/create-organization",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute>
                    <CreateOrgPage />
                </ProtectedRoute>
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/choose-organization",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <ChooseOrgPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    },

    {
        path: "/dashboard",
        element: <Suspense fallback={<LoadingPage />}>
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                </Suspense>,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <DashboardPage />
                    </Suspense>
                )
            },

            {
                path: "cases",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <CasesPage />
                    </Suspense>
                )
            },

            {
                path: "cases/:id",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <CaseInfoPage />
                    </Suspense>
                ),
                errorElement: <ErrorPage />
            },

            {
                path: "cases/edit/:id",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <EditCasePage />
                    </Suspense>
                ),
                errorElement: <ErrorPage />
            },

            {
                path: "calendar",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <CalendarPage />
                    </Suspense>
                )
            },

            {
                path: "tasks",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <TasksPage />
                    </Suspense>
                )
            },
            {
                path: "documents",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <DocumentsPage />
                    </Suspense>
                )
            },

            {
                path: "notifications",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <NotificationsPage />
                    </Suspense>
                )
            },

            {
                path: "activity",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <ActivityPage />
                    </Suspense>
                )
            },

            {
                path: "organization",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <OrgInfoPage />
                    </Suspense>
                )
            },

            {
                path: "organization/edit/:id",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <EditOrgPage />
                    </Suspense>
                )
            },

            {
                path: "settings",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <SettingsPage />
                    </Suspense>
                )
            },

            {
                path: "create-case",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AddCasePage />
                    </Suspense>
                )
            },
        ],
        errorElement: <ErrorPage />
    }
]);


export default router;