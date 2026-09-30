import { cancelSubscription } from "@/api/cancelSubscription";
import handleSubscribe from "@/api/handleSubscribe";
import Breadcrumb from "@/components/Breadcrumb";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import PageInfo from "@/components/PageInfo";
import SubPlanCard from "@/components/SubPlanCard";
import { useSubscription } from "@/hooks/useSubscription";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuCircleX } from "react-icons/lu";


export default function SubscriptionsPage() {

  const { data: subscription } = useSubscription();

  const isPro = subscription?.orgPlan === "PRO" && subscription?.orgPlanStatus === "ACTIVE";

  const [deleteModalShowing, setDeleteModalShowing] = useState(false);

  const queryClient = useQueryClient();

  const cancelSubMutation = useMutation({
    mutationFn: cancelSubscription,
    onMutate: () => {
      const toastId = toast.loading("Cancelling subscription...");
      return { toastId };
    },

    onSuccess: (_data, _variables, context) => {
      setDeleteModalShowing(false);
      queryClient.invalidateQueries({
        queryKey: ["subscription"]
      })
      toast.success("Subscription cancelled successfully", { id: context?.toastId });
    },

    onError: (_error, _variables, context) => {
      setDeleteModalShowing(false);
      toast.error("Failed to cancel subscription", { id: context?.toastId });
    }
  })


  return (
    <div className="w-full h-full mb-50 pb-100">

      {
        deleteModalShowing &&
        <ConfirmationDialog 
        closeDialogFunc={() => {setDeleteModalShowing(false)}} 
        dialogActionFunc={() => {cancelSubMutation.mutate()}} actionText="Are you sure you want to cancel your subscription?" firstBtnText="Yes" 
        secBtnText="No"
          />
      }

      <Breadcrumb firstPage="Dashboard" secondPage="Subscriptions"/>

      <div className="flex items-center gap-2">
        <PageInfo page_name="Subscriptions" page_summary="Manage your subscriptions."/>
        {
          isPro ? <div className="bg-green-700 text-white rounded-full font-jet py-1 px-3">Pro Plan</div> : 
          <div className="text-white bg-accent-blue rounded-full font-jet py-1 px-3 shadow-md">Upgrade to Pro</div>
        }
      </div>

      <div className="mt-10 mb-8 font-sora text-xl text-sec-navy">Your available plans</div>


      <div className="flex flex-col gap-10 w-full h-full sm:flex-row">

        {
          !isPro ? 
          <SubPlanCard 
            amount={5000}
            planName="Pro Plan"
            onInitiate={handleSubscribe}
          /> : 
          <div className="p4 rounded-md border-1 border-border cursor-pointer bg-cards w-full max-w-[250px] h-full max-h-[300px] flex flex-col items-center justify-center gap-5 hover:opacity-95 hover:scale-101 hover:border-red-500 shadow-sm hover:shadow-lg hover:shadow-red-100 transition-all" onClick={() => setDeleteModalShowing(true)}> 
            <LuCircleX className="bg-red-500 text-white text-3xl rounded-full"/>
            <span className="font-sora text-2xl text-navy">Cancel Pro</span>
          </div>
        }

      </div>

    </div>
  )
}
