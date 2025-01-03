import { HelpCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserNav() {
  return (
    <div className="flex items-center gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Help and resources</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 shadow rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full bg-orange-500 p-0 text-white hover:bg-orange-500/90 hover:text-white shadow"
            >
              H
            </Button>
          </TooltipTrigger>
          <TooltipContent>Account</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
