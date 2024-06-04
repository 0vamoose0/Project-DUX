import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link } from "@tanstack/react-router";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    path: string;
  }[];
}

const Nav = ({ links, isCollapsed }: NavProps) => {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={link.path}
                  activeProps={{
                    className: cn(
                      buttonVariants({ variant: "default", size: "icon" }),
                      "h-9 w-9",
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                      "!text-background dark:!text-white",
                    ),
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to={link.path}
              activeProps={{
                className: cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start !text-background dark:!text-white",
                ),
              }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && <span className="ml-auto">{link.label}</span>}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
};

export default Nav;
