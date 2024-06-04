import AccountDropdown from "@/components/account-dropdown";
import Nav from "@/components/nav";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Home,
  MessagesSquare,
  Send,
  Settings,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";
import { useState } from "react";
import { useWindowSize } from "react-use";
import { useResizablePanel } from "@/contexts/resizeContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const layout = Cookies.get("react-resizable-panels:layout");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");
  const { height } = useWindowSize();

  const defaultLayout: [number, number] = layout
    ? JSON.parse(layout)
    : [265, 440];
  const defaultCollapsed = collapsed ? collapsed === "true" : false;

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const { setSizes, panelRef, setPanelSize } = useResizablePanel();

  const handleCollapse = (_collapsed: boolean) => {
    setIsCollapsed(_collapsed);
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(_collapsed)}`;
  };

  const handleResize = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
    setSizes(sizes);
    console.log("The size recevied is: " + sizes);
    if (panelRef.current) {
      setPanelSize(panelRef.current.getSize());
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={handleResize}
        className="h-full items-stretch"
        style={{ height: `${height}px` }}
      >
        <ResizablePanel
          ref={panelRef}
          defaultSize={defaultLayout[0]}
          collapsedSize={3}
          collapsible={true}
          minSize={13}
          maxSize={20}
          onCollapse={() => handleCollapse(true)}
          onExpand={() => handleCollapse(false)}
          className={cn(
            isCollapsed &&
              "min-w-[10px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "",
            )}
          >
            <AccountDropdown isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "Home", icon: Home, path: "/" },
              { title: "Orders", label: "9", icon: File, path: "/orders" },
              { title: "Sent", label: "", icon: Send, path: "/sent" },
              { title: "Junk", label: "23", icon: ArchiveX, path: "/junk" },
              { title: "Trash", label: "", icon: Trash2, path: "/trash" },
              { title: "Archive", label: "", icon: Archive, path: "/archive" },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "Social", label: "972", icon: Users2, path: "/social" },
              {
                title: "Updates",
                label: "342",
                icon: AlertCircle,
                path: "/updates",
              },
              {
                title: "Forums",
                label: "128",
                icon: MessagesSquare,
                path: "/forums",
              },
              {
                title: "Shopping",
                label: "8",
                icon: ShoppingCart,
                path: "/shopping",
              },
              {
                title: "Promotions",
                label: "21",
                icon: Archive,
                path: "/promotions",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[{ title: "Settings", icon: Settings, path: "/settings" }]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={30}
          className=""
        >
          <div className="h-full overflow-y-auto">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default DashboardLayout;
