"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
} from "@tanstack/react-table";
import EditableCell from "./editable-cell";

type Task = {
  id: number;
  name: string;
  notes: string;
  assignee: string;
  status: string;
};

type EditableKeys = Exclude<keyof Task, 'id'>;

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
console.log("aaa", data)
  const updateData = (rowIndex: number, columnId: EditableKeys, value: string) => {
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
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 100,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 200,
      cell: ({ getValue, row }) => (
        <EditableCell
          getValue={getValue}
          rowIndex={row.index}
          columnId="name"
          setValue={(value) => updateData(row.index, "name", value)}
        />
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      size: 300,
      cell: ({ getValue, row }) => (
        <EditableCell
          getValue={getValue}
          rowIndex={row.index}
          columnId="notes"
          setValue={(value) => updateData(row.index, "notes", value)}
        />
      ),
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      size: 200,
      cell: ({ getValue, row }) => (
        <EditableCell
          getValue={getValue}
          rowIndex={row.index}
          columnId="assignee"
          setValue={(value) => updateData(row.index, "assignee", value)}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      cell: ({ getValue, row }) => (
        <EditableCell
          getValue={getValue}
          rowIndex={row.index}
          columnId="status"
          setValue={(value) => updateData(row.index, "status", value)}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode,
  });

  return (
    <div className="overflow-auto rounded-lg">
      <table className="table-fixed border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="relative p-2"
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
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
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="truncate border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

