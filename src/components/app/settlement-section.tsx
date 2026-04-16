import { Button, Spinner, Surface, Alert } from "@heroui/react";

import { AsyncQuery } from "@/components/commons/async-query";
import type { SupportedCurrency } from "@/enums/supported-currency.enum";
import { useGetRate } from "@/modules/exchange/hooks/use-get-rate";

import { SettlementModal } from "./settlement-modal";

interface Props {
  projectId: string;
  supportedCurrency: SupportedCurrency;
}

export function SettlementSection({ projectId, supportedCurrency }: Props) {
  const rateQuery = useGetRate(supportedCurrency);

  return (
    <Surface className="flex flex-col gap-4 rounded-2xl p-5" variant="default">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Settlement</h2>
      </div>

      <AsyncQuery
        queryResult={rateQuery}
        loadingFallback={<Spinner />}
        errorFallback={
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content className="gap-2">
              <Alert.Description>
                Could not load exchange rates. Please check your network and try
                again.
              </Alert.Description>
              <Button variant="secondary" onPress={() => rateQuery.refetch()}>
                Retry
              </Button>
            </Alert.Content>
          </Alert>
        }>
        {(query) => {
          if (query.data?.result !== "success")
            return (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content className="gap-2">
                  <Alert.Description>
                    Could not load exchange rates. Please check your network and
                    try again.
                  </Alert.Description>
                  <Button variant="secondary" onPress={() => query.refetch()}>
                    Retry
                  </Button>
                </Alert.Content>
              </Alert>
            );
          return (
            <div>
              <SettlementModal projectId={projectId} rate={query.data.rates} />
            </div>
          );
        }}
      </AsyncQuery>
    </Surface>
  );
}
