import { NavLink } from "react-router-dom";
import { LuActivity, LuBriefcaseBusiness, LuCalendarDays, LuFileText, LuLayoutDashboard, LuSquareCheckBig } from "react-icons/lu";
import { GiScales, GiGreekTemple } from "react-icons/gi";

export default function Sidebar() {


  return (
    <div className="h-full w-full max-w-[180px] bg-navy fixed top-0 left-0 p-3 pb-12 hidden sm:block">

        <div className="w-full flex items-center gap-1 border-b-1 border-sec-text pb-3.5">
            <GiScales className="text-xl text-logo-faint"/>
            <span className="text-lg font-sora text-cards pt-1">Courtly</span>
        </div>


        <div className="h-full w-full flex flex-col items-center justify-between">
            <div className="w-full flex flex-col gap-2 mt-4 font-sora items-center">

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} end={true} to="" title="Dashboard">
                    <LuLayoutDashboard className="text-lg"/>
                    <span className="text-md">Dashboard</span>
                </NavLink>

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} to="cases" title="Cases">
                    <LuBriefcaseBusiness className="text-lg"/>
                    <span className="text-md">Cases</span>
                </NavLink>

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} to="calendar" title="Calendar">
                    <LuCalendarDays className="text-lg"/>
                    <span className="text-md">Calendar</span>
                </NavLink>

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} to="tasks" title="Tasks">
                    <LuSquareCheckBig className="text-lg"/>
                    <span className="text-md">Tasks</span>
                </NavLink>

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} to="documents" title="Documents">
                    <LuFileText className="text-lg"/>
                    <span className="text-md">Documents</span>
                </NavLink>

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} to="activity" title="Activity">
                    <LuActivity className="text-lg"/>
                    <span className="text-md">Activity</span>
                </NavLink>

                <NavLink className={({ isActive }) => `text-cards w-full p-2 rounded-md flex items-center gap-1.5 hover:bg-logo-faint ${isActive ? "bg-logo" : ""} transition-all`} to="organization" title="Organization">
                    <GiGreekTemple className="text-lg"/>
                    <span className="text-md">Organization</span>
                </NavLink>

            </div>

            
        </div>

    </div>
  )
}
