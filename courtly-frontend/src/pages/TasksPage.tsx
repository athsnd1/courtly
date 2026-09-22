import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import DataTable from "@/components/DataTable";
import NoCases from "@/components/NoCases";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { taskColumns } from "@/components/tables/tasks-columns";
import type { Task } from "@/types/case.type";
import formatDate from "@/lib/formatDate";


export default function TasksPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/cases/tasks");
      return response.data;
    }
  });

  const tasks = data?.tasks;
  const tasksDue = data?.tasksDue;

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
      <Breadcrumb firstPage="Dashboard" secondPage="Tasks"/>
      <PageInfo page_name="Tasks" page_summary="Manage and track all your case tasks."/>

      <div className="flex flex-col gap-4">

        <div className="bg-cards p-4 border-1 border-border rounded-md w-full h-max mt-4 max-h-[500px] overflow-y-auto">

          <div className="font-sora text-navy mb-4">My Tasks</div>

          {tasks ? <DataTable columns={taskColumns} data={tasks}/> : 
          <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
            <NoCases textToShow="You haven't created any tasks yet"/>
          </div>}

        </div>

        <div className="flex flex-col xs:flex-row w-full gap-4">



          <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4">

            <div className="font-sora text-navy mb-2">Due Soon</div>

            {tasksDue ?

              <div className="flex flex-col gap-4 border-1 border-border p-3 rounded-md">

                {tasksDue.map((task: Task) => (

                  <div key={task.id} className="flex gap-2 border-b-1 border-border pb-2">

                    <div className="flex flex-col gap-1">

                      <div className={`font-sora w-full ${task.status === "COMPLETED" ? "line-through text-gray-500" : "text-navy"} text-sm`}>{task.title}</div>
                      
                      <div className="w-full flex items-center gap-1 flex-wrap"> 
                        <div className="font-jet text-xs text-gray-400">
                          Due: 
                          <span className="text-red-500 ml-1">
                            {new Date(task.dueDate!).getDay() === new Date().getDay() ? `Today, ${formatDate(task.dueDate!)}` : formatDate(task.dueDate!)}
                          </span>
                        </div> 
                        <span className="text-xs text-gray-400">•</span>
                        <span className="font-jet text-xs text-gray-400">Assignee: {task.assignee?.name}</span>
                      </div>

                    </div>

                  </div>
                ))}
               
              </div>
              
              :

              (<div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                <NoCases textToShow="No tasks due soon"/>
              </div>
            )
              
            }

          </div>

          <div className="w-full h-full p-4 bg-cards border-1 border-border rounded-md mt-4 flex flex-col gap-3">
            <div className="font-sora text-navy">Create New Task</div>

            <p className="font-sora text-sec-text">Pick a case now to add a new task.</p>

            <Button className="bg-navy font-sora text-white h-[35px] hover:bg-active-dot hover:opacity-95 cursor-pointer text-[0.9rem]" onClick={() => {navigate("/dashboard/cases")}}>
              <LuPlus />
              <span>New Task</span>
            </Button>
          </div>

        </div>
        

      </div>
      
    </div>
  )
}
