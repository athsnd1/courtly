import type { Case } from "@/types/case.type";
import { LuX } from "react-icons/lu";
import NoCases from "./NoCases";
import { useNavigate } from "react-router-dom";

interface ResultsModalProps {
    results: Case[];
    closeModalFunc: () => void;
}

export default function ResultsModal({ results, closeModalFunc }: ResultsModalProps) {

    const navigate = useNavigate();

  return (
    <div className="fixed top-[61px] left-0 sm:left-[180px] right-0 bottom-0 bg-black/5 backdrop-blur-sm inset-0 z-[9999]">

        <div className="bg-cards rounded-md border-1 border-border fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-[400px] h-max max-h-[500px] inset-0 z-[999999999]">

            <div className="flex items-center justify-between w-full p-2 border-b-1 border-border">
                <span className="font-sora text-navy">Search Results</span>
                <div className="cursor-pointer hover:bg-bgcol p-2 rounded-md" onClick={closeModalFunc}>
                    <LuX />
                </div>
            </div>

            <div className="w-full h-full overflow-y-auto flex flex-col gap-2 p-2">
                { results.length > 0 ? results.map((item) => (

                <div key={item.id} onMouseDown={() => { navigate(`/dashboard/cases/${item.id}`); closeModalFunc();}} className="p-2 border-1 border-border rounded-md cursor-pointer hover:bg-bgcol">
                    
                    <span className="font-sora text-navy">{item.title} — {item.caseNumber}</span>

                </div>

            )) : <div className="w-full h-max p-4 bg-cards border-1 border-border rounded-md mt-4"> 
                    <NoCases textToShow="No results for this search"/>
                </div> }
            </div>


        </div>

    </div>
  )
}
