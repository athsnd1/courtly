import { getSubscription } from "@/api/getSubscription";
import { useQuery } from "@tanstack/react-query";


export function useSubscription () {

    return useQuery({
        queryFn: getSubscription,
        queryKey: ["subscription"],
    });

}