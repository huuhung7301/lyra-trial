"use client";

import React, { useState } from "react";
import {
  Search,
  Settings,
  Table,
  Calendar,
  LayoutGrid,
  Check,
  List,
  ChevronUp,
  Plus,
  ChartGantt,
  Smartphone,
  RectangleEllipsis,
} from "lucide-react";

const viewOptions = [
  { icon: Table, label: "Grid", color: "text-blue-500", isSelected: true },
  { icon: Calendar, label: "Calendar", color: "text-green-500" },
  { icon: LayoutGrid, label: "Gallery", color: "text-purple-500" },
  { icon: Check, label: "Kanban", color: "text-orange-500" },
  { icon: ChartGantt, label: "Timeline", color: "text-red-500", isTeam: true },
  { icon: List, label: "List", color: "text-yellow-500" },
  { icon: Smartphone, label: "Gantt", color: "text-teal-500", isTeam: true },
  { icon: null, label: "New section", color: "text-teal-500", isTeam: true },
];

export default function BaseSideBar() {
  const [isCreateOpen, setIsCreateOpen] = useState(true);

  return (
    <div className="flex h-full flex-col justify-between bg-white p-4">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Find a view"
            className="text w-full border-b border-gray-200 py-2 pl-10 pr-10 focus:border-b-2 focus:border-blue-500 focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Selected view */}
        <div className="rounded-sm bg-blue-200 p-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <Table className="h-5 w-5 text-blue-500" />
            <span>Grid view</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-1 border-t px-4 pt-4">
        <button
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className="flex w-full items-center justify-between rounded-md py-2 text-left"
        >
          <span className="text-lg font-medium">Create...</span>
          <ChevronUp
            className={`h-5 w-5 transform transition-transform duration-200 ${
              isCreateOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Create options */}
        <div
          className={`space-y-1 overflow-hidden transition-all duration-200 ${
            isCreateOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          {viewOptions.map((option) => (
            <button
              key={option.label}
              className="flex w-full items-center justify-between rounded-md py-1.5 font-medium hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                {option.icon ? (
                  <option.icon className={`h-5 w-5 ${option.color}`} />
                ) : (
                  <span className={`h-5 w-5 ${option.color}`}></span>
                )}
                <span>{option.label}</span>
                {option.isTeam && (
                  <span className="ml-2 rounded-full bg-blue-200 px-2 py-0.5 text-sm text-blue-500">
                    Team
                  </span>
                )}
              </div>
              <Plus className="h-5 w-5 text-gray-500" />
            </button>
          ))}
          {/* Form Button */}
          <div className="mt-2 border-t pt-3">
            <button className="flex w-full items-center justify-between rounded-md py-2 hover:bg-gray-100">
              <div className="flex items-center gap-2 font-medium">
                <RectangleEllipsis className="h-5 w-5 text-blue-500" />
                <span>New Form</span>
              </div>
              <Plus className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
