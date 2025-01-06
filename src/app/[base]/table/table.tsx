"use client";

import { useState, useCallback, useRef, useMemo } from "react";
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
  const tableRef = useRef<HTMLTableElement>(null);

  const updateData = useCallback((rowIndex: number, columnId: EditableKeys, value: string) => {
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
  }, []);

  const handleCellNavigation = useCallback(
    (
      rowIndex: number,
      columnId: string,
      key: 'Tab' | 'ShiftTab' | 'Enter' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
    ) => {
      const editableColumns: string[] = ['name', 'notes', 'assignee', 'status'];
  
      const currentColumnIndex = editableColumns.indexOf(columnId);
  
      let nextRowIndex = rowIndex;
      let nextColumnIndex = currentColumnIndex;
  
      if (key === 'Tab') {
        // Move to the next column within the same row
        if (currentColumnIndex < editableColumns.length - 1) {
          nextColumnIndex = currentColumnIndex + 1;
        }
      } else if (key === 'ShiftTab') {
        // Move to the previous column within the same row
        if (currentColumnIndex > 0) {
          nextColumnIndex = currentColumnIndex - 1;
        }
      } else if (key === 'Enter') {
        // Move to the same column in the next row
        nextRowIndex = (rowIndex + 1) % data.length;
      } else if (key === 'ArrowUp') {
        // Move to the same column in the previous row
        nextRowIndex = rowIndex > 0 ? rowIndex - 1 : data.length - 1;
      } else if (key === 'ArrowDown') {
        // Move to the same column in the next row
        nextRowIndex = (rowIndex + 1) % data.length;
      } else if (key === 'ArrowLeft') {
        // Move to the previous column within the same row
        if (currentColumnIndex > 0) {
          nextColumnIndex = currentColumnIndex - 1;
        }
      } else if (key === 'ArrowRight') {
        // Move to the next column within the same row
        if (currentColumnIndex < editableColumns.length - 1) {
          nextColumnIndex = currentColumnIndex + 1;
        }
      }
  
      // Find the next column ID
      const nextColumnId = editableColumns[nextColumnIndex];
  
      // Find the next cell and focus it
      const nextCell = tableRef.current?.querySelector(
        `tr:nth-child(${nextRowIndex + 1}) td[data-column-id="${nextColumnId}"] input`
      ) as HTMLInputElement | null;
  
      nextCell?.focus();
    },
    [data.length]
  );
  
  

  const columns = useMemo<ColumnDef<Task, keyof Task>[]>(() => [
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
          onNavigate={handleCellNavigation}
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
          onNavigate={handleCellNavigation}
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
          onNavigate={handleCellNavigation}
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
          onNavigate={handleCellNavigation}
        />
      ),
    },
  ], [updateData, handleCellNavigation]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode,
  });

  return (
    <div className="overflow-auto rounded-lg">
      <table ref={tableRef} className="table-fixed border-collapse text-sm">
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
                <td key={cell.id} className="truncate border p-2" data-column-id={cell.column.id}>
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

