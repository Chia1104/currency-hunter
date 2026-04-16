import { useId, useState } from "react";

import {
  Button,
  FieldError,
  Input,
  Label,
  Surface,
  Tag,
  TagGroup,
  TextField,
  Alert,
  EmptyState,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { useCurrencyHunterStore } from "@/stores/currency-hunter";

import { addParticipantSchema } from "./utils";

interface Props {
  projectId: string;
}

export function ParticipantsSection({ projectId }: Props) {
  const formId = useId();
  const [removeError, setRemoveError] = useState<string | null>(null);

  const participants = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.participants ?? {}
  );
  const addParticipant = useCurrencyHunterStore((s) => s.addParticipant);
  const removeParticipant = useCurrencyHunterStore((s) => s.removeParticipant);

  const participantList = Object.values(participants).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const form = useForm({
    resolver: zodResolver(addParticipantSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit((values) => {
    setRemoveError(null);
    const id = addParticipant(projectId, values.name);
    if (!id) {
      form.setError("name", {
        message: "This name is already in the project.",
      });
      return;
    }
    form.reset();
  });

  return (
    <Surface className="flex flex-col gap-4 rounded-2xl p-5" variant="default">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Participants</h2>
      </div>

      <form
        id={formId}
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Controller
          name="name"
          control={form.control}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <TextField
              className="flex-1"
              variant="secondary"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={!!fieldState.error}
              isRequired
              fullWidth>
              <Label>Name</Label>
              <Input placeholder="e.g. Alice" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Button type="submit" form={formId}>
          Add
        </Button>
      </form>

      {removeError && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{removeError}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <TagGroup
        aria-label="People in this project"
        selectionMode="none"
        size="md"
        className="flex flex-col gap-2"
        onRemove={(keys) => {
          setRemoveError(null);
          for (const key of keys) {
            const ok = removeParticipant(projectId, String(key));
            if (!ok) {
              setRemoveError(
                `Cannot remove ${participantList.find((p) => p.id === key)?.name} because they are recorded as a payer on an expense.`
              );
            }
          }
        }}>
        <TagGroup.List
          items={participantList}
          renderEmptyState={() => (
            <EmptyState className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-4 text-center">
              <UserIcon className="text-muted-foreground size-6" />
              <p className="text-muted-foreground text-sm">
                No participants yet. Add at least one person before logging
                expenses.
              </p>
            </EmptyState>
          )}>
          {(item) => (
            <Tag id={item.id} textValue={item.name}>
              {item.name}
            </Tag>
          )}
        </TagGroup.List>
      </TagGroup>
    </Surface>
  );
}
