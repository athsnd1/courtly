import getActivities from "@/api/getActivities";
import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import DataTable from "@/components/DataTable";
import { activitiesColumns } from "@/components/tables/activities-columns";
import NoCases from "@/components/NoCases";
import { LuArchive, LuCalculator, LuFileText, LuListCheck, LuPenLine, LuTrash2 } from "react-icons/lu";


export default function ActivityPage() {

  const { data: activities, isPending, isError, error } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities
  });


  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Something went wrong!');
    }
  }, [isError, error]);

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage errorText={error.message}/>;
  }

  return (
    <div className="w-full h-full mb-50 pb-100">

      <Breadcrumb firstPage="Dashboard" secondPage="Activity"/>
      <PageInfo page_name="Activity" page_summary="Timeline of all actions and case updates."/>

      <div className="flex flex-col gap-6 w-full h-full md:flex-row">

        <div className="mt-6 bg-cards w-full border-1 border-border rounded-md p-4 h-max max-h-[600px] overflow-y-auto">

          <div className="font-sora text-navy mb-4">Here's what's been happening</div>

          { activities.events ? <DataTable columns={activitiesColumns} data={activities.events}/> :
            <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
              <NoCases textToShow="No activities to report yet"/>
            </div> }
          
        </div>

        <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-6 mb-10">
            
            <div className="font-sora text-navy mb-4">Activity Summary</div>

              {activities.totalEvents && activities.eventsByType ?

                <div className="flex gap-6 md:flex-row flex-wrap w-full h-max">

                  <div className="flex items-center gap-2"> 
                    <div className="flex items-center gap-1"> 
                      <LuCalculator className="text-icon-green"/>
                      <span className="font-sora text-sm text-sec-navy">Total Logged Actions:</span>
                    </div>
                    
                    <span className="font-jet text-2xl text-navy">{activities.totalEvents}</span>
                  </div>

                  <div className="flex items-center gap-2"> 
                    <div className="flex items-center gap-1"> 
                      <LuArchive className="text-green-800"/>
                      <span className="font-sora text-sm text-sec-navy">Case Updates:</span>
                    </div>
                    
                    <span className="font-jet text-2xl text-navy">{activities.eventsByType.filter((item) => (item.type.includes("STATUS_CHANGED"))).length}</span>
                  </div>

                  <div className="flex items-center gap-2"> 
                    <div className="flex items-center gap-1"> 
                      <LuFileText className="text-blue-800"/>
                      <span className="font-sora text-sm text-sec-navy">Document Uploads:</span>
                    </div>
                    
                    <span className="font-jet text-2xl text-navy">{activities.eventsByType.filter((item) => (item.type.includes("DOCUMENT_UPLOADED"))).length}</span>
                  </div>

                  <div className="flex items-center gap-2"> 
                    <div className="flex items-center gap-1"> 
                      <LuListCheck className="text-rose-800"/>
                      <span className="font-sora text-sm text-sec-navy">Task Assignments:</span>
                    </div>
                    
                    <span className="font-jet text-2xl text-navy">{activities.eventsByType.filter((item) => (item.type.includes("TASK_ASSIGNED"))).length}</span>
                  </div>

                  <div className="flex items-center gap-2"> 
                    <div className="flex items-center gap-1"> 
                      <LuPenLine className="text-orange-800"/>
                      <span className="font-sora text-sm text-sec-navy">Notes Created:</span>
                    </div>
                    
                    <span className="font-jet text-2xl text-navy">{activities.eventsByType.filter((item) => (item.type.includes("NOTE_ADDED"))).length}</span>
                  </div>

                  <div className="flex items-center gap-2"> 
                    <div className="flex items-center gap-1"> 
                      <LuTrash2 className="text-red-500"/>
                      <span className="font-sora text-sm text-sec-navy">Total Deletions:</span>
                    </div>
                    
                    <span className="font-jet text-2xl text-navy">{activities.eventsByType.filter((item) => (item.type.includes("DELETED"))).length}</span>
                  </div>
                  
                </div>
                
                :

                (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                  <NoCases textToShow="No activities to report yet"/>
                </div>
              )}

        </div>

      </div>

      

    </div>
  )
}
