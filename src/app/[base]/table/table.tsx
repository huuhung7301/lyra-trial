"use client";

import { useState, useCallback, useRef, useMemo } from "react";
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

type Task = {
  [key: string]: string | number;
};

const defaultData: Task[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `Task ${i + 1}`,
  notes: "Details...",
  assignee: `User ${i + 1}`,
  status: "Pending",
}));

export function DataTable() {
  const [data, setData] = useState<Task[]>(defaultData);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const tableRef = useRef<HTMLTableElement>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

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
      // ... (keep the existing navigation logic)
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
    if (!data[0]) return [];

    const newRow = Object.keys(data[0]).reduce((acc, key) => {
      acc[key as keyof Task] = ""; // Set empty string for each column
      return acc;
    }, {} as Task); // Initialize as an empty Task object

    newRow.id = data.length + 1; // Increment the id for the new row

    setData((prevData) => [...prevData, newRow]);
  };

  return (
    <div>
      <Button onClick={() => setIsAddColumnModalOpen(true)} className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Column
      </Button>
      <AddColumnModal
        open={isAddColumnModalOpen}
        onOpenChange={setIsAddColumnModalOpen}
        onAddColumn={addColumn}
      />
      <div className="overflow-auto rounded-lg">
        <table ref={tableRef} className="table-fixed border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
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
                            id={parseInt(header.id)}
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="truncate border p-2"
                    data-column-id={cell.column.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={addRow}
          className="absolute bottom-[5%] left-[20%] rounded-full bg-white px-4 py-2 text-black"
        >
          <PlusIcon/>
        </button>
      </div>
    </div>
  );
}
