import { OrganizationProfile } from "@clerk/react";
import { motion } from "motion/react";

export default function OrgInfoPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-full w-full flex items-center justify-center overflow-y-auto scrollbar-gutter-stable scrollbar-none pt-15 xs:pt-30 sm:pt-50 mb-15">

    <div className="w-full mx-auto ml-10">
      <OrganizationProfile 
        appearance={{
            options: {
            elevation: "flush",
            unsafe_disableDevelopmentModeWarnings: true,
            }
        }}
      />
    </div>
      
    </motion.div>
  )
}
