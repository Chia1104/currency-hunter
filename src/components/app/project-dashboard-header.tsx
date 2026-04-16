import { Label, ListBox, Select, Surface } from "@heroui/react";

import { SupportedCurrency } from "@/enums/supported-currency.enum";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

interface Props {
  projectId: string;
}

export function ProjectDashboardHeader({ projectId }: Props) {
  const name = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.name ?? "Project"
  );
  const settlementCurrency = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.settlementCurrency ?? SupportedCurrency.TWD
  );
  const updateProjectCurrency = useCurrencyHunterStore(
    (s) => s.updateProjectCurrency
  );

  return (
    <Surface
      className="flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-end sm:justify-between"
      variant="default">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Current project
        </p>
        <h1 className="truncate text-2xl font-semibold">{name}</h1>
      </div>
      <div className="w-full sm:w-56">
        <Select
          variant="secondary"
          value={settlementCurrency}
          onChange={(value) => {
            if (!value) return;
            updateProjectCurrency(projectId, value as SupportedCurrency);
          }}
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
      </div>
    </Surface>
  );
}
