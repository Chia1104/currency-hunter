import BigNumber from "bignumber.js";

import type { SupportedCurrency } from "@/enums/supported-currency.enum";

import type { Expense, Participant, SettlementTransaction } from "./types";

export const convertToTarget = (
  amount: string,
  fromRate: number,
  toRate: number
): BigNumber => {
  return new BigNumber(amount).dividedBy(fromRate).multipliedBy(toRate);
};

export const calculateSettlement = (
  expenses: Expense[],
  participants: Participant[],
  rates: Record<string, number>,
  targetCurrency: SupportedCurrency
): {
  total: string;
  perPersonShare: string;
  transactions: SettlementTransaction[];
} => {
  if (participants.length === 0 || expenses.length === 0)
    return {
      total: "0",
      perPersonShare: "0",
      transactions: [],
    };

  const totalExpenseInTarget = expenses.reduce(
    (prev, current) =>
      prev.plus(
        convertToTarget(
          current.amount,
          rates[current.currency],
          rates[targetCurrency]
        )
      ),
    new BigNumber(0)
  );

  const perPersonShare = totalExpenseInTarget.dividedBy(participants.length);

  const paid: Record<string, BigNumber> = {};
  for (const participant of participants) {
    paid[participant.id] = new BigNumber(0);
  }
  for (const expense of expenses) {
    paid[expense.payerId] = (paid[expense.payerId] ?? new BigNumber(0)).plus(
      convertToTarget(
        expense.amount,
        rates[expense.currency],
        rates[targetCurrency]
      )
    );
  }

  const balances: Record<string, BigNumber> = {};
  for (const p of participants) {
    balances[p.id] = (paid[p.id] ?? new BigNumber(0)).minus(perPersonShare);
  }

  const creditors: { id: string; amount: BigNumber }[] = [];
  const debtors: { id: string; amount: BigNumber }[] = [];

  for (const participant of participants) {
    const balance = balances[participant.id];
    if (!balance) continue;
    if (balance.isGreaterThan(0))
      creditors.push({ id: participant.id, amount: balance });
    else if (balance.isLessThan(0))
      debtors.push({ id: participant.id, amount: balance.abs() });
  }

  creditors.sort((a, b) => b.amount.comparedTo(a.amount) ?? 0);
  debtors.sort((a, b) => b.amount.comparedTo(a.amount) ?? 0);

  const transactions: SettlementTransaction[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    if (!creditor || !debtor) break;

    const transferAmount = BigNumber.min(creditor.amount, debtor.amount);

    transactions.push({
      from: debtor.id,
      to: creditor.id,
      amount: transferAmount.toFixed(2),
      currency: targetCurrency,
    });

    creditor.amount = creditor.amount.minus(transferAmount);
    debtor.amount = debtor.amount.minus(transferAmount);

    if (creditor.amount.isZero()) creditorIndex++;
    if (debtor.amount.isZero()) debtorIndex++;
  }

  return {
    total: totalExpenseInTarget.toFixed(2),
    perPersonShare: perPersonShare.toFixed(2),
    transactions,
  };
};
