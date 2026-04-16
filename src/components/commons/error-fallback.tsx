"use client";

import { Button } from "@heroui/react";

interface Props<TError extends Error> {
  error?: TError | null;
  fallback?: React.ReactNode;
  onRetry?: () => void;
  enabledSentry?: boolean;
}

export const ErrorFallback = <TError extends Error>({
  error,
  fallback,
  onRetry,
}: Props<TError>) => {
  return (
    fallback ?? (
      <div className="rounded-medium bg-danger-100/50 border-danger-100 text-foreground flex w-full flex-col gap-4 border p-5">
        <h2 className="text-lg font-medium">Error</h2>
        <p className="text-default-500 text-sm">Something went wrong</p>
        <code>{error?.message}</code>
        {onRetry && (
          <Button variant="danger-soft" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    )
  );
};
