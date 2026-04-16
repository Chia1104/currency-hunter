import * as z from "zod";

import { SupportedCurrency } from "@/enums/supported-currency.enum";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  settlementCurrency: z.enum(SupportedCurrency),
});

export const addParticipantSchema = z.object({
  name: z.string().min(1),
});

export const expenseSchema = z.object({
  payerId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(SupportedCurrency),
  description: z.string().optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
export type AddParticipantFormValues = z.infer<typeof addParticipantSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
