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
import { useParams } from "next/navigation";

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
  const { tabledata, increaseOffset, viewData, updateViewData } =
    useViewContext();
  const params = useParams<{ base?: string | string[] }>(); // Account for base being string or string[]
  const baseParam = typeof params.base === "string" ? params.base : "0-0-0";
  const [modifiedRows, setModifiedRows] = useState<Record<string, unknown>[]>(
    [],
  );
  useEffect(() => {
    const handleScroll = () => {
      const tableContainer = tableContainerRef.current;
      if (!tableContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = tableContainer;

      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // Adding a little buffer
        increaseOffset();
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (tabledata) {
      setData(tabledata); // Update data when tabledata is available
    }
  }, [tabledata]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      setIsSearchModalOpen(true); // Open modal when Ctrl + F is pressed
    }

    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      // Use `void` to indicate you're deliberately not handling the promise here
      void handleSaveTable(); // Ignore the promise
    }
  };

  // Separate async function for saving the table
  const handleSaveTable = async () => {
    try {
      await saveTable();
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Split the baseParam into baseId and tableId
  const [baseId, tableId, viewId] = baseParam.split("-");

  const updateTable = api.table.updateTable.useMutation();
  const add15kRow = async () => {
    const newData = Array.from({ length: 15000 }, () => ({
      id: faker.number.int(),
      name: faker.person.firstName(),
      notes: faker.lorem.sentence(),
      assignee: faker.person.lastName(),
      status: faker.helpers.arrayElement(["Active", "Inactive", "Pending"]),
    }));

    if (!tableId) {
      console.error("Invalid or missing tableId");
      return;
    }

    try {
      // Assuming `updateTable` is the API mutation function you are calling
      await updateTable.mutateAsync({
        id: parseInt(tableId), // Example table ID, replace with actual ID
        tabledata: newData,
      });

      console.log("15k rows successfully added");
      increaseOffset(1);
    } catch (error) {
      console.error("Error adding rows:", error);
    }
  };

  const updateTable2 = api.table.updateTable2.useMutation();

  const saveTable = useCallback(async () => {
    if (!tableId) return; // Ensure tableId is available

    // Check if data has changed by comparing with the last saved data
    if (modifiedRows.length === 0) {
      console.log("No changes detected, skipping save");
      return;
    }
    console.log("midify row", modifiedRows);
    try {
      console.log("Saving table data...");
      await updateTable2.mutateAsync({
        tableId: parseInt(tableId),
        newRowData: modifiedRows, // Pass the entire updated data to the mutation
      });
      setModifiedRows([]);
      console.log("Table data saved successfully");
    } catch (error) {
      console.error("Error saving table data:", error);
    }
  }, [modifiedRows]);

  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: string | number) => {
      setData((prev) => {
        const newData = [...prev];
        const rowToUpdate = newData[rowIndex];
        if (rowToUpdate) {
          newData[rowIndex] = { ...rowToUpdate, [columnId]: value };

          setModifiedRows((prevModifiedRows) => {
            const existingRowIndex = prevModifiedRows.findIndex(
              (row) => row.id === rowToUpdate.id, // Assuming each row has a unique 'id'
            );

            if (existingRowIndex === -1) {
              // If not found, add the row
              return [...prevModifiedRows, rowToUpdate];
            } else {
              // If found, replace that row
              const updatedRows = [...prevModifiedRows];
              updatedRows[existingRowIndex] = rowToUpdate; // Replace the existing row
              return updatedRows;
            }
          });
        }
        return newData;
      });
    },
    [],
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear the previous timeout
    }

    // Set a new timeout with a 1000ms (1 second) delay
    debounceTimeout.current = setTimeout(() => {
      void saveTable(); // Explicitly ignore the promise to satisfy the linter
    }, 2000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Clean up timeout on unmount
      }
    };
  }, [data, saveTable]);

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

      nextCell?.focus();
    },
    [data.length],
  );

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!data[0]) return [];

    return Object.keys(data[0]).map((key, index) => ({
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
  }, [data, searchQuery, handleCellNavigation]);

  const table = useReactTable<Record<string, unknown>>({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode,
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
  });

  const headerIcons: Record<string, React.ReactNode> = {
    id: null,
    name: null,
    notes: <AlignLeft className="h-4 w-4" />,
    assignee: <User className="h-4 w-4" />,
    status: <Circle className="h-4 w-4" />,
  };

  const addColumn = async (name: string, type: string) => {
    const columnName = name.toLowerCase().replace(/\s+/g, "_");
  
    // Update `data` with the new column added to each row
    setData((prevData) => {
      const updatedData = prevData.map((row) => ({
        ...row,
        [columnName]: "", // Add the new column with default empty value
      }));
      setModifiedRows(updatedData)
      return updatedData;
    });
  };
  

  const addRow = async () => {
    if (!data[0]) return;

    // Create a new row with the same structure as the existing data
    const newRow = Object.keys(data[0]).reduce(
      (acc, key) => ({
        ...acc,
        [key]: "", // Default empty value for new row
      }),
      {}, // Start with an empty object
    );

    // Add the 'id' field directly to the new row
    const addNewRow = { ...newRow, id: (data.length + 1).toString() };
    setModifiedRows((prevModifiedRows) => [...prevModifiedRows, addNewRow]);

    // Add the new row to the data and newRows state
    setData((prevData) => {
      const updatedData = [...prevData, addNewRow]; // Add new row to the data
      return updatedData;
    });
  };

  console.log("data", data);

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
