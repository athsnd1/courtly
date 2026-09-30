import { api } from "@/lib/api";


export async function cancelSubscription () {

    const response = await api.post("/payments/cancel");

    return response.data;
}