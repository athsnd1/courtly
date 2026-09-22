import prisma from "../config/prisma.config";


export async function getUser (clerkUserId: string) {

    const user = await prisma.user.findUnique({
        where: {
            clerkId: clerkUserId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}