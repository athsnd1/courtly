import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


export function useNotificationStream () {

    const queryClient = useQueryClient();
   
    useEffect(() => {

        const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/notifications/stream`, { withCredentials: true });

        eventSource.onopen = () => {
            console.log("SSE Connected");
        }

        eventSource.addEventListener("notification", () => {
            queryClient.invalidateQueries({
                queryKey: ["notifs"]
            });
        });

        eventSource.onerror = (error) => {
            console.error("SSE Error: ", error);
        }

        return () => {
            eventSource.close();
        }

    }, [queryClient]);

}