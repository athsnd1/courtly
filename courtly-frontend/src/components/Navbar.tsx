import { FiBell, FiSearch } from "react-icons/fi";
import { GiScales } from "react-icons/gi";
import { UserButton } from "@clerk/react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import findCases from "@/api/findCases";
import ResultsModal from "./ResultsModal";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useNotificationStream } from "@/hooks/useNotificationSteam";

export default function Navbar() {

    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    const searchRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const { showDot, clearDot } = useNotificationStream();

    useEffect(() => {
        
        const handleClickOutside = (e: MouseEvent) => {

            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearch("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])

    const { data: searchResults = [] } = useQuery({
        queryKey: ["case-search", debouncedSearch],
        queryFn: () => findCases(debouncedSearch),
        enabled: debouncedSearch.trim().length >= 2
    });

  return (
    <div className="h-[60px] bg-cards border-b-1 border-border fixed top-0 left-0 sm:left-[180px] right-0 flex items-center justify-start p-3 z-[9999]">

        <div className="flex items-center gap-1 sm:hidden">
            <GiScales className="text-xl text-sec-navy"/>
            <span className="text-lg font-sora text-sec-navy pt-1">Courtly</span>
        </div>

        <div className="w-full max-w-[400px] h-full hidden xs:flex items-center gap-2 border-1 border-border rounded-sm p-2 focus-within:border-logo transition-all ml-4" ref={searchRef}>

            <FiSearch className="text-sec-text shrink-0"/>

            <span className="text-sec-text font-sora text-sm shrink-0">Cases  /</span>

            <input type="text" className="w-full h-full outline-none text-navy font-sora text-sm" placeholder="CV-2026-0142 — Smith v. Johnson" value={search} onChange={(e) => setSearch(e.target.value)} onBlur={() => { setSearch("") }}/>

            {
                search && <ResultsModal results={searchResults} closeModalFunc={() => { setSearch("") }}/>
            }

        </div>

        <div className="ml-auto flex items-center gap-0.5">

            <div 
                className={`hover:bg-bgcol p-1 rounded-md ml-4 transition-all relative h-max w-max ${showDot ? " after:absolute after:w-[8px] after:h-[8px] after:rounded-full after:bg-red-500 after:top-0.5 after:right-1" : ""}`} 
                onClick={() => {
                    clearDot();
                    navigate("/dashboard/notifications");
                }}>
                <FiBell className={`text-xl text-sec-text cursor-pointer`}/>
            </div>

            <div className="flex items-center gap-1 cursor-pointer  hover:bg-bgcol p-2 rounded-md transition-all">
                <div className="size-8 border-1 border-sec-navy rounded-full shrink-0 flex items-center justify-center">
                    <UserButton 
                        appearance={{
                            options: {
                            elevation: "flush",
                            unsafe_disableDevelopmentModeWarnings: true,
                            }
                        }}
                    /></div>
            </div>
        </div>

    </div>
  )
}
