import type { SupportedCurrency } from "@/enums/supported-currency.enum";

export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: string;
  currency: SupportedCurrency;
  description?: string;
  createdAt: string;
}

export interface SettlementTransaction {
  from: string;
  to: string;
  amount: string;
  currency: SupportedCurrency;
}

export interface Project {
  id: string;
  name: string;
  settlementCurrency: SupportedCurrency;
  createdAt: string;
  participants: Record<string, Participant>;
  expenses: Record<string, Expense>;
  settlements: {
    total: string;
    perPersonShare: string;
    transactions: SettlementTransaction[];
  };
}

export interface AddExpenseParams {
  payerId: string;
  amount: number | string;
  currency: SupportedCurrency;
  description?: string;
}
