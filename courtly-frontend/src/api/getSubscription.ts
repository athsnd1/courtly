import { api } from "@/lib/api";


export async function getSubscription () {

    const response = await api.get("/payments/subscription");

    return response.data;

}