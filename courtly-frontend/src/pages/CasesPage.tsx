import getAllCases from "@/api/getAllCases";
import Breadcrumb from "@/components/Breadcrumb";
import DataTable from "@/components/DataTable";
import PageInfo from "@/components/PageInfo";
import { caseColumns } from "@/components/tables/case-columns";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import NoCases from "@/components/NoCases";


export default function CasesPage() {

  const { data: cases, isPending, isError, error } = useQuery({
    queryKey: ["cases"],
    queryFn: getAllCases
  });

  const navigate = useNavigate();

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
    <div className="w-full h-full">

      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <Breadcrumb firstPage="Dashboard" secondPage="Cases"/>
          <PageInfo page_name="Cases" page_summary="Keep up with the cases you're tracking."/>
        </div>

        <Button className="bg-navy font-sora h-[40px] hover:bg-sec-navy hover:scale-99 cursor-pointer hover:opacity-95 text-[0.9rem]" onClick={() => {navigate("/dashboard/create-case")}}>
          <LuPlus />
          <span>Create New Case</span>
        </Button>
      </div>

      <div className="mt-6 bg-cards w-full border-1 border-border rounded-md p-4 max-h-[500px] overflow-y-auto">

        <div className="font-sora text-prim-text mb-4">My Cases</div>

        {cases ? <DataTable columns={caseColumns} data={cases} onRowClick={(caseItem) => navigate(`/dashboard/cases/${caseItem.id}`)}/> : 
        <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
          <NoCases textToShow="You haven't created any cases yet"/>
        </div>}

        
      </div>
    </div>
  )
}
