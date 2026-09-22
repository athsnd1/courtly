import Breadcrumb from "@/components/Breadcrumb";
import DataTable from "@/components/DataTable";
import PageInfo from "@/components/PageInfo";
import { documentColumns } from "@/components/tables/document-columns";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NoCases from "@/components/NoCases";
import { LuBox, LuCalendar, LuFileText, LuPlus, LuUser } from "react-icons/lu";
import formatDate from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Document } from "@/types/case.type";


export default function DocumentsPage() {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["docs"],
    queryFn: async () => {
      const response = await api.get("/cases/documents");
      return response.data;
    }
  });

  const documents = data?.documents;
  const recentDocs = data?.recentDocs;

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
    return <ErrorPage />
  }

  return (
    <div className="w-full h-full pb-25">
      <Breadcrumb firstPage="Dashboard" secondPage="Documents"/>
      <PageInfo page_name="Documents" page_summary="Manage and search across your case files."/>

      <div className="flex flex-col gap-4">

        <div className="bg-cards p-4 border-1 border-border rounded-md w-full h-max mt-4 max-h-[500px] overflow-y-auto">

          <div className="font-sora text-navy mb-4">My Documents</div>

          {documents ? <DataTable columns={documentColumns} data={documents}/> : 
          <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
            <NoCases textToShow="You haven't added any document yet"/>
          </div>}

        </div>

        <div className="flex flex-col xs:flex-row w-full gap-4">

          {/* Recently Added cases */}
          <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4">

            <div className="font-sora text-navy mb-4">Recently Added</div>

            {recentDocs ?

            <div className="flex flex-col gap-4">
                {recentDocs.map((doc: Document) => (
                  <div key={doc.id} className="flex gap-2 overflow-x-auto">

                    <LuFileText className="text-xl text-gray-500"/>

                    <div className="flex flex-col gap-1">
                    
                      <div className="font-sora w-full text-navy text-sm">{doc.name}</div>
                      
                      <div className="w-full flex items-center gap-1">

                        <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                          <LuUser />
                          <span className="">{doc.uploader.name}</span>
                        </div>

                        <span className="text-xs text-gray-400">•</span>

                        <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                          <LuCalendar className="-mt-0.5"/>
                          <span className="">{formatDate(doc.dateCreated)}</span>
                        </div> 

                        <span className="text-xs text-gray-400">•</span>

                        <div className="font-jet text-xs text-gray-400 flex items-center gap-1">
                          <LuBox />
                          <span className="">{doc.size}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
              
              :

              (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="You haven't added any documents yet"/>
              </div>
            )
              
            }

          </div>

          <div className="w-full h-full p-4 bg-cards border-1 border-border rounded-md mt-4 flex flex-col gap-3">
            <div className="font-sora text-navy">Upload a Document</div>

            <p className="font-sora text-sec-text">Pick a case and upload a document of your choice now.</p>

            <Button className="bg-navy font-sora text-white h-[35px] hover:bg-active-dot hover:opacity-95 cursor-pointer text-[0.85rem]" onClick={() => {navigate("/dashboard/cases")}}>
              <LuPlus />
              <span>New Document</span>
            </Button>
          </div>

        </div>
        

      </div>
      
    </div>
  )
}
