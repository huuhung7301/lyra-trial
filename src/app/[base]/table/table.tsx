'use client'

import { useState, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnResizeMode,
} from '@tanstack/react-table'
import { Bell, ChevronDown, ChevronUp, Plus, User } from 'lucide-react'

type Task = {
  id: number
  name: string
  notes: string
  assignee: string
  status: string
}

const defaultData: Task[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: '',
  notes: '',
  assignee: '',
  status: '',
}))

export function DataTable() {
  const [data, setData] = useState<Task[]>(defaultData)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange')

  const updateData = (rowIndex: number, columnId: string, value: string) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const columns: ColumnDef<Task>[] = [
    {
      id: 'select-number',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <div className="relative group">
          <span className="absolute inset-0 group-hover:hidden flex items-center justify-start pl-4 text-sm text-gray-500">
            {row.index + 1}
          </span>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 opacity-0 group-hover:opacity-100"
          />
        </div>
      ),
      enableSorting: false,
      enableResizing: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Name
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        )
      },
      cell: ({ getValue, row, column }) => {
        const value = getValue() as string
        return (
          <input
            value={value}
            onChange={e => updateData(row.index, column.id, e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        )
      },
    },
    {
      accessorKey: 'notes',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Notes
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        )
      },
      cell: ({ getValue, row, column }) => {
        const value = getValue() as string
        return (
          <input
            value={value}
            onChange={e => updateData(row.index, column.id, e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        )
      },
    },
    {
      accessorKey: 'assignee',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            <User className="h-4 w-4" />
            Assignee
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        )
      },
      cell: ({ getValue, row, column }) => {
        const value = getValue() as string
        return (
          <input
            value={value}
            onChange={e => updateData(row.index, column.id, e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            <Bell className="h-4 w-4" />
            Status
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        )
      },
      cell: ({ getValue, row, column }) => {
        const value = getValue() as string
        return (
          <input
            value={value}
            onChange={e => updateData(row.index, column.id, e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        )
      },
    },
    {
      id: 'actions',
      header: () => (
        <button className="rounded-md p-1 hover:bg-gray-100">
          <Plus className="h-4 w-4" />
        </button>
      ),
      cell: () => null,
      enableResizing: false,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    columnResizeMode,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        updateData(rowIndex, columnId, value)
      },
    },
  })

  const addNewRow = useCallback(() => {
    const newId = data.length + 1
    setData(old => [...old, {
      id: newId,
      name: '',
      notes: '',
      assignee: '',
      status: '',
    }])
  }, [data.length])

  return (
    <div className="rounded-lg border">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm" style={{ width: table.getCenterTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="relative h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-gray-200 opacity-0 hover:opacity-100 ${
                            header.column.getIsResizing() ? 'opacity-100' : ''
                          }`}
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className="group border-b transition-colors hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 border-t p-4">
        <button 
          className="rounded-full p-2 hover:bg-gray-100"
          onClick={addNewRow}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button 
          className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-gray-100"
          onClick={addNewRow}
        >
          <Plus className="h-4 w-4" />
          Add...
        </button>
        <div className="ml-auto text-sm text-gray-500">
          {table.getRowModel().rows.length} records
        </div>
      </div>
    </div>
  )
}

