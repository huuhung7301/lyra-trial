"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ColumnFilter from "../table-control-list/column-filter";
import RowFilter from "../table-control-list/row-filter";
import SortFilter from "../table-control-list/sort-filter";

interface TableControlsProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TableControls({
  isSideBarOpen,
  setIsSideBarOpen,
}: TableControlsProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); // Tracks which dropdown is open
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Reference to dropdown container

  // List of buttons with icon, label, and optional actions
  const buttons = [
    { icon: <Menu className="h-5 w-5" strokeWidth={1} />, label: "Views", onClick: () => setIsSideBarOpen(!isSideBarOpen), hasDropdown: false },
    { icon: <Table className="h-5 w-5 text-blue-500" strokeWidth={1} />, label: "Grid view", hasDropdown: false },
    { icon: <EyeOff className="h-5 w-5" strokeWidth={1} />, label: "Hide fields", hasDropdown: true },
    { icon: <ListFilter className="h-5 w-5" strokeWidth={1} />, label: "Filter", hasDropdown: true },
    { icon: <RectangleHorizontal className="h-5 w-5" strokeWidth={1} />, label: "Group", hasDropdown: false },
    { icon: <ArrowDownUp className="h-5 w-5" strokeWidth={1} />, label: "Sort", hasDropdown: true },
    { icon: <PaintBucket className="h-5 w-5" strokeWidth={1} />, label: "Color", hasDropdown: false },
    { icon: <MoveVertical className="h-5 w-5" strokeWidth={1} />, label: "", size: "icon", hasDropdown: false }, // Icon only button
    { icon: <ExternalLink className="h-5 w-5" strokeWidth={1} />, label: "Share and sync", hasDropdown: false },
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleButtonClick = (label: string) => {
    // Only handle dropdown for buttons with dropdown
    const button = buttons.find(button => button.label === label);
    if (button?.hasDropdown) {
      // Toggle dropdown visibility
      setDropdownOpen(dropdownOpen === label ? null : label);
    }
  };

  const renderDropdownContent = (label: string) => {
    if (label === "Hide fields") {
      return <ColumnFilter />;
    }
    if (label === "Filter") {
      return <RowFilter onClose={() => setDropdownOpen(null)} />;
    }
    if (label === "Sort") {
      return <SortFilter onClose={() => setDropdownOpen(null)} />
    }
    return null;
  };

  return (
    <div className="flex h-12 items-center justify-between border-b px-3 py-7">
      <div className="flex items-center gap-2">
        {/* Render all buttons */}
        {buttons.map(({ icon, label, size = "normal", hasDropdown, onClick }, index) => (
          <div key={index} className="relative">
            <Button
              variant="ghost"
              className={`gap-2 font-normal hover:bg-gray-200 ${size === "icon" ? "p-1" : ""}`}
              onClick={() => hasDropdown ? handleButtonClick(label) : onClick?.()} // Only handle dropdown for specific buttons
            >
              {icon}
              {label && label}
              {label && hasDropdown && <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>

            {/* Dropdown Menu for buttons that need it */}
            {dropdownOpen === label && hasDropdown && (
              <div ref={dropdownRef} className="absolute left-0 mt-2 z-50">
                {renderDropdownContent(label)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <Button variant="ghost" size="icon" className="font-normal hover:bg-gray-200">
          <Search className="h-4 w-4" strokeWidth={1} />
        </Button>
      </div>
    </div>
  );
}
