import { SignIn } from "@clerk/react";
import LoadingPage from "./LoadingPage";


export default function SignInPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bgcol">
      <SignIn fallback={<LoadingPage />}
          appearance={{
            options: {
              elevation: "flush",
              unsafe_disableDevelopmentModeWarnings: true,
            }
          }}
          signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
        />
    </div>
  )
}
