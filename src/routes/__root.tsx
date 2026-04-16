import appCss from "../styles.css?url";

import { createRootRoute } from "@tanstack/react-router";

import { AppProvider } from "@/components/app-provider";
import { AppError } from "@/components/commons/app-error";
import { AppNotFound } from "@/components/commons/app-not-found";
import { RootProvider } from "@/components/root-provider";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Currency Hunter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <AppNotFound />
    </div>
  ),
  errorComponent: (props) => (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <AppError {...props} />
    </div>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <AppProvider>{children}</AppProvider>
    </RootProvider>
  );
}
