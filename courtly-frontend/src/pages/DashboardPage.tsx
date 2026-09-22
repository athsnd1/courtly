import Breadcrumb from "@/components/Breadcrumb";
import GreetingSummary from "@/components/GreetingSummary";
import StatsCard from "@/components/StatsCard";
import { useUser } from "@clerk/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { LuAlarmClock, LuCalendar, LuFileArchive, LuFolderClock, LuList, LuPlus, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import getAllCases from "@/api/getAllCases";
import DataTable from "@/components/DataTable";
import NoCases from "@/components/NoCases";
import { caseColumns } from "@/components/tables/case-columns";
import formatDate from "@/lib/formatDate";
import type { Hearing } from "@/types/case.type";
import { GiGreekTemple } from "react-icons/gi";
import getActivities from "@/api/getActivities";
import getHearings from "@/api/getHearings";
import { activitiesColumns } from "@/components/tables/activities-columns";


export default function DashboardPage() {

  const { user } = useUser();

  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await api.get("/cases/data");
      return response.data;
    }
  });

  const { data: cases, isPending: casesPending, isError: isCasesError, error: casesError } = useQuery({
    queryKey: ["cases"],
    queryFn: getAllCases
  });

  const { data: activities, isPending: acPending, isError: isAcError, error: acError } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities
  });

  const { data: hearings, isPending: hPending, isError: isHError, error: hError } = useQuery({
    queryKey: ["hearings"],
    queryFn: getHearings
  });

  const { numCases, numHearings, numTasks, numDocs } = data ?? 0;

  useEffect(() => {
    if (isError && error || isCasesError && casesError || isHError && hError || isAcError && acError) {
      toast.error(error?.message || casesError?.message || hError?.message || acError?.message || 'Something went wrong!');
    }

  }, [isError, error, isCasesError, casesError, isHError, hError, isAcError, acError]);

  if (isPending || casesPending || hPending || acPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />
  }

  return (
    <div className="text-navy h-full w-full">

      <Breadcrumb firstPage="Home" secondPage="Dashboard" />

      <div className="flex items-center justify-between">
        <GreetingSummary username={user?.firstName ?? "User"} summary="Here's what's happening with your cases today." />

        <button className="bg-navy text-cards p-2 rounded-md flex items-center gap-1 hover:bg-sec-navy hover:opacity-80 transition-all text-sm font-sora shrink-0 cursor-pointer"
        onClick={() => { navigate("create-case")}}>
          <LuPlus />
          <span>New Case</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-4">
        <StatsCard title="Active Cases" value={numCases || 0} Icon={LuFolderClock} firstTwo={true}/>

        <StatsCard title="Upcoming Hearings" value={numHearings || 0} Icon={LuAlarmClock} firstTwo={true}/>

        <StatsCard title="Pending Tasks" value={numTasks || 0} Icon={LuList} firstTwo={false}/>

        <StatsCard title="Documents Uploaded" value={numDocs || 0} Icon={LuFileArchive} firstTwo={false}/>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-wrap">
        <div className="flex flex-col gap-4 w-full">
          <div className="mt-6 bg-cards w-full border-1 border-border rounded-md p-4 max-h-[500px] overflow-y-auto">

            <div className="font-sora text-prim-text mb-4">My Cases</div>

            {cases ? <DataTable columns={caseColumns} data={cases} onRowClick={(caseItem) => navigate(`/dashboard/cases/${caseItem.id}`)}/> : 
            <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
              <NoCases textToShow="You haven't created any cases yet"/>
            </div>}

          </div>

          <div className="mt-6 bg-cards w-full max-h-[400px] overflow-y-auto border-1 border-border rounded-md p-4">

            <div className="font-sora text-navy mb-4">Recent Activity</div>

            { activities?.events ? <DataTable columns={activitiesColumns} data={activities?.events}/> :
              <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="No activities to report yet"/>
              </div> }
            
          </div>

        </div>

        {/* Hearings */}
          <div className="flex flex-col bg-cards border-1 border-border p-4 w-full h-max rounded-md mt-6">

            <div className="font-sora text-navy">Upcoming Hearings</div>

            <div className="flex flex-col gap-1 w-full overflow-y-auto max-h-[400px] mt-4 rounded-md mb-4">

              { hearings?.length <= 0 ? (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="No hearings to look forward to" Icon={GiGreekTemple}/>
              </div>
            ) : hearings?.map((hearing: Hearing) => (
                <div key={hearing.id} className={`flex gap-2 mt-1 pb-2 pl-3 relative before:absolute before:h-full before:left-1 ${new Date(hearing.date).getDay() === new Date().getDay() ? "before:bg-red-500" : "before:bg-icon-green"}  before:w-[3px] before:rounded-full`}>

                  <div className="flex flex-col gap-1">

                    <div className="font-sora w-full text-navy text-sm">{hearing.description || "No description provided for this hearing"}</div>
                    
                    <div className="w-full flex items-center gap-1"> 
                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        <LuCalendar className="-mt-0.5"/>
                        <span>{new Date(hearing.date).getDay() === new Date().getDay() ? `Today, ${formatDate(hearing.date)}` : formatDate(hearing.date)}</span>
                      </div> 

                      <span className="text-xs text-gray-400">•</span>

                      <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                        <LuUser className="-mt-0.5"/>
                        <span>{hearing.hearingCreator.name}</span>
                      </div> 

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
      </div>

    </div>
  )
}
