import handleSubscribe from "@/api/handleSubscribe";
import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";
import SubPlanCard from "@/components/SubPlanCard";


export default function SubscriptionsPage() {



  return (
    <div className="w-full h-full mb-50 pb-100">

      <Breadcrumb firstPage="Dashboard" secondPage="Subscriptions"/>
      <PageInfo page_name="Subscriptions" page_summary="Manage your subscriptions."/>

      <div className="mt-10 mb-8 font-sora text-xl text-sec-navy">Your available plans</div>


      <div className="flex flex-col gap-10 w-full h-full sm:flex-row">

        <SubPlanCard 
          amount={0}
          planName="Free Plan"
          onInitiate={() => {}}
        />

        <SubPlanCard 
          amount={5000}
          planName="Pro Plan"
          onInitiate={() => {handleSubscribe()}}
        />

      </div>

      

    </div>
  )
}
