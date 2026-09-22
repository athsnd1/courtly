import logger from "../config/logger.config";
import prisma from "../config/prisma.config";


export async function getLawyers (userId: string, orgId: string, search?: string) {
    const organization = await prisma.organization.findUnique({
        where: {
            clerkOrgId: orgId
        }
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            clerkId: userId
        },
        select: {
            id: true,
            name:true
        }
    });

    const others = await prisma.user.findMany({
        where: {
            orgId: organization.id,
            ...(search && {
            name: {
                contains: search,
                mode: "insensitive"
            }
        })},
        
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    return { currentUser, others };
        
}