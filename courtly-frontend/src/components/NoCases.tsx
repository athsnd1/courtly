import { FiInbox } from "react-icons/fi";
import type { IconType } from "react-icons/lib";

export default function NoCases({ textToShow, Icon }: { textToShow?: string, Icon?: IconType }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">

        {Icon ? <Icon className="text-sec-text text-4xl"/> : <FiInbox className="text-sec-text text-4xl"/>}

        <p className="text-sec-text text-lg font-sora text-center"> {textToShow || "Nothing to see here."} </p>

    </div>
  )
}
