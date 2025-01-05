"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  id: number;
  type: "table" | "view";
  children?: React.ReactNode;
  onOptionSelect?: (option: string, id: number) => void;
  className?: string; // Class name for the icon
}

export function Dropdown({
  id,
  type,
  children,
  onOptionSelect,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown options based on the type (table or view)
  const options = type === "table"
    ? [
        { label: "Import data", icon: null },
        { label: "Rename table", icon: null },
        { label: "Hide table", icon: null },
        { label: "Manage fields", icon: null },
        { label: "Duplicate table", icon: null },
        { label: "Configure date dependencies", icon: null },
        { label: "Edit table description", icon: null },
        { label: "Edit table permissions", icon: null },
        { label: "Clear data", icon: null, danger: true },
        { label: "Delete table", icon: null, danger: true },
      ]
    : [
        { label: "Collaborative view", icon: null },
        { label: "Rename view", icon: null },
        { label: "Edit view description", icon: null },
        { label: "Duplicate view", icon: null },
        { label: "Download CSV", icon: null },
        { label: "Print view", icon: null },
        { label: "Delete view", icon: null, danger: true },
      ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false); // Close the dropdown if the click is outside
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Render the button with the ChevronDown icon */}
      <div className="flex items-center cursor-pointer">
        {children}
        {/* ChevronDown icon that toggles the dropdown */}
        <ChevronDown
          className={`h-5 w-5 text-gray-500 ${className}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing dropdown when clicking on icon
            setIsOpen((prev) => !prev); // Toggle dropdown visibility
          }}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-96 rounded-lg bg-white shadow-lg z-10"
          onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside the dropdown
        >
          {options.map((option) => (
            <div
              key={option.label} // Ensure a unique key for each option
              onClick={() => {
                onOptionSelect?.(option.label, id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 ${
                option.danger ? "text-red-600" : ""
              }`}
            >
              {option.icon && <span className="h-5 w-5">{option.icon}</span>}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
