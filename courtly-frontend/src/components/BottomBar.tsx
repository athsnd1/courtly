import { NavLink } from "react-router-dom";
import { LuBriefcaseBusiness, LuFileText, LuLayoutDashboard, LuSquareCheckBig} from "react-icons/lu";
import { GiGreekTemple } from "react-icons/gi";

export default function BottomBar() {

  return (
    <div className="h-[60px] bg-cards border-t-1 border-border fixed left-0 bottom-0 right-0 flex items-center justify-center gap-1 xs:gap-4 p-3 sm:hidden z-9999">

        <NavLink className={({ isActive }) => `w-max p-2 rounded-md flex flex-col items-center gap-0.5 relative hover:text-navy  ${isActive ? "text-navy before:inline-block before:absolute before:-top-0.75 before:w-full before:h-1 before:bg-navy before:rounded-b-md" : "text-sec-text"} transition-all`} end={true} to="">
            <LuLayoutDashboard className="text-lg"/>
            <span className="text-sm">Home</span>
        </NavLink>

        <NavLink className={({ isActive }) => `w-max p-2 rounded-md flex flex-col items-center gap-0.5 relative hover:text-navy  ${isActive ? "text-navy before:inline-block before:absolute before:-top-0.75 before:w-full before:h-1 before:bg-navy before:rounded-b-md" : "text-sec-text"} transition-all`} to="cases" title="Cases">
            <LuBriefcaseBusiness className="text-lg"/>
            <span className="text-sm">Cases</span>
        </NavLink>

        <NavLink className={({ isActive }) => `w-max p-2 rounded-md flex flex-col items-center gap-0.5 relative hover:text-navy  ${isActive ? "text-navy before:inline-block before:absolute before:-top-0.75 before:w-full before:h-1 before:bg-navy before:rounded-b-md" : "text-sec-text"} transition-all`} to="tasks" title="Tasks">
            <LuSquareCheckBig className="text-lg"/>
            <span className="text-sm">Tasks</span>
        </NavLink>

        <NavLink className={({ isActive }) => `w-max p-2 rounded-md flex flex-col items-center gap-0.5 relative hover:text-navy  ${isActive ? "text-navy before:inline-block before:absolute before:-top-0.75 before:w-full before:h-1 before:bg-navy before:rounded-b-md" : "text-sec-text"} transition-all`} to="documents" title="Documents">
            <LuFileText className="text-lg"/>
            <span className="text-sm">Docs</span>
        </NavLink>

        <NavLink className={({ isActive }) => `w-max p-2 rounded-md flex flex-col items-center gap-0.5 relative hover:text-navy  ${isActive ? "text-navy before:inline-block before:absolute before:-top-0.75 before:w-full before:h-1 before:bg-navy before:rounded-b-md" : "text-sec-text"} transition-all`} to="organization" title="Organization">
            <GiGreekTemple className="text-lg"/>
            <span className="text-sm">Org</span>
        </NavLink>

    </div>
  )
}
