import { HelpCircle, Bell, Users, Clock1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BaseUserNav() {
  return (
    <div className="flex items-center gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 text-[#ebded9] hover:bg-[#854631] hover:text-white rounded-full">
              <Clock1 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Base History</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant="ghost"
        size="icon"
        className="w-fit rounded-full bg-transparent px-4 py-2 font-normal text-[#ebded9] hover:bg-[#854631] hover:text-white"
      >
        <HelpCircle className="h-5 w-5 mr-2" />
        Help
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-fit rounded-full bg-[#6f3b29] px-4 py-2 font-normal text-white shadow hover:bg-orange-400/90 hover:text-white"
      >
        Trial: 12 days left
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-fit rounded-full bg-white px-4 py-2 font-normal text-[#995741] shadow hover:bg-orange-400/90 hover:text-white"
      >
        <Users className="mr-2 h-4 w-4" />
        Share
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full shadow"
            >
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
              className="h-8 w-8 shrink-0 rounded-full bg-orange-500 p-0 text-white shadow hover:bg-orange-500/90 hover:text-white"
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
