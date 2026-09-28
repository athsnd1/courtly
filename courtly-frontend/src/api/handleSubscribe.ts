import { api } from "@/lib/api";


export default async function handleSubscribe () {

    const response = await api.post(`/payments/subscribe`);

    console.log(response.data);

    // return response.data;
}