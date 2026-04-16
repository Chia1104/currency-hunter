import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { SupportedCurrency } from "@/enums/supported-currency.enum";

import type {
  AddExpenseParams,
  Expense,
  Project,
  SettlementTransaction,
} from "./types";
import { calculateSettlement } from "./utils";

export interface CurrencyHunterStore {
  projects: Record<string, Project>;
  activeProjectId: string | null;
  isSettlementModalOpen: boolean;

  /**
   * Project creation
   */
  createProject: (
    name: string,
    settlementCurrency?: SupportedCurrency
  ) => string | undefined;
  deleteProject: (id: string) => boolean;
  switchProject: (id: string) => void;
  updateProjectCurrency: (id: string, currency: SupportedCurrency) => void;

  /**
   * Participant actions
   */

  addParticipant: (projectId: string, name: string) => string | undefined;
  removeParticipant: (projectId: string, participantId: string) => boolean;

  /**
   * Expense actions
   */

  addExpense: (
    projectId: string,
    params: AddExpenseParams
  ) => string | undefined;
  updateExpense: (
    projectId: string,
    expenseId: string,
    params: Partial<AddExpenseParams>
  ) => boolean;
  deleteExpense: (projectId: string, expenseId: string) => void;

  /**
   * Settlement actions
   */

  calculateSettlement: (
    projectId: string,
    rates: Record<string, number>
  ) => {
    total: string;
    perPersonShare: string;
    transactions: SettlementTransaction[];
  };
  toggleSettlementModal: (open?: boolean) => void;
}

