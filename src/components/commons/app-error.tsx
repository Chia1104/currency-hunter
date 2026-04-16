"use client";

import { ViewTransition } from "react";

import { Button, Avatar } from "@heroui/react";

import { withError } from "@/hocs/with-error";

export const AppError = withError(
  ({ reset }) => {
    return (
      <ViewTransition>
        <div className="flex w-full flex-col items-center justify-center p-4 text-center">
          <Avatar className="mb-4 size-16">
            <Avatar.Image src="/assets/bot.png" />
            <Avatar.Fallback>Bot</Avatar.Fallback>
          </Avatar>
          <h1 className="mb-4 text-3xl font-bold">Error</h1>
          <p className="mb-8 max-w-md text-gray-500">Something went wrong</p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={reset}
              aria-label="Back to previous">
              Retry
            </Button>
          </div>
        </div>
      </ViewTransition>
    );
  },
  {
    onError(error) {
      console.error(error);
    },
  }
);
