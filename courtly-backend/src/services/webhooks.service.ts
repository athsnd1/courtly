import logger from "../config/logger.config";
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

export async function handleSubCreate (data: any) {

    const subscription = await prisma.subscription.findFirst({
        where: {
            paystackCustomerCode: data.customer.customer_code,
        },
    });

    if (!subscription) {
        throw new Error(
            `Subscription not found for customer: ${data.customer.customer_code}`
        );
    }

    return await prisma.subscription.update({
        where: {
            id: subscription.id,
        },
        data: {
            paystackSubscriptionCode: data.subscription_code,
            paystackPlanCode: data.plan.plan_code,
            paystackEmailToken: data.email_token,
        },
    });

};

export async function handlePaymentSuccess(data: any) {

    console.log("PAYMENT SUCCESS:", {
        reference: data.reference,
        subscription_code: data.subscription_code,
        customer: data.customer,
    });

  const payment = await prisma.payment.findUnique({
    where: {
      providerRef: data.reference,
    },
  });

  if (!payment) {
    throw new Error(`Payment not found: ${data.reference}`);
  }

  if (payment.status === "SUCCESS") {
    return;
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "SUCCESS",
      },
    }),

    prisma.subscription.upsert({
      where: {
        orgId: payment.orgId,
      },
      create: {
        orgId: payment.orgId,
        plan: "PRO",
        status: "ACTIVE",
        paystackPlanCode: process.env.PAYSTACK_PRO_PLAN_CODE,
        paystackCustomerCode: data.customer?.customer_code,
        paystackSubscriptionCode: data.subscription_code,
        paystackEmailToken: data.email_token,
      },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        paystackPlanCode: process.env.PAYSTACK_PRO_PLAN_CODE,
        paystackCustomerCode: data.customer?.customer_code,
        paystackSubscriptionCode: data.subscription_code,
        paystackEmailToken: data.email_token,
      },
    }),
  ]);
};

export async function handleSubDisable (data: any) {

    return await prisma.subscription.update({
        where: {
            paystackSubscriptionCode: data.subscription_code
        },
        data: {
            status: "CANCELLED"
        }
    });
};

export async function handleSubNotRenew (data: any) {

    return await prisma.subscription.update({
        where: {
            paystackSubscriptionCode: data.subscription_code
        },
        data: {
            status: "CANCELLED"
        }
    });

}