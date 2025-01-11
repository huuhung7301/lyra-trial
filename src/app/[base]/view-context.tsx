import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "~/trpc/react"; // Assuming you're using trpc for API calls
import { JsonValue } from "type-fest";

export interface ViewContextData {
  viewData: {
    id: number;
    name: string;
    createdat: Date;
    updatedat: Date;
    filters: JsonValue;
    sorting: JsonValue;
    hiddenFields: JsonValue;
    tableid: number;
  } | null;
  columns: string[]; // List of column names (keys)
  isLoading: boolean;
  isError: boolean;
  updateViewData: (updatedViewData: ViewContextData["viewData"]) => Promise<void>;
}

const ViewContext = createContext<ViewContextData>({
  viewData: null,
  columns: [],
  isLoading: true,
  isError: false,
  // Change the default function to return a Promise
  updateViewData: async () => {
    console.warn("update view data"); // Or you can leave it empty if needed
  },
});

export function ViewProvider({
  viewId,
  tableId,
  children,
}: {
  viewId: number;
  tableId: number;
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = api.view.getViewById.useQuery({
    viewId,
    tableId,
  });

  const [columns, setColumns] = useState<string[]>([]);
  const [viewData, setViewData] = useState<ViewContextData["viewData"] | null>(
    null,
  );

  useEffect(() => {
    if (data?.tableData && Array.isArray(data.tableData)) {
      const tableDataArray = data.tableData as Record<string, string>[];
      if (tableDataArray[0]) {
        const extractedColumns = Object.keys(tableDataArray[0]).filter(
          (column) => column !== "id",
        );
        setColumns(extractedColumns);
      }
    }

    // Set initial view data
    setViewData(
      data
        ? {
            id: data.id,
            name: data.name,
            createdat: data.createdat,
            updatedat: data.updatedat,
            filters: data.filters,
            sorting: data.sorting,
            hiddenFields: data.hiddenFields,
            tableid: data.tableid,
          }
        : null,
    );
  }, [data]);

  const updateViewMutation = api.view.updateView.useMutation();

// Function to update the viewData
const updateViewData = async (
  updatedViewData: ViewContextData["viewData"]
) => {
  if (updatedViewData) { // Check if updatedViewData is not null
    try {
      // Call the API to update the view data on the backend
      console.log("updating filter data")
      await updateViewMutation.mutateAsync({
        id: updatedViewData.id,
        name: updatedViewData.name,
        filters: updatedViewData.filters,
        sorting: updatedViewData.sorting,
        hiddenFields: updatedViewData.hiddenFields,
      });

      // After updating backend, update the local state
      setViewData(updatedViewData);
    } catch (error) {
      console.error("Error updating view data:", error);
    }
  }
};

  return (
    <ViewContext.Provider
      value={{ viewData, columns, isLoading, isError, updateViewData }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useViewContext() {
  return useContext(ViewContext);
}
