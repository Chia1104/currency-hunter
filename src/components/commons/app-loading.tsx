import { ViewTransition } from "react";

import { Spinner } from "@heroui/react";

import { cn } from "@/lib/utils/cn";

interface Props {
  className?: string;
}

export const AppLoading = (props: Props) => {
  return (
    <ViewTransition>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3",
          props.className
        )}>
        <Spinner aria-label="Loading..." />
      </div>
    </ViewTransition>
  );
};
