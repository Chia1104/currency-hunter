import { useEffect } from "react";

import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
} from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import BigNumber from "bignumber.js";
import { Controller, useForm } from "react-hook-form";

import { SupportedCurrency } from "@/enums/supported-currency.enum";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

import { expenseSchema } from "./utils";

interface Props {
  projectId: string;
  state: UseOverlayStateReturn;
  editExpenseId?: string | null;
}

export function ExpenseFormModal({ projectId, state, editExpenseId }: Props) {
  const participants = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.participants ?? {}
  );
  const editExpense = useCurrencyHunterStore((s) =>
    editExpenseId ? s.projects[projectId]?.expenses[editExpenseId] : undefined
  );
  const addExpense = useCurrencyHunterStore((s) => s.addExpense);
  const updateExpense = useCurrencyHunterStore((s) => s.updateExpense);

  const isEdit = !!editExpenseId;
  const participantList = Object.values(participants);

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      payerId: "",
      amount: 0,
      currency: SupportedCurrency.TWD,
      description: "",
    },
  });

  useEffect(() => {
    if (editExpense) {
      form.reset({
        payerId: editExpense.payerId,
        amount: new BigNumber(editExpense.amount).toNumber(),
        currency: editExpense.currency,
        description: editExpense.description ?? "",
      });
    } else {
      form.reset({
        payerId: "",
        amount: 0,
        currency: SupportedCurrency.TWD,
        description: "",
      });
    }
  }, [editExpense, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && editExpenseId) {
      updateExpense(projectId, editExpenseId, values);
    } else {
      addExpense(projectId, values);
    }
    form.reset();
    state.close();
  });

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>
                {isEdit ? "Edit expense" : "Add expense"}
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <form
                id="expense-form"
                onSubmit={onSubmit}
                className="flex flex-col gap-4 p-2">
                <Controller
                  name="payerId"
                  control={form.control}
                  render={({ field: { value, onChange }, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Select
                        variant="secondary"
                        value={value}
                        onChange={onChange}
                        isRequired
                        placeholder="Select a payer"
                        isInvalid={!!fieldState.error}
                        fullWidth>
                        <Label>Payer</Label>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {participantList.map((p) => (
                              <ListBox.Item key={p.id} id={p.id}>
                                {p.name}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    name="amount"
                    control={form.control}
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState,
                    }) => (
                      <TextField
                        variant="secondary"
                        value={BigNumber(value).toString()}
                        onChange={(value) =>
                          onChange(new BigNumber(value).toNumber())
                        }
                        onBlur={onBlur}
                        isInvalid={!!fieldState.error}
                        isRequired
                        fullWidth>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="any"
                          min="0"
                          placeholder="0"
                        />
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </TextField>
                    )}
                  />

                  <Controller
                    name="currency"
                    control={form.control}
                    render={({ field: { value, onChange }, fieldState }) => (
                      <div className="flex flex-col gap-1.5">
                        <Select
                          variant="secondary"
                          value={value}
                          onChange={onChange}
                          isRequired
                          isInvalid={!!fieldState.error}
                          fullWidth>
                          <Label>Currency</Label>
                          <Select.Trigger>
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              {Object.values(SupportedCurrency).map((c) => (
                                <ListBox.Item key={c} id={c}>
                                  {c}
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      variant="secondary"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      fullWidth>
                      <Label>Description</Label>
                      <Input placeholder="What was this expense for?" />
                    </TextField>
                  )}
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={state.close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="expense-form">
                {isEdit ? "Save" : "Add"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
