"use client";

import { useEffect } from "react";
import type { FC } from "react";

export const withError = <TError extends Error>(
  Component: FC<{ error: TError; reset: () => void }>,
  options?: { onError?: (error: TError) => void }
) => {
  return function ErrorWrapper(props: { error: TError; reset: () => void }) {
    useEffect(() => {
      if (props.error && options?.onError) {
        options.onError(props.error);
      }
    }, [props.error]);
    return <Component {...props} />;
  };
};
