import prisma from "../config/prisma.config";


export async function getOrg (clerkOrgId: string) {

    const org = await prisma.organization.findUnique({
        where: {
            clerkOrgId
        }
    });

    if (!org) {
        throw new Error("Organization not found");
    }

    return org;

}