export const useCurrencyHunterStore = create<CurrencyHunterStore>()(
  devtools(
    persist(
      (set, get) => ({
        projects: {},
        activeProjectId: null,
        isSettlementModalOpen: false,

        /**
         * Project actions
         */

        createProject: (name, settlementCurrency = SupportedCurrency.TWD) => {
          const trimmed = name.trim();
          if (!trimmed) return undefined;

          const id = crypto.randomUUID();
          const project: Project = {
            id,
            name: trimmed,
            settlementCurrency,
            createdAt: dayjs().toISOString(),
            participants: {},
            expenses: {},
            settlements: {
              total: "0",
              perPersonShare: "0",
              transactions: [],
            },
          };

          set((s) => ({
            projects: { ...s.projects, [id]: project },
            activeProjectId: s.activeProjectId ?? id,
          }));
          return id;
        },

        deleteProject: (id) => {
          const project = get().projects[id];
          if (!project) return false;
          if (Object.keys(project.expenses).length > 0) return false;

          set((s) => {
            const next = { ...s.projects };
            delete next[id];
            const remaining = Object.keys(next);
            return {
              projects: next,
              activeProjectId:
                s.activeProjectId === id
                  ? (remaining[0] ?? null)
                  : s.activeProjectId,
            };
          });
          return true;
        },

        switchProject: (id) => {
          set({ activeProjectId: id });
        },

        updateProjectCurrency: (id, currency) => {
          set((s) => {
            const project = s.projects[id];
            if (!project) return s;
            return {
              projects: {
                ...s.projects,
                [id]: { ...project, settlementCurrency: currency },
              },
            };
          });
        },

        /**
         * Participant actions
         */

        addParticipant: (projectId, name) => {
          const trimmed = name.trim();
          if (!trimmed) return undefined;

          const project = get().projects[projectId];
          if (!project) return undefined;

          const duplicate = Object.values(project.participants).some(
            (p) => p.name.toLowerCase() === trimmed.toLowerCase()
          );
          if (duplicate) return undefined;

          const id = crypto.randomUUID();
          set((s) => {
            const p = s.projects[projectId];
            if (!p) return s;
            return {
              projects: {
                ...s.projects,
                [projectId]: {
                  ...p,
                  participants: {
                    ...p.participants,
                    [id]: { id, name: trimmed },
                  },
                },
              },
            };
          });
          return id;
        },

        removeParticipant: (projectId, participantId) => {
          const project = get().projects[projectId];
          if (!project) return false;

          const hasExpenses = Object.values(project.expenses).some(
            (e) => e.payerId === participantId
          );
          if (hasExpenses) return false;

          set((s) => {
            const p = s.projects[projectId];
            if (!p) return s;
            const nextParticipants = { ...p.participants };
            delete nextParticipants[participantId];
            return {
              projects: {
                ...s.projects,
                [projectId]: { ...p, participants: nextParticipants },
              },
            };
          });
          return true;
        },

        /**
         * Expense actions
         */

        addExpense: (projectId, params) => {
          const amountBN = new BigNumber(params.amount);
          if (amountBN.isNaN() || amountBN.isLessThanOrEqualTo(0))
            return undefined;

          const project = get().projects[projectId];
          if (!project?.participants[params.payerId]) return undefined;

          const id = crypto.randomUUID();
          const expense: Expense = {
            id,
            payerId: params.payerId,
            amount: amountBN.toFixed(),
            currency: params.currency,
            description: params.description,
            createdAt: dayjs().toISOString(),
          };

          set((s) => {
            const p = s.projects[projectId];
            if (!p) return s;
            return {
              projects: {
                ...s.projects,
                [projectId]: {
                  ...p,
                  expenses: { ...p.expenses, [id]: expense },
                },
              },
            };
          });
          return id;
        },

        updateExpense: (projectId, expenseId, params) => {
          const project = get().projects[projectId];
          if (!project?.expenses[expenseId]) return false;

          const update: Partial<Omit<Expense, "id" | "createdAt">> = {};

          if (params.payerId !== undefined) {
            if (!project.participants[params.payerId]) return false;
            update.payerId = params.payerId;
          }

          if (params.amount !== undefined) {
            const amountBN = new BigNumber(params.amount);
            if (amountBN.isNaN() || amountBN.isLessThanOrEqualTo(0))
              return false;
            update.amount = amountBN.toFixed();
          }

          if (params.currency !== undefined) update.currency = params.currency;
          if (params.description !== undefined)
            update.description = params.description;

          set((s) => {
            const p = s.projects[projectId];
            const existing = p?.expenses[expenseId];
            if (!p || !existing) return s;
            return {
              projects: {
                ...s.projects,
                [projectId]: {
                  ...p,
                  expenses: {
                    ...p.expenses,
                    [expenseId]: { ...existing, ...update },
                  },
                },
              },
            };
          });
          return true;
        },

        deleteExpense: (projectId, expenseId) => {
          set((s) => {
            const p = s.projects[projectId];
            if (!p) return s;
            const nextExpenses = { ...p.expenses };
            delete nextExpenses[expenseId];
            return {
              projects: {
                ...s.projects,
                [projectId]: { ...p, expenses: nextExpenses },
              },
            };
          });
        },

        /**
         * Settlement actions
         */

        calculateSettlement: (projectId, rates) => {
          const project = get().projects[projectId];
          if (!project)
            return { total: "0", perPersonShare: "0", transactions: [] };

          const results = calculateSettlement(
            Object.values(project.expenses),
            Object.values(project.participants),
            rates,
            project.settlementCurrency
          );

          set((s) => {
            const p = s.projects[projectId];
            if (!p) return s;
            return {
              projects: {
                ...s.projects,
                [projectId]: { ...p, settlements: results },
              },
            };
          });

          return results;
        },

        toggleSettlementModal: (open) => {
          set((s) => ({
            isSettlementModalOpen: open ?? !s.isSettlementModalOpen,
          }));
        },
      }),
      {
        name: "currency-hunter-store",
        partialize: (state) => ({
          projects: state.projects,
          activeProjectId: state.activeProjectId,
        }),
      }
    ),
    { name: "CurrencyHunterStore" }
  )
);
