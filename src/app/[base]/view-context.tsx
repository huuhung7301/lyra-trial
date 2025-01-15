import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  updateViewData: (
    updatedViewData: ViewContextData["viewData"],
  ) => Promise<void>;
  tabledata: Record<string, unknown>[];
  offset: number;
  increaseOffset: (value?: number) => void;
}
const defaultData: Record<string, unknown>[] = Array.from(
  { length: 4 },
  (_, i) => ({
    id: i + 1,
    name: "",
    notes: "",
    assignee: "",
    status: "",
  }),
);

const ViewContext = createContext<ViewContextData>({
  viewData: null,
  columns: [],
  isLoading: true,
  isError: false,
  // Change the default function to return a Promise
  updateViewData: async () => {
    console.warn("update view data"); // Or you can leave it empty if needed
  },
  tabledata: defaultData,
  offset: 0,
  increaseOffset: () => {
    console.warn("Increase off set"); // Or you can leave it empty if needed
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
  const [offset, setOffset] = useState(0);
  const increaseOffset = useCallback((value?: number) => {
    if (value !== undefined) {
      setOffset(value); // If value is passed, set offset to that value
    } else {
      setOffset((prevOffset) => prevOffset + 50); // If no value is passed, increment by 50
    }
  }, []);

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

  const [tabledata, setTableData] = useState<Record<string, unknown>[]>([]);
  const { data: basicTableDataResponse, isLoading: isBasicLoading } =
    api.table.getPaginationTableById.useQuery(
      {
        id: tableId,
        viewId: viewId,
        limit: 50, // Pagination limit
        offset: offset,
      },
      {
        enabled: !!tableId && !viewData, // Only run if viewData is not available
      },
    );

  const { data: advancedTableDataResponse, isLoading: isAdvancedLoading } =
    api.table.getPaginationTableById2.useQuery(
      {
        id: tableId,
        filters:
          Array.isArray(viewData?.filters) &&
          viewData.filters.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "field" in item &&
              "operator" in item,
          )
            ? (viewData.filters as {
                field: string;
                operator: string;
                value?: string;
              }[])
            : undefined,
        sorting:
          Array.isArray(viewData?.sorting) &&
          viewData.sorting.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "field" in item &&
              "direction" in item,
          )
            ? (viewData.sorting as {
                field: string;
                direction: "asc" | "desc";
              }[])
            : undefined,
        hiddenFields:
          Array.isArray(viewData?.hiddenFields) &&
          viewData.hiddenFields.every((item) => typeof item === "string")
            ? (viewData.hiddenFields as string[])
            : undefined,
        limit: 50,
        offset: offset,
      },
      {
        enabled: !!tableId && !!viewData,
      },
    );

  useEffect(() => {
    // Determine which response to use based on availability
    const tableDataResponse = viewData
      ? advancedTableDataResponse
      : basicTableDataResponse;

    if (tableDataResponse && Array.isArray(tableDataResponse)) {
      try {
        const tableDataArray = tableDataResponse[0]?.tabledata;

        if (Array.isArray(tableDataArray)) {
          // Add auto-incremented IDs
          const dataWithIds = tableDataArray.map((item, index) => ({
            id: index + 1, // Auto-increment id
            ...(typeof item === "object" && item !== null ? item : {}),
          }));
          if (offset == 0) {
            setTableData(dataWithIds);
          } else {
            setTableData((prevData) => [...prevData, ...dataWithIds]);
          }
        } else {
          console.error(
            "tableDataResponse.tableData[0].tabledata is not an array",
          );
        }
      } catch (error) {
        console.error("Error processing table data:", error);
      }
    }
  }, [
    basicTableDataResponse,
    advancedTableDataResponse,
    isBasicLoading,
    isAdvancedLoading,
    offset
  ]);

  const updateViewMutation = api.view.updateView.useMutation();

  // Function to update the viewData
  const updateViewData = async (
    updatedViewData: ViewContextData["viewData"],
  ) => {
    setOffset(0);
    if (updatedViewData) {
      // Check if updatedViewData is not null
      try {
        // Call the API to update the view data on the backend
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
      value={{
        viewData,
        columns,
        isLoading,
        isError,
        updateViewData,
        tabledata,
        offset,
        increaseOffset,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useViewContext() {
  return useContext(ViewContext);
}
