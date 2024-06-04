// AccountDropdown.tsx
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useResizablePanel } from "@/contexts/resizeContext";
import { useWindowSize } from "react-use";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

const AccountDropdown = ({ isCollapsed }: AccountSwitcherProps) => {
  const windowSize = useWindowSize();
  const { panelSize } = useResizablePanel();
  console.log("Panel Size is: " + panelSize);
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: userQueryOptions.queryFn,
    staleTime: Infinity,
  });

  if (isCollapsed) {
    console.log("Collapsed");
  }
  const dropdownWidth = isCollapsed
    ? "80px"
    : (panelSize * windowSize.width) / 104 + "px";

  const btnWidth = isCollapsed ? "w-12" : "w-full";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <button
          className={cn(
            `w-full h-full text-sm hover:bg-accent hover:text-foreground transition-all duration-300 pl-2.5`,
            isCollapsed ? "hidden" : "",
          )}
          aria-label="Select account"
        >
          <div className="grid grid-cols-[1fr_4fr]">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeLUKQCFxD57ukeM6_2E8q92sFhTOKNdtlCg&s"
              className="h-9 ml-auto mr-2 rounded-full ring-2 ring-gray-200"
            />
            <h1 className="my-auto mr-auto ml-2 text-lg">
              {user?.user.given_name} {user?.user.family_name}
            </h1>
          </div>
        </button>
      </DropdownMenuTrigger>
      <a
        href="/api/logout"
        className={cn(
          `left-1 text-center hover:bg-accent p-1 rounded`,
          isCollapsed ? " " : "hidden",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-log-out w-6 h-6 "
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      </a>
      <DropdownMenuContent className={btnWidth}>
        <DropdownMenuItem
          asChild
          style={{ width: dropdownWidth }}
          className="text-center"
        >
          <a href="/api/logout" className="py-3 text-center font-medium px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-log-out w-4 h-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span className="pl-1.5">Log Out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
