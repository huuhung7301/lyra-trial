"use client"

import { ChevronDown, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Table {
  id: number
  name: string
}

export function TableList() {
  const tables: Table[] = [
    { id: 1, name: "Table 1" }
  ]

  return (
    <div className="flex h-12 items-center justify-between  bg-[#854631] px-4">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 text-white hover:bg-white/10">
              {tables[0]?.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {tables.map((table) => (
              <DropdownMenuItem key={table.id}>
                {table.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
          <Plus className="h-4 w-4" />
          Add or import
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-white hover:bg-white/10">
          Extensions
        </Button>
        <Button variant="ghost" className="text-white hover:bg-white/10">
          Tools
        </Button>
      </div>
    </div>
  )
}

