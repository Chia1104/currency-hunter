import { useMemo } from "react";

import {
  Alert,
  Button,
  Card,
  Modal,
  Text,
  useOverlayState,
} from "@heroui/react";
import { ArrowRightIcon } from "lucide-react";

import { useCurrencyHunterStore } from "@/stores/currency-hunter";

interface Props {
  projectId: string;
  rate: Record<string, number>;
}

export function SettlementModal({ projectId, rate }: Props) {
  const state = useOverlayState();
  const calculateSettlement = useCurrencyHunterStore(
    (s) => s.calculateSettlement
  );
  const transactions = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.settlements.transactions ?? []
  );
  const participants = useCurrencyHunterStore(
    (s) => s.projects[projectId]?.participants ?? {}
  );

  const participant = useMemo(() => {
    return new Map(Object.values(participants).map((p) => [p.id, p.name]));
  }, [participants]);

  const handleCalculate = () => {
    calculateSettlement(projectId, rate);
    state.open();
  };

  return (
    <Modal state={state}>
      <Modal.Trigger>
        <Button variant="primary" onPress={handleCalculate}>
          Calculate settlement
        </Button>
      </Modal.Trigger>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Calculate settlement</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-2">
              {transactions.length === 0 ? (
                <Alert status="success">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>No transfers needed</Alert.Title>
                    <Alert.Description>
                      All expenses have been settled, no need to transfer!
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              ) : (
                <div className="flex flex-col gap-3">
                  <Text className="text-muted-foreground" size="sm">
                    {transactions.length} transactions needed:
                  </Text>
                  <div className="flex flex-col gap-2">
                    {transactions.map((tx, i) => (
                      <Card key={`${tx.from}-${tx.to}-${tx.amount}-${i}`}>
                        <Card.Content className="flex flex-row items-center justify-between gap-3 px-4 py-3">
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <Text className="truncate font-medium">
                              {participant.get(tx.from) ?? tx.from}
                            </Text>
                            <ArrowRightIcon className="text-muted-foreground size-4 shrink-0" />
                            <Text className="truncate font-medium">
                              {participant.get(tx.to) ?? tx.to}
                            </Text>
                          </div>
                          <Text className="shrink-0 font-semibold tabular-nums">
                            {Number(tx.amount).toLocaleString("zh-TW", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {tx.currency}
                          </Text>
                        </Card.Content>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" slot="close">
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
