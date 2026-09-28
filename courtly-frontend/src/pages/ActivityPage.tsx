import Breadcrumb from "@/components/Breadcrumb";
import PageInfo from "@/components/PageInfo";


export default function ActivityPage() {



  return (
    <div className="w-full h-full mb-50 pb-100">

      <Breadcrumb firstPage="Dashboard" secondPage="Subscription"/>

      <PageInfo page_name="Subscription" page_summary="Manage your subscription."/>

      <div className="w-full h-full">

        <p>You're currently on the free plan—Explore other options below</p>

        

      </div>

    </div>
  )
}
