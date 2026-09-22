import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";
import { useNotifications } from "@/hooks/useNotifications";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import {
  BriefcaseBusiness,
  UserRoundPlus,
  ClipboardCheck,
  ArrowRightLeft,
  CalendarDays,
  FileText,
  StickyNote,
  Inbox,
} from "lucide-react";
import { NotificationType, type Notification } from "@/types/case.type";
import { Button } from "@/components/ui/button";
import NoCases from "@/components/NoCases";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCheckCheck, LuTrash2, LuX } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import markNotifRead from "@/api/markNotifRead";
import toast from "react-hot-toast";
import deleteNotif from "@/api/deleteNotif";

const notificationConfig = {
  [NotificationType.CASE_CREATED]: {
    icon: BriefcaseBusiness,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },

  [NotificationType.LAWYER_ASSIGNED]: {
    icon: UserRoundPlus,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },

  [NotificationType.TASK_ASSIGNED]: {
    icon: ClipboardCheck,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },

  [NotificationType.STATUS_CHANGED]: {
    icon: ArrowRightLeft,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },

  [NotificationType.HEARING_SCHEDULED]: {
    icon: CalendarDays,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },

  [NotificationType.DOCUMENT_UPLOADED]: {
    icon: FileText,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },

  [NotificationType.NOTE_ADDED]: {
    icon: StickyNote,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
};


export default function NotificationsPage() {

  const { data, isLoading, isError, error } = useNotifications();

  const navigate = useNavigate();

  const [allSelected, setAllSelected] = useState(true);
  const [unreadSelected, setUnreadSelected] = useState(false);

  const [notifNotSeen, setNotifNotSeen] = useState(JSON.parse(localStorage.getItem("notifNotSeen") || "true"));

  const queryClient = useQueryClient();

  const notifStatusMutation = useMutation({
    mutationFn: markNotifRead,

    onError: () => {
      toast.error("Failed to update notification status");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifs"]
      })
    }
    
  });

  const deleteNotifMutation = useMutation({

    mutationFn: deleteNotif,

    onMutate: () => {
      const toastId = toast.loading("Deleting notification...");
      return { toastId }
    },

    onError: (_error, _variables, context) => {
      toast.error("Failed to delete notification", { id: context?.toastId });
    },

    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["notifs"]
      });
      toast.success("Notification deleted successfully", { id: context?.toastId });
    }
  });

  if (isLoading) {
    return <LoadingPage />
  }

  if (isError) {
    return <ErrorPage errorText={error.message}/>
  }

  const { notifications, unreadCount } = data;

  return (
    <div className="w-full h-full">

      <Breadcrumb firstPage="Dashboard" secondPage="Notifications"/>
      <PageInfo page_name="Notifications" page_summary="Here's what's happening with your cases."/>

      <div className="flex items-center gap-0.5 mt-6 font-sora flex-wrap">
        <span className="text-navy">Filter: </span>
        <Button className={`rounded-full text-[0.9rem] py-1.5 px-3 
          ${allSelected ? "bg-navy text-white" : "bg-cards border-1 border-border text-navy"} ml-1 cursor-pointer hover:bg-navy hover:text-white hover:opacity-95`}
          onClick={() => {setAllSelected(!allSelected); setUnreadSelected(!unreadSelected);}}> All</Button>

        <Button className={`ml-1 rounded-full text-[0.9rem] py-1.5 px-3 
          ${unreadSelected ? "bg-navy" : "bg-cards border-1 border-border text-navy"} cursor-pointer
           hover:bg-navy hover:text-white hover:opacity-95`}
          onClick={() => {setUnreadSelected(!unreadSelected); setAllSelected(!allSelected); }}>Unread ({unreadCount || 0})
        </Button>

        {
          notifNotSeen && 
          <div className="bg-active-bg flex items-center gap-3 py-1 px-2 font-jet text-active text-xs rounded-md border-1 border-active ml-1">
            <span>Click on a notification to mark it as read and visit the related case</span>

            <div 
              className="cursor-pointer p-1 hover:bg-active hover:opacity-50 rounded-sm hover:text-white"
              onClick={() => { setNotifNotSeen(false); localStorage.setItem("notifNotSeen", JSON.stringify(false)); }}
            > 
              <LuX />
            </div>
          </div>
        }

      </div>

      {unreadSelected && 
      <div className="mt-6 flex flex-col gap-2 h-full max-h-[500px] overflow-y-auto">

        {notifications.length > 0 ? notifications.filter((notif: Notification) => notif.read === false).map((notif: Notification) => {
          const config = notificationConfig[notif.type];
          const Icon = config.icon;

          return (
              <div
                key={notif.id}
                className={`p-3 ${notif.read === false ? "bg-cards opacity-100" : "bg-cards opacity-50"} border border-border rounded-md flex gap-4 cursor-pointer hover:opacity-75`}
                onClick={() => { 
                  notifStatusMutation.mutate({ notifId: notif.id as string, readStatus: true })
                  navigate(`/dashboard/cases/${notif.case.id}`); 
                }}
              >
                <div
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${config.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-medium font-sora flex items-center gap-2">
                    <span>{notif.title}</span>

                  </h3>

                  <p className="text-sm text-muted-foreground font-sora">
                    {notif.message}
                  </p>

                  <span className="text-xs text-muted-foreground mt-1 font-jet">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="rounded-md p-2 hover:bg-red-100 h-max cursor-pointer transition-all text-red-500 ml-auto" onClick={(e) => {e.stopPropagation(); deleteNotifMutation.mutate(notif.id); }}> 
                  <LuTrash2 />
                </div>
              </div>
          );
        }) : <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
          <NoCases textToShow="No notifications to show" Icon={Inbox}/>
        </div>}

      </div>}

      {allSelected && 
      <div className="mt-6 flex flex-col gap-2 h-full max-h-[500px] overflow-y-auto">

        {notifications.length > 0 ? notifications.map((notif: Notification) => {
          const config = notificationConfig[notif.type];
          const Icon = config.icon;

          return (
              <div
                key={notif.id}
                className={`p-3 ${Boolean(notif.read) === false ? "bg-cards opacity-100" : "bg-cards opacity-50"} border border-border rounded-md flex gap-4 cursor-pointer hover:opacity-80`}
                onClick={() => { 
                  notifStatusMutation.mutate({ notifId: notif.id as string, readStatus: notif.read === true ? false : true })
                  navigate(`/dashboard/cases/${notif.case.id}`); 
                }}
              >
                <div
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${config.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-medium font-sora flex items-center gap-2">
                    <span>{notif.title}</span>

                    {notif.read === true && 
                    <div className="bg-closed-bg text-prim-text font-jet py-1 px-2 rounded-full border-1 border-closed flex items-center gap-1 text-xs"> 
                      <LuCheckCheck />
                      <span>Read</span>
                    </div>}
                  </h3>

                  <p className="text-sm text-muted-foreground font-sora">
                    {notif.message}
                  </p>

                  <span className="text-xs text-muted-foreground mt-1 font-jet">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="rounded-md p-2 hover:bg-red-100 h-max cursor-pointer transition-all text-red-500 ml-auto" onClick={(e) => {e.stopPropagation(); deleteNotifMutation.mutate(notif.id); }}> 
                  <LuTrash2 />
                </div>
              </div>
          );
        }) : <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
          <NoCases textToShow="No notifications to show" Icon={Inbox}/>
        </div>}

      </div>}

    </div>
  )
}
