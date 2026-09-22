import { z } from "zod";

export const CaseSchema = z.object({
  caseNumber: z.string().min(1, "Case number is required"),

  title: z.string().min(1, "Case title is required"),

  type: z.enum([
    "CIVIL",
    "CRIMINAL",
    "CORPORATE",
    "COMMERCIAL",
    "FAMILY",
    "LABOR",
    "PROPERTY",
    "TAX",
    "OTHER"
  ]),

  description: z.string().optional(),

  lawyerIds: z.array(z.string()),

  caseParties: z.array(z.object({
    name: z.string().min(1, "Party name is required"),
    type: z.enum([
      "PLAINTIFF",
      "DEFENDANT",
      "CLAIMANT",
      "RESPONDENT",
      "APPELLANT",
      "APPELLEE",
      "PETITIONER",
      "WITNESS",
      "VICTIM",
      "ACCUSED",
      "COMPLAINANT",
      "INTERVENOR",
      "THIRD_PARTY",
      "OTHER",
    ])
  }))
});

export type CaseSchemaType = z.infer<typeof CaseSchema>;