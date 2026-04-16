import { SupportedCurrency } from "@/enums/supported-currency.enum";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

import { ExpensesSection } from "./expenses-section";
import { ParticipantsSection } from "./participants-section";
import { ProjectDashboardHeader } from "./project-dashboard-header";
import { SettlementSection } from "./settlement-section";

interface Props {
  projectId: string;
}

export function ProjectMainWorkspace({ projectId }: Props) {
  const supportedCurrency = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.settlementCurrency ?? SupportedCurrency.TWD
  );
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <ProjectDashboardHeader projectId={projectId} />
        <ParticipantsSection projectId={projectId} />
        <ExpensesSection projectId={projectId} />
        <SettlementSection
          projectId={projectId}
          supportedCurrency={supportedCurrency}
        />
      </div>
    </div>
  );
}
