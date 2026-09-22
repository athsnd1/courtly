import { TaskChooseOrganization } from "@clerk/react"
import LoadingPage from "./LoadingPage"

export default function ChooseOrgPage() {
  return (
    <div className="h-dvh w-screen flex items-center justify-center bg-bgcol">
        <TaskChooseOrganization 
            fallback={<LoadingPage />}
            appearance={{
                options: {
                elevation: "flush",
                unsafe_disableDevelopmentModeWarnings: true,
                }
            }}
            redirectUrlComplete="/dashboard"
        />
    </div>
  )
}
