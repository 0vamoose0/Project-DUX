import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { ResizablePanelProvider } from "@/contexts/resizeContext";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <ResizablePanelProvider>
      <Outlet />
    </ResizablePanelProvider>
  );
}
