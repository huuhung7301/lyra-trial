"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "~/components/ui/dropdown";

interface Table {
  id: string;
  name: string;
}

interface TableListProps {
  tables: Table[]; // Pass tables as a prop
  selectedTableId: string;
  setSelectedTableId: React.Dispatch<React.SetStateAction<string>>;
}

export function TableList({ tables, selectedTableId, setSelectedTableId }: TableListProps) {
  // If the tables array is empty, initialize with a default table
  const defaultTable: Table[] = tables.length === 0 ? [{ id: "1", name: "Table 1" }] : tables;
  
  return (
    <div className="flex items-center justify-between bg-[#944e37]">
      <div className="flex items-center font-normal bg-[#854631] w-[88%] rounded-t-lg pl-4">
        {/* Generate buttons dynamically */}
        {defaultTable.map((table) => (
          <div key={table.id} className="relative inline-block">
            {/* Render button only if the table is not selected */}
            {selectedTableId !== table.id ? (
              <div
                onClick={() => setSelectedTableId(table.id)}
                className="cursor-pointer bg-transparent py-2 text-[#ebded9] hover:bg-[#6f3b29]"
              >
                <a className="border-r border-[#95604f] px-4 py-0">
                  {table.name}
                </a>
              </div>
            ) : (
              // Render the dropdown when the table is selected
              <div className="rounded-t bg-white px-3 py-2">
                <Dropdown
                  id={table.id}
                  type="table"
                  onOptionSelect={(option, id) =>
                    console.log(`Selected ${option} for table ID ${id}`)
                  }
                  className="ml-2 text-gray-600" // Icon class can be passed here
                >
                  <a className="py-0 font-medium">{table.name}</a>
                </Dropdown>
              </div>
            )}
          </div>
        ))}
        <Dropdown
          id="123"
          type="table"
          onOptionSelect={(option, id) =>
            console.log(`Selected ${option} for table ID ${id}`)
          }
          className="ml-3 mr-3 text-white" // Icon class can be passed here
        ></Dropdown>
        <a className="flex items-center gap-2 font-normal text-[#ebded9] hover:text-white">
          <span className="border-l border-[#95604f] pl-4">
            <Plus className="h-5 w-5" />
          </span>
          Add or import
        </a>
      </div>

      <div className="ml-3 flex items-center gap-2 bg-[#854631] w-[12%] rounded-t-lg">
        <Button variant="ghost" className="text-[#ebded9] hover:bg-white/10">
          Extensions
        </Button>
        <Button variant="ghost" className="text-[#ebded9] hover:bg-white/10">
          Tools
        </Button>
      </div>
    </div>
  );
}
