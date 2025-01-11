"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "./editable-cell";
import { Dropdown } from "~/components/ui/dropdown";
import { AlignLeft, Circle, User, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddColumnModal } from "./add-column-modal";
import type { ColumnDef, ColumnResizeMode } from "@tanstack/react-table";
import { api } from "~/trpc/react";
import { faker } from "@faker-js/faker";
import { useVirtualizer } from "@tanstack/react-virtual";
import SearchModal from "./search-modal";
import { useViewContext } from "../view-context";
import { processData } from "./processData";
import { useParams } from "next/navigation";

const defaultData: object[] = Array.from({ length: 4 }, (_, i) => ({
  id: `i + 1`,
  name: "",
  notes: "",
  assignee: "",
  status: "",
}));

export function DataTable() {
  const [data, setData] = useState(defaultData); // Type is inferred from defaultData
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const tableRef = useRef<HTMLTableElement>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());
  const lastSavedData = useRef(data); // Keep track of the last saved data
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { viewData } = useViewContext();
  const params = useParams<{ base?: string | string[] }>(); // Account for base being string or string[]
  const baseParam = typeof params.base === "string" ? params.base : undefined;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      setIsSearchModalOpen(true); // Open modal when Ctrl + F is pressed
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // If base is not valid, return null (or you can render an error message)
  if (!baseParam) {
    return <div>Invalid base parameter</div>;
  }

  // Split the baseParam into baseId and tableId
  const [baseId, tableId, viewId] = baseParam.split("-");

  if (!baseId || !tableId || !viewId) {
    return <div>Invalid base or table ID</div>;
  }
  const tableIdNum = tableId ? parseInt(tableId) : null;
  const add15kRow = () => {
    // Generate 15,000 new rows of data using faker.js
    const newData = Array.from({ length: 15000 }, () => ({
      id: faker.number.int(), // Call the method to generate a number
      name: faker.person.firstName(), // Call the method to generate a first name
      notes: faker.lorem.sentence(), // Call the method to generate a sentence
      assignee: faker.person.lastName(), // Call the method to generate a last name
      status: faker.helpers.arrayElement(["Active", "Inactive", "Pending"]), // Call to select an array element
    }));

    setData(newData); // Replace the old data with the newly generated data
  };

  const {
    data: tableData,
    isLoading,
    isError,
  } = api.table.getTableById.useQuery(
    { id: tableIdNum ?? 0 }, // Pass the table ID as a number
    {
      enabled: !!tableIdNum, // Only fetch if tableId is valid
    },
  );

  // Update data when tableData is available
  useEffect(() => {
    if (tableData?.tabledata && Array.isArray(tableData.tabledata)) {
      try {
        // Add an auto-increment `id` to each object, ensure item is an object
        const dataWithIds = tableData.tabledata.map((item, index) => {
          if (item && typeof item === "object") {
            return {
              id: index + 1, // Auto-increment id starting from 1
              ...item,
            };
          }
          // If the item is not an object, handle it accordingly (e.g., skip it or create a default object)
          return { id: index + 1 };
        });

        setData(dataWithIds as object[]);
      } catch (error) {
        console.error("Error setting table data:", error);
      }
    }
  }, [tableData]);

  const updateTable = api.table.updateTable.useMutation();

  const saveTable = useCallback(async () => {
    if (!tableId) return; // Ensure tableId is available

    // Check if data has changed
    if (JSON.stringify(data) === JSON.stringify(lastSavedData.current)) {
      console.log("No changes detected, skipping save");
      return;
    }

    try {
      console.log("Saving table data...");
      await updateTable.mutateAsync({
        id: parseInt(tableId),
        tabledata: data,
      });
      console.log("Table data saved successfully");
      lastSavedData.current = data; // Update last saved data after successful save
    } catch (error) {
      console.error("Error saving table data:", error);
    }
    if (data) {
      console.log("Processed data", processData(data, viewData));
    }
  }, [data, tableId, updateTable]);

  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: string | number) => {
      setData((prev) => {
        const newData = [...prev];
        const rowToUpdate = newData[rowIndex];
        if (rowToUpdate) {
          newData[rowIndex] = { ...rowToUpdate, [columnId]: value };
        }
        return newData;
      });
    },
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      void saveTable(); // Explicitly ignore the promise to satisfy the linter
    }, 1000); // Adjusted to 10,000 ms (10 seconds) for consistency with the comment

    return () => clearInterval(interval); // Cleanup on unmount
  }, [saveTable]);

  const handleCellNavigation = useCallback(
    (
      rowIndex: number,
      columnId: string,
      key:
        | "Tab"
        | "ShiftTab"
        | "Enter"
        | "ArrowUp"
        | "ArrowDown"
        | "ArrowLeft"
        | "ArrowRight",
    ) => {
      const editableColumns = table.getHeaderGroups().flatMap(
        (headerGroup) =>
          headerGroup.headers
            .map((header) => header.column.id)
            .filter((id, index) => index !== 0), // Exclude the first column
      );

      const currentColumnIndex = editableColumns.indexOf(columnId);

      let nextRowIndex = rowIndex;
      let nextColumnIndex = currentColumnIndex;

      if (key === "Tab") {
        // Move to the next column within the same row
        if (currentColumnIndex < editableColumns.length - 1) {
          nextColumnIndex = currentColumnIndex + 1;
        }
      } else if (key === "ShiftTab") {
        // Move to the previous column within the same row
        if (currentColumnIndex > 0) {
          nextColumnIndex = currentColumnIndex - 1;
        }
      } else if (key === "Enter") {
        // Move to the same column in the next row
        nextRowIndex = (rowIndex + 1) % data.length;
      } else if (key === "ArrowUp") {
        // Move to the same column in the previous row
        nextRowIndex = rowIndex - 1;
      } else if (key === "ArrowDown") {
        // Move to the same column in the next row
        nextRowIndex = (rowIndex + 1) % data.length;
      } else if (key === "ArrowLeft") {
        // Move to the previous column within the same row
        if (currentColumnIndex > 0) {
          nextColumnIndex = currentColumnIndex - 1;
        }
      } else if (key === "ArrowRight") {
        // Move to the next column within the same row
        if (currentColumnIndex < editableColumns.length - 1) {
          nextColumnIndex = currentColumnIndex + 1;
        }
      }
      // Find the next column ID
      const nextColumnId = editableColumns[nextColumnIndex];
      // Find the next cell and focus it
      const nextCell = tableRef.current?.querySelector(
        `tr:nth-child(${nextRowIndex + 1}) td[data-column-id="${nextColumnId}"] input`,
      ) as HTMLInputElement | null;
      console.log("keys:", nextRowIndex, "-", nextColumnId);
      console.log("Table Ref Current:", tableRef.current);

      nextCell?.focus();
    },
    [data.length],
  );

  const processedData = useMemo<Record<string, unknown>[]>(() => {
    // Cast data to Record<string, unknown>[] if needed
    return processData(data, viewData) as Record<string, unknown>[];
  }, [data, viewData]);

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!processedData[0]) return [];

    return Object.keys(processedData[0]).map((key, index) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      size: index === 0 ? 50 : 160,
      cell: ({ getValue, row }) => (
        <EditableCell
          getValue={getValue}
          rowIndex={row.index}
          columnId={key}
          setValue={(value) => updateData(row.index, key, value)}
          onNavigate={handleCellNavigation}
          searchQuery={searchQuery}
        />
      ),
    }));
  }, [data, searchQuery, updateData, handleCellNavigation, processedData]);

  const table = useReactTable<Record<string, unknown>>({
    data: processedData, // Ensure data type matches
    columns, // Ensure columns type matches Record<string, unknown>
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode,
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35, // Set row height
  });

  const headerIcons: Record<string, React.ReactNode> = {
    id: null,
    name: null,
    notes: <AlignLeft className="h-4 w-4" />,
    assignee: <User className="h-4 w-4" />,
    status: <Circle className="h-4 w-4" />,
  };

  const addColumn = async (name: string, type: string) => {
    setData((prevData) =>
      prevData.map((row) => ({
        ...row,
        [name.toLowerCase().replace(/\s+/g, "_")]: "",
      })),
    );
    try {
      await saveTable(); // Await the promise
    } catch (error) {
      console.error("Failed to save table:", error);
    }
  };

  const addRow = async () => {
    if (!data[0]) return;

    const newRow = Object.keys(data[0]).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: "",
        };
      },
      { id: data.length + 1 },
    );

    setData((prevData) => [...prevData, newRow]);
    try {
      await saveTable(); // Await the promise
    } catch (error) {
      console.error("Failed to save table:", error);
    }
  };

  console.log("aaa", data);
  console.log("bbb", processedData);
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-50 w-[25%]">
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)} // Close modal
          onSearch={handleSearch} // Handle the search query from the modal
          searchQuery={searchQuery} // Pass the current search query
        />
      </div>
      <AddColumnModal
        open={isAddColumnModalOpen}
        onOpenChange={setIsAddColumnModalOpen}
        onAddColumn={addColumn}
      />
      <div className="flex items-start overflow-auto rounded-lg">
        <div>
          <div
            ref={tableContainerRef}
            className="flex overflow-y-auto"
            style={{ height: "500px", width: "100%" }}
          >
            <table className="text table-auto border-collapse" ref={tableRef}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-[#f4f4f4]">
                    {headerGroup.headers.map((header) => {
                      const columnId = header.column.id;
                      const icon = headerIcons[columnId] ?? null;

                      return (
                        <th
                          key={header.id}
                          className="relative p-2"
                          style={{
                            width: header.getSize(),
                          }}
                        >
                          {columnId === "id" ? (
                            <div className="flex items-center justify-center">
                              <input type="checkbox" className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="w-full">
                              <Dropdown
                                id={header.id}
                                type="table"
                                className="ml-1"
                                justifyOption="between"
                              >
                                <div className="flex items-center gap-2 text-sm font-normal">
                                  {icon && <span>{icon}</span>}
                                  <span>
                                    {header.column.columnDef.header as string}
                                  </span>
                                </div>
                              </Dropdown>
                            </div>
                          )}

                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute right-0 top-0 h-full w-[1px] cursor-col-resize touch-none select-none bg-gray-200"
                            style={{
                              transform: "translateX(50%)",
                            }}
                          >
                            <div className="absolute -left-0.5 -right-0.5 bottom-1 top-1 rounded bg-transparent hover:bg-blue-500"></div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody
                style={{
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = table.getRowModel().rows[virtualRow.index];
                  if (row)
                    return (
                      <tr
                        key={row.id}
                        className="group"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          transform: `translateY(${virtualRow.start}px)`, // Position the row
                          width: "100%", // Ensure full width
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="relative border"
                            data-column-id={cell.column.id}
                          >
                            {cell.column.id === "id" ? (
                              <div className="px-7">
                                <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-0">
                                  {row.index + 1}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={checkedRows.has(row.id)}
                                    onChange={() => {
                                      setCheckedRows((prev) => {
                                        const newCheckedRows = new Set(prev);
                                        if (newCheckedRows.has(row.id)) {
                                          newCheckedRows.delete(row.id);
                                        } else {
                                          newCheckedRows.add(row.id);
                                        }
                                        return newCheckedRows;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                })}
              </tbody>
            </table>
            <Button
              onClick={() => setIsAddColumnModalOpen(true)}
              className="flex items-center gap-2 bg-[#f4f4f4] px-14"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          <div>
            <Button
              onClick={() => addRow()}
              className="flex items-center gap-2 bg-[#f4f4f4] px-4"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
            <Button
              onClick={add15kRow}
              className="ml-4 flex items-center gap-2 bg-[#f4f4f4] px-4"
            >
              <PlusIcon className="h-6 w-6" />
              Add 15k rows
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
