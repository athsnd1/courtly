import getNotifs from "@/api/getNotifs";
import { useQuery } from "@tanstack/react-query";


export function useNotifications () {

    return useQuery({
        queryKey: ["notifs"],
        queryFn: getNotifs
    })
}