import Sidebar from "@/components/Sidebar";
import BottomBar from "@/components/BottomBar";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useOrganization } from "@clerk/react";

export default function DashboardLayout() {

  const { organization, isLoaded } = useOrganization();

  useEffect(() => {

    if (!isLoaded) return;

    const newOrgMsgShown = JSON.parse(localStorage.getItem("newOrgMsgShown") ?? "false");

    if (organization && !newOrgMsgShown) {
      toast.success(`Welcome to ${organization?.name}`);

      localStorage.setItem("newOrgMsgShown", JSON.stringify(true));
    }

  }, [isLoaded, organization]);

  return (
    <div className="w-screen h-screen flex items-center pt-[60px] ">

        <Sidebar />

        <div className="h-full flex-1 flex flex-col bg-bgcol min-w-0 sm:ml-[180px] shrink-0">
            <Navbar />
            
            <div className="flex-1 h-max overflow-y-auto p-4 mb-5">
                <Outlet />
            </div>

            <BottomBar />
        </div>

    </div>
  )
}
