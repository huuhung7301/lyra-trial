"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "./editable-cell";
import { Dropdown } from "~/components/ui/dropdown";
import { AlignLeft, Circle, User, PlusCircle, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddColumnModal } from "./add-column-modal";
import type { ColumnDef, ColumnResizeMode } from "@tanstack/react-table";
import { api } from "~/trpc/react";
type Task = Record<string, string | number>;

const defaultData: Task[] = Array.from({ length: 4 }, (_, i) => ({
  id: `i + 1`,
  name: `Task ${i + 1}`,
  notes: "Details...",
  assignee: `User ${i + 1}`,
  status: "Pending",
}));

interface DataTableProps {
  tableId: string | null;
}

export function DataTable({ tableId }: DataTableProps) {
  const [data, setData] = useState<Task[]>(defaultData);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const tableRef = useRef<HTMLTableElement>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());
  const tableIdNum = tableId ? parseInt(tableId) : null;

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
        const parsedData = tableData.tabledata as Array<Partial<Task>>;
        const formattedData: Task[] = parsedData.map((task, index) => ({
          id: (index + 1).toString(),
          name: task.name ?? `Task ${index + 1}`,
          notes: task.notes ?? "",
          assignee: task.assignee ?? "",
          status: task.status ?? "Pending",
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error formatting table data:", error);
      }
    }
  }, [tableData]);

  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: string | number) => {
      setData((prev) => {
        const newData = [...prev];
        const rowToUpdate = newData[rowIndex];
        if (rowToUpdate) {
          newData[rowIndex] = {
            ...rowToUpdate,
            [columnId]: value,
          };
        }
        return newData;
      });
    },
    [],
  );

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

  const columns = useMemo<ColumnDef<Task>[]>(() => {
    if (!data[0]) return []; // Ensure data[0] is defined

    return Object.keys(data[0]).map((key, index) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      size: index === 0 ? 50 : 200,
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

  const headerIcons: Record<string, React.ReactNode> = {
    id: null,
    name: null,
    notes: <AlignLeft className="h-4 w-4" />,
    assignee: <User className="h-4 w-4" />,
    status: <Circle className="h-4 w-4" />,
  };

  const addColumn = (name: string, type: string) => {
    setData((prevData) =>
      prevData.map((row) => ({
        ...row,
        [name.toLowerCase().replace(/\s+/g, "_")]: "",
      })),
    );
  };
  const addRow = () => {
    if (!data[0]) return;

    const newRow = Object.keys(data[0]).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: "",
        };
      },
      { id: data.length + 1 },
    ); // Add the id directly here.

    setData((prevData) => [...prevData, newRow]);
  };

  console.log("aaa", defaultData);
  return (
    <div>
      <AddColumnModal
        open={isAddColumnModalOpen}
        onOpenChange={setIsAddColumnModalOpen}
        onAddColumn={addColumn}
      />
      <div className="flex items-start overflow-auto rounded-lg">
        <table
          ref={tableRef}
          className="text table-fixed border-collapse overflow-auto"
        >
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
                        className={`absolute right-0 top-0 h-full w-[1px] cursor-col-resize touch-none select-none bg-gray-200`}
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
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isChecked = checkedRows.has(row.id); // Check if this row is checked

              return (
                <tr
                  key={row.id}
                  className={`group ${isChecked ? "hover:bg-[#f8f8f8]" : "hover:bg-[#f8f8f8]"} `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="relative border px-2"
                      data-column-id={cell.column.id}
                    >
                      {cell.column.id === "id" ? (
                        <>
                          {/* Show the ID number when not hovered */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-0">
                            {row.index + 1}
                          </div>

                          {/* Show the checkbox when hovered */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={isChecked}
                              onChange={() => {
                                setCheckedRows((prev) => {
                                  const newCheckedRows = new Set(prev);
                                  if (newCheckedRows.has(row.id)) {
                                    newCheckedRows.delete(row.id); // Uncheck if already selected
                                  } else {
                                    newCheckedRows.add(row.id); // Check if not selected
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
            <tr>
              <td
                className="group border p-2 hover:bg-[#f8f8f8]"
                colSpan={(data[0] ? Object.keys(data[0]).length : 0) + 1}
              >
                <button
                  onClick={addRow}
                  className="text-grey flex items-center gap-2 rounded-lg bg-transparent px-2 py-2 group-hover:bg-[#f1f3f5]"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <Button
          onClick={() => setIsAddColumnModalOpen(true)}
          className="flex items-center gap-2 bg-[#f4f4f4] px-12"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>

      <div>
        <button
          onClick={addRow}
          className="absolute bottom-[5%] left-[20%] rounded-full bg-white px-4 py-2 text-black"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
