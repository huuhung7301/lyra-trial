import {
  ChevronDown,
  ChevronRight,
  Star,
  Plus,
  BookOpen,
  ShoppingBag,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useState } from "react";
import { api } from "~/trpc/react";

interface ExtendedSidebarProps {
  isExpanded: boolean;
}

export function ExtendedSidebar({ isExpanded }: ExtendedSidebarProps) {
  const router = useRouter();
  const createBaseMutation = api.base.createBase.useMutation();
  const createTableMutation = api.table.createTable.useMutation();
  const createViewMutation = api.view.createView.useMutation();


  const handleCreate = async () => {
    try {
      // Create a new base
      const newBaseId = await createBaseMutation.mutateAsync({
        title: `Untitled Base`,
        type: "Grid",
        workspace: "Personal",
        owner: "guest",
      });
  
      // Table data for the new table
      const tableData = [
        { id: 1, name: "", notes: "", assignee: "", status: "" },
        { id: 2, name: "", notes: "", assignee: "", status: "" },
        { id: 3, name: "", notes: "", assignee: "", status: "" },
        { id: 4, name: "", notes: "", assignee: "", status: "" },
      ];
  
      // Create a table for the new base and capture the newTableId
      const newTable = await createTableMutation.mutateAsync({
        name: "Table 1", // Example name, modify as needed
        baseid: newBaseId, // Make sure baseid is correctly passed as a number
        tabledata: tableData, // Pass the table data as expected
      });
  
      // Get the newTableId from the newly created table
      const newTableId = newTable.id;
  
      // Create a new view for the table
      const newView = await createViewMutation.mutateAsync({
        name: "Grid View", // Default name for the view, can be customized
        filters: {},           // Provide any default filters if needed
        sorting: {},           // Provide any default sorting if needed
        hiddenFields: {},      // Provide any default hidden fields if needed
        tableid: newTableId,   // Associate the view with the new table
      });
  
      // Get the newViewId from the newly created view
      const newViewId = newView.id;
  
      // Navigate to the new base, table, and view's URL using both the newBaseId, newTableId, and newViewId
      router.push(`/${newBaseId}-${newTableId}-${newViewId}`);
    } catch (error) {
      console.error("Error creating base, table, and view:", error);
    }
  };
  
  
  return (
    <div
      className={`fixed left-0 flex h-[calc(100vh-48px)] w-1/5 transform flex-col border-r bg-white transition-all duration-300 ease-in-out ${
        isExpanded ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col px-2">
        <div className="py-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold">Home</h2>
            <Button variant="ghost" size="icon" className="r h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-md px-2 py-3 text-gray-600">
            <Star className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              Your starred bases, interfaces, and workspaces will appear here
            </p>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base font-semibold">All workspaces</h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto px-2 py-0">
        <div className="space-y-4">
          <button className="flex w-full items-center gap-2 border-t px-2 py-1 pt-5 text-gray-600 hover:text-gray-900">
            <BookOpen className="h-5 w-5" />
            <span>Templates and apps</span>
          </button>
          <button className="flex w-full items-center gap-2 px-2 py-1 text-gray-600 hover:text-gray-900">
            <ShoppingBag className="h-5 w-5" />
            <span>Marketplace</span>
          </button>
          <button className="flex w-full items-center gap-2 px-2 py-1 text-gray-600 hover:text-gray-900">
            <Globe className="h-5 w-5" />
            <span>Import</span>
          </button>
        </div>
        <Button
          className="mb-10 mt-4 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
    </div>
  );
}
