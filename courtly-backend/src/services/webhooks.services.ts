import prisma from "../config/prisma.config";


export async function createUser (data: any) {
    return await prisma.user.create({
        data: {
            clerkId: data.id,
            name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
            email: data.email_addresses[0].email_address,
        },
    });
};

export async function updateUser (data: any) {
    return await prisma.user.update({
        where: {
            clerkId: data.id
        },
        data: {
            name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || data.email_addresses[0].email_address,
            email: data.email_addresses[0].email_address,  
        }
    });
};

export async function deleteUser (data: any) {
    return await prisma.user.delete({
        where: {
            clerkId: data.id
        }
    });
};

// todo: should an event be made for when an organization is created?
export async function createOrganization (data: any) {

    return await prisma.organization.upsert({
        where: {
            clerkOrgId: data.id
        },
        create: {
            clerkOrgId: data.id,
            name: data.name
        },
        update: {
            name: data.name
        }
    });
};

export async function createOrganizationMembership (data: any) {

    const organization = await prisma.organization.upsert({
        where: {
            clerkOrgId: data.organization.id
        },
        create: {
            clerkOrgId: data.organization.id,
            name: data.organization.name
        },
        update: {}
    });

    return await prisma.user.update({
        where: {
            clerkId: data.public_user_data.user_id
        },
        data: {
            orgId: organization.id
        }
    });
};

export async function deleteOrganization (data: any) {
    return await prisma.organization.delete({
        where: {
            clerkOrgId: data.id
        }
    });
};

export async function deleteOrganizationMembership (data: any) {
    return await prisma.user.update({
        where: {
            clerkId: data.public_user_data.user_id
        },
        data: {
            orgId: null
        }
    });
};