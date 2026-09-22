
import prisma from "../config/prisma.config";
import { createCase } from "../services/cases.services";

createCase("742443bc-6dca-48c3-9352-be633f1cea59", "d2b29edd-84cd-4827-9921-49c4c9a4dd48", {
    caseNumber: "cv",
    title: "case 1",
    type: "CIVIL",
    description: "none really",
    lawyerIds: ["742443bc-6dca-48c3-9352-be633f1cea59"],
    caseParties: [
        {
            name: "Attah Sunday",
            type: "ACCUSED"
        }
    ]
}).catch((error) => console.log(error))
    .finally(() => { prisma.$disconnect()})