import { useId } from "react";

import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { SupportedCurrency } from "@/enums/supported-currency.enum";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

import { createProjectSchema } from "./utils";

export function CreateProjectModal() {
  const state = useOverlayState();
  const id = useId();
  const createProject = useCurrencyHunterStore((s) => s.createProject);

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      settlementCurrency: SupportedCurrency.TWD,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createProject(values.name, values.settlementCurrency);
    form.reset();
    state.close();
  });

  return (
    <Modal state={state}>
      <Modal.Trigger>
        <Button
          onPress={state.open}
          variant="primary"
          size="sm"
          className="w-full gap-1.5">
          <PlusIcon className="size-4" />
          Create a new project
        </Button>
      </Modal.Trigger>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Create a new project</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-4 p-2"
                id={id}>
                <Controller
                  name="name"
                  control={form.control}
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState,
                  }) => (
                    <TextField
                      variant="secondary"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      isInvalid={!!fieldState.error}
                      isRequired
                      fullWidth>
                      <Label>Project name</Label>
                      <Input placeholder="e.g. Japan trip, Friday dinner" />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  name="settlementCurrency"
                  control={form.control}
                  render={({ field: { value, onChange }, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Select
                        variant="secondary"
                        value={value}
                        onChange={onChange}
                        isInvalid={!!fieldState.error}
                        fullWidth>
                        <Label>Settlement currency</Label>
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
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={state.close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form={id}>
                Create
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
