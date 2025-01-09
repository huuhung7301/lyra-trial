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

const defaultData: object[] = Array.from({ length: 4 }, (_, i) => ({
  id: `i + 1`,
  name: "",
  notes: "",
  assignee: "",
  status: "",
}));

interface DataTableProps {
  tableId: string | null;
}

export function DataTable({ tableId }: DataTableProps) {
  const [data, setData] = useState(defaultData); // Type is inferred from defaultData
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const tableRef = useRef<HTMLTableElement>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());
  const tableIdNum = tableId ? parseInt(tableId) : null;
  const lastSavedData = useRef(data); // Keep track of the last saved data
  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    const saveTablePeriodically = async () => {
      try {
        await saveTable(); // Await the promise to handle it properly
      } catch (error) {
        console.error("Failed to save table:", error);
      }
    };
  
    const interval = setInterval(() => {
      saveTablePeriodically(); // Call the async function
    }, 10000); // 10 seconds
  
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

  const columns = useMemo<ColumnDef<object>[]>(() => {
    if (!data[0]) return []; // Ensure data[0] is defined

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
        />
      ),
    }));
  }, [data, updateData, handleCellNavigation]);

  const table = useReactTable({
    data,
    columns,
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
  return (
    <div>
      <AddColumnModal
        open={isAddColumnModalOpen}
        onOpenChange={setIsAddColumnModalOpen}
        onAddColumn={addColumn}
      />
      <div className="flex items-start overflow-auto rounded-lg">
        <div
          ref={tableContainerRef}
          className="overflow-y-auto"
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
                height: `${rowVirtualizer.getTotalSize()}px`, // Total height of all rows
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
                          className="relative border px-8"
                          data-column-id={cell.column.id}
                        >
                          {cell.column.id === "id" ? (
                            <>
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
                            </>
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
        </div>
        <Button
          onClick={() => setIsAddColumnModalOpen(true)}
          className="flex items-center gap-2 bg-[#f4f4f4] px-12"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>

      <div>
        <button
          onClick={add15kRow}
          className="absolute bottom-[5%] left-[20%] rounded-full bg-white px-4 py-2 text-black"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
