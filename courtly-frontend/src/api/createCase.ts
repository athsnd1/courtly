import { api } from "@/lib/api";
import type { CaseSchemaType } from "@/validators/case.schema";


export async function createCase (data: CaseSchemaType) {
    const response = await api.post("/cases", data);
    console.log(response.data);
    return response.data;
}