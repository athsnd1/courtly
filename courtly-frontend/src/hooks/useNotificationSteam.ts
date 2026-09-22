import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";


export function useNotificationStream () {

    const queryClient = useQueryClient();

    const [showDot, setShowDot] = useState(false);
   
    useEffect(() => {

        const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/notifications/stream`, { withCredentials: true });

        eventSource.onopen = () => {
            console.log("SSE Connected");
        }

        eventSource.addEventListener("notification", () => {
            queryClient.invalidateQueries({
                queryKey: ["notifs"]
            });
            setShowDot(true);
        });

        eventSource.onerror = (error) => {
            console.error("SSE Error: ", error);
        }

        return () => {
            eventSource.close();
        }

    }, [queryClient]);

    return { showDot, clearDot: () => { setShowDot(false) }};
}