import { useState } from "react";

import {
  Button,
  Surface,
  Table,
  useOverlayState,
  EmptyState,
} from "@heroui/react";
import BigNumber from "bignumber.js";
import {
  PencilIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "lucide-react";

import dayjs from "@/lib/utils/dayjs";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

import { ExpenseFormModal } from "./expense-form-modal";

interface Props {
  projectId: string;
}

export function ExpensesSection({ projectId }: Props) {
  const expenseModal = useOverlayState();
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const participants = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.participants ?? {}
  );
  const expenses = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.expenses ?? {}
  );
  const deleteExpense = useCurrencyHunterStore((s) => s.deleteExpense);

  const participantNameById = new Map(
    Object.values(participants).map((p) => [p.id, p.name])
  );

  const expenseList = Object.values(expenses).sort((a, b) =>
    dayjs(b.createdAt).diff(dayjs(a.createdAt))
  );

  const openCreate = () => {
    setEditingExpenseId(null);
    expenseModal.open();
  };

  const openEdit = (expenseId: string) => {
    setEditingExpenseId(expenseId);
    expenseModal.open();
  };

  const hasParticipants = Object.keys(participants).length > 0;

  return (
    <Surface className="flex flex-col gap-4 rounded-2xl p-5" variant="default">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Expenses</h2>
        </div>
        <Button
          variant="primary"
          className="shrink-0 gap-1.5"
          onPress={openCreate}
          isDisabled={!hasParticipants}>
          <PlusIcon className="size-4" />
          Add expense
        </Button>
      </div>

      <Table className="w-full text-sm">
        <Table.ScrollContainer className="max-w-full overflow-x-auto">
          <Table.Content aria-label="Expenses in this project">
            <Table.Header>
              <Table.Column isRowHeader>When</Table.Column>
              <Table.Column>Payer</Table.Column>
              <Table.Column>Amount</Table.Column>
              <Table.Column>Note</Table.Column>
              <Table.Column className="w-28 text-end">Actions</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <EmptyState className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingCartIcon className="text-muted-foreground size-6" />
                  <span className="text-muted-foreground text-sm">
                    No expenses yet. Use &quot;Add expense&quot; to create your
                    first record.
                  </span>
                </EmptyState>
              )}>
              {expenseList.map((e) => {
                const payer =
                  participantNameById.get(e.payerId) ?? "Unknown payer";
                const amount = new BigNumber(e.amount);
                const formatted = amount.toNumber().toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                });
                return (
                  <Table.Row key={e.id} id={e.id}>
                    <Table.Cell className="tabular-nums">
                      {dayjs(e.createdAt).format("MMM D, YYYY HH:mm")}
                    </Table.Cell>
                    <Table.Cell>{payer}</Table.Cell>
                    <Table.Cell className="font-medium tabular-nums">
                      {formatted} {e.currency}
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground max-w-[240px]">
                      <span className="line-clamp-2">
                        {e.description?.trim() ? e.description : "—"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          isIconOnly
                          aria-label="Edit expense"
                          onPress={() => openEdit(e.id)}>
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger-soft"
                          isIconOnly
                          aria-label="Delete expense"
                          onPress={() => deleteExpense(projectId, e.id)}>
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <ExpenseFormModal
        projectId={projectId}
        state={expenseModal}
        editExpenseId={editingExpenseId}
      />
    </Surface>
  );
}
