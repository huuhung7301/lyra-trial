"use client";

import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { BaseUserNav } from "./base-user-nav";
import { TableControls } from "./table-control";
import { TableList } from "./table-list";

interface NavBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tables: { id: string; name: string }[]; // Accept tables as a prop
  selectedTableId: string;
  setSelectedTableId: React.Dispatch<React.SetStateAction<string>>;
}

export function BaseNavBar({ isSidebarOpen, setIsSidebarOpen, tables, selectedTableId, setSelectedTableId }: NavBarProps) {
  return (
    <div>
      <div className="sticky top-0 flex h-16 items-center justify-between gap-4 bg-[#944e37] px-4 py-8 text-white">
        {/* Left side: Button, Title, and NavMenu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Untitled Base</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <NavMenu />
        </div>{" "}
        <BaseUserNav />
      </div>
      <div>
        {/* Pass the tables to TableList */}
        <TableList tables={tables} selectedTableId={selectedTableId} setSelectedTableId={setSelectedTableId} />
        <TableControls isSideBarOpen={isSidebarOpen} setIsSideBarOpen={setIsSidebarOpen} />
      </div>
    </div>
  );
}
