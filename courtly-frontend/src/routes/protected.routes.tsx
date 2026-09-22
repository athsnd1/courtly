import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" />
    }

  return children;
}
