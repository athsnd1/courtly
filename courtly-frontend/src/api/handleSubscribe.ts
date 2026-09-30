import { api } from "@/lib/api";


export default async function handleSubscribe () {

    try {
        const response = await api.post(`/payments/subscribe`);

        window.open(response.data.authorizationUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
        console.error(error);
    }
}