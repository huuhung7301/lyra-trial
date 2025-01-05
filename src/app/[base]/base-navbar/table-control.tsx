"use client";

import React from "react";
import {
  Table,
  Users,
  Settings2,
  EyeOff,
  ListFilter,
  RectangleHorizontal,
  ArrowDownUp,
  PaintBucket,
  MoveVertical,
  ExternalLink,
  Search,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TableControlsProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TableControls({
  isSideBarOpen,
  setIsSideBarOpen,
}: TableControlsProps) {
  // List of buttons with icon, label, and optional actions
  const buttons = [
    { icon: <Menu className="h-5 w-5" strokeWidth={1} />, label: "Views", onClick: () => setIsSideBarOpen(!isSideBarOpen) },
    { icon: <Table className="h-5 w-5 text-blue-500" strokeWidth={1} />, label: "Grid view" },
    { icon: <EyeOff className="h-5 w-5" strokeWidth={1} />, label: "Hide fields" },
    { icon: <ListFilter className="h-5 w-5" strokeWidth={1} />, label: "Filter" },
    { icon: <RectangleHorizontal className="h-5 w-5" strokeWidth={1} />, label: "Group" },
    { icon: <ArrowDownUp className="h-5 w-5" strokeWidth={1} />, label: "Sort" },
    { icon: <PaintBucket className="h-5 w-5" strokeWidth={1} />, label: "Color" },
    { icon: <MoveVertical className="h-5 w-5" strokeWidth={1} />, label: "", size: "icon" }, // Icon only button
    { icon: <ExternalLink className="h-5 w-5" strokeWidth={1} />, label: "Share and sync" },
  ];

  return (
    <div className="flex h-12 items-center justify-between border-b px-3 py-7">
      <div className="flex items-center gap-2">
        {/* Render buttons using map */}
        {buttons.map(({ icon, label, onClick, size = "normal" }, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`gap-2 font-normal hover:bg-gray-200 ${size === "icon" ? "p-1" : ""}`}
            onClick={onClick}
          >
            {icon}
            {label && label}
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6" />

      </div>

      <div>
        <Button variant="ghost" size="icon" className="font-normal hover:bg-gray-200">
          <Search className="h-4 w-4" strokeWidth={1} />
        </Button>
      </div>
    </div>
  );
}
