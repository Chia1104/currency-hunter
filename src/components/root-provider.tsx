// import { lazy } from "react";

import { HeadContent, Scripts } from "@tanstack/react-router";

// const TanStackDevtools = lazy(() =>
//   import("@tanstack/react-devtools").then((module) => ({
//     default: module.TanStackDevtools,
//   }))
// );
// const ReactQueryDevtoolsPanel = lazy(() =>
//   import("@tanstack/react-query-devtools").then((module) => ({
//     default: module.ReactQueryDevtoolsPanel,
//   }))
// );
// const TanStackRouterDevtoolsPanel = lazy(() =>
//   import("@tanstack/react-router-devtools").then((module) => ({
//     default: module.TanStackRouterDevtoolsPanel,
//   }))
// );

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans wrap-anywhere antialiased ">
        {children}
        {/* {process.env.NODE_ENV === "development" && (
          <TanStackDevtools
            config={{
              position: "bottom-left",
            }}
            plugins={[
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )} */}
        <Scripts />
      </body>
    </html>
  );
};
