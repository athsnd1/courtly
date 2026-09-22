import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useQuery } from "@tanstack/react-query";
import getHearings from "@/api/getHearings";
import type { Hearing } from "@/types/case.type";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

export default function CalendarPage() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");

  const { data: hearings, isPending, isError, error } = useQuery({
    queryKey: ["hearings"],
    queryFn: getHearings
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Something went wrong!');
    }

  }, [isError, error]);

  const events = hearings?.map((hearing: Hearing) => {
    const date = new Date(hearing.date);

    return {
      title: hearing.case.title,
      start: date,
      end: date,
      caseId: hearing.caseId,
    };
  });

  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage errorText={error.message}/>;
  }

  return (
    <div className="w-full h-full mb-50 pb-100">

      <Breadcrumb firstPage="Dashboard" secondPage="Calendar"/>
      <PageInfo page_name="Calendar" page_summary="View upcoming case hearings."/>

      <div className="mt-6 bg-cards w-full h-[700px] border-1 border-border rounded-md p-4 font-sora">

        <Calendar 
        localizer={localizer}
        events={events}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        view={currentView}
        onView={(newView) => setCurrentView(newView)}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => {navigate(`/dashboard/cases/${event.caseId}`)}}
        />

      </div>
    </div>
  )
}
