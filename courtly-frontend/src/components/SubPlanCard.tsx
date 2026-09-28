import { TbCurrencyNaira } from "react-icons/tb"

interface SubPlanCardProps {
    amount: number;
    planName: string;
    onInitiate: () => void;
}

export default function SubPlanCard({ amount, planName, onInitiate }: SubPlanCardProps) {



  return (
    <div className={`w-full max-w-[300px] h-full max-h-[350px] p-4 rounded-4xl bg-cards border-1 ${planName === "Pro Plan" ? "border-green-700" : "border-accent-blue"} flex flex-col gap-4 items-center justify-center cursor-pointer shadow-md hover:scale-101 hover:-translate-y-1 hover:shadow-lg ${planName === "Pro Plan" ? "hover:shadow-green-700" : "hover:shadow-accent-blue"} transition-all`} onClick={onInitiate}>

      {
        planName === "Pro Plan" && 
        <p className={`${planName === "Pro Plan" ? "bg-red-700" : "text-white bg-accent-blue"} py-2 px-3 rounded-full font-jet text-white text-lg flex items-center line-through`}>₦{10000}</p>
      }

      <p className={`${planName === "Pro Plan" ? "bg-green-700" : "text-white bg-accent-blue"} py-2 px-3 rounded-full font-jet text-white text-2xl flex items-center`}><TbCurrencyNaira />{amount === 0 ? amount + ".00" : amount}</p>
    
      <h1 className={`${planName === "Pro Plan" ? "text-green-700" : "text-accent-blue"} font-sora text-2xl`}>{planName}</h1>

    </div>
  )
}
