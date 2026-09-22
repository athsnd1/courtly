import type { IconType } from "react-icons/lib";
import "@/styles/global.css";

interface Props {
    title: string;
    value: number;
    Icon: IconType;
    firstTwo: boolean;
}


export default function StatsCard({title = "Stat", value = 0, Icon, firstTwo = false}: Props) {
  return (
    <div className="w-full flex items-stretch justify-between p-3 bg-cards border-1 border-border rounded-md">

        <div className="flex flex-col gap-1 justify-between">

            <div className="font-sora text-prim-text text-sm">{title}</div>
            <div className="text-xl font-sora font-semibold text-prim-text">{value}</div>

        </div>

        <div className={`w-max h-max p-1.5 rounded-lg ${firstTwo ? "bg-icon-green-bg text-icon-green" : "bg-icon-red-bg text-icon-red"} ml-2`}>

            <Icon className="text-lg"/>

        </div>

    </div>
  )
}
