"use client";

import React, { useEffect, useState } from "react";
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
import { api } from "~/trpc/react";
import { useParams, useRouter } from "next/navigation";

const viewOptions = [
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
  const params = useParams<{ base?: string | string[] }>();
  const base = typeof params.base === "string" ? params.base : undefined;
  const router = useRouter();

  if (!base) {
    return <div>Invalid base parameter</div>;
  }

  const [baseId, tableId, viewId] = base.split("-");

  if (!baseId || !tableId || !viewId) {
    return <div>Invalid base, table, or view ID</div>;
  }

  // Convert tableId and viewId to numbers
  const tableIdNum = parseInt(tableId, 10);
  const viewIdNum = parseInt(viewId, 10);
  const [selectedViewId, setSelectedViewId] = useState<number | null>(0); // State to track selected view

  const {
    data: views,
    refetch,
    isLoading,
    isError,
  } = api.view.getAllViewsByTableId.useQuery(
    { tableId: tableIdNum }, // Pass the table ID as a number
    {
      enabled: !!tableIdNum, // Only fetch if tableId is valid
    },
  );
  useEffect(() => {
    if (views && views[0] && !selectedViewId) {
      setSelectedViewId(viewIdNum); // Select the first view if no view is selected
    }
  }, [views, selectedViewId]);

  const handleSelectView = (viewId: number) => {
    if (viewId != selectedViewId) {
      setSelectedViewId(viewId);
      router.replace(`${baseId}-${tableIdNum}-${viewId}`);
    }
  };
  const createViewMutation = api.view.createView.useMutation();


  const handleCreateView = async () => {
    try {
      // Call createView mutation to generate a new view
      const newView = await createViewMutation.mutateAsync({
        name: "Grid View", // Default name for the view, can be customized
        filters: {}, // Provide any default filters if needed
        sorting: {}, // Provide any default sorting if needed
        hiddenFields: {}, // Provide any default hidden fields if needed
        tableid: tableIdNum, // Associate the view with the new table
      });

      // Once view is created, set it as selected and navigate to it
      router.replace(`${baseId}-${tableIdNum}-${newView.id}`);
      // Add the new view to the list (you can add it to the start or end of the list)
      refetch()
      // Set the selected view to the newly created view's ID
      setSelectedViewId(newView.id);
    } catch (error) {
      console.error("Error creating view:", error);
    }
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading views...</div>;
  if (isError) return <div>Error loading views</div>;

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

        {views && views.length > 0 && (
          <div>
            {views.map((view) => (
              <div
                key={view.id}
                onClick={() => handleSelectView(view.id)} // Set clicked view as selected
                className={`cursor-pointer rounded-sm p-2 ${
                  selectedViewId === view.id ? "bg-blue-200" : ""
                }`}
              >
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  <Table className="h-5 w-5 text-blue-500" />
                  <span>{view.name}</span>{" "}
                  {/* Assuming `view.name` holds the view's name */}
                </div>
              </div>
            ))}
          </div>
        )}
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
          <button
            onClick={handleCreateView}
            className="flex w-full items-center justify-between rounded-md py-1.5 text-left font-medium hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <Table className="h-5 w-5 text-blue-500" />
              <span className="text-md font-sm">Create New View</span>
            </div>
            <Plus className="h-5 w-5 text-gray-500" />
          </button>

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
