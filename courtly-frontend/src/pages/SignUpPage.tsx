import { SignUp } from "@clerk/react";
import LoadingPage from "./LoadingPage";


export default function SignUpPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bgcol">
      <SignUp 
        fallback={<LoadingPage />}
        appearance={{
          options: {
            elevation: "flush",
            unsafe_disableDevelopmentModeWarnings: true,
          }
        }}
        signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
        forceRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
      />
    </div>
  )
}
