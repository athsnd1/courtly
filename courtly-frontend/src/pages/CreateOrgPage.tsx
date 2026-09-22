import { CreateOrganization } from "@clerk/react";
import { GiScales } from "react-icons/gi";

export default function CreateOrgPage() {

  return (
    <div className="h-dvh w-screen bg-bgcol p-4">

      <div className="flex items-center gap-1 text-2xl mb-5">
        <GiScales className="text-sec-navy" />
        <span className="font-sora font-semibold text-sec-navy pt-1">
          Courtly
        </span>
      </div>

      <CreateOrganization
        afterCreateOrganizationUrl="/dashboard"
      />

    </div>
  )
}
