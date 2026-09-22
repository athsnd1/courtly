import prisma from "../config/prisma.config";


export async function getCaseFromId (caseId: string) {

    const caseGotten = await prisma.case.findUnique({
        where: {
            id: caseId
        },
        include: {
            lawyers: {
                include: {
                    lawyer: true
                }
            }
        }
    });

    if (!caseGotten) {
        throw new Error("Case not found");
    }

    return caseGotten;
}