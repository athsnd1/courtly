import { LuX } from "react-icons/lu";


interface DialogProps {
    closeDialogFunc: () => void;
    dialogActionFunc: () => void;
    actionText: string;
    firstBtnText: string;
    secBtnText: string;
}

export default function ConfirmationDialog({ closeDialogFunc, dialogActionFunc, actionText, firstBtnText, secBtnText }: DialogProps) {

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/5 backdrop-blur-sm z-9999">

        <div className="w-full max-w-[300px] sm:max-w-[400px] bg-cards border-1 border-border flex flex-col items-center justify-center gap-2 rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

            <div className="flex items-center justify-between w-full p-3 border-b-1 border-border">
                <span className="font-sora text-navy">Confirm Action</span>
                <div className="cursor-pointer hover:bg-bgcol p-2 rounded-md" onClick={closeDialogFunc}>
                    <LuX />
                </div>
            </div>

            <div className="text-center font-sora w-full p-3">
                {actionText}
            </div>

            <div className="flex items-center justify-center gap-2 w-full p-3">
                <button className="py-1 px-2 bg-red-500 text-white font-sora rounded-md cursor-pointer hover:opacity-95" onClick={dialogActionFunc}>{firstBtnText}</button>
                <button className="py-1 px-2 bg-border text-black font-sora rounded-md cursor-pointer hover:opacity-95" onClick={closeDialogFunc}>{secBtnText}</button>
            </div>

        </div>

    </div>
  )
}
