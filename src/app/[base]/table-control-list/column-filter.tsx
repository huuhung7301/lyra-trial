"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Hash, MoreVertical } from "lucide-react";
import { useViewContext } from "../view-context";

interface Field {
  name: string;
  visible: boolean;
}

export default function ColumnFilter() {
  const { columns, viewData, updateViewData } = useViewContext();

  // Ensure that viewData and hiddenFields exist and are correctly typed
  const hiddenFields = Array.isArray(viewData?.hiddenFields)
    ? (viewData?.hiddenFields as string[]) // Type assertion
    : []; // Default to an empty array if hiddenFields is not an array

  const [searchQuery, setSearchQuery] = useState("");
  const [fieldStates, setFieldStates] = useState<Field[]>(() =>
    columns.map((field) => ({
      name: field,
      visible: !hiddenFields.includes(field), // Fields not in hiddenFields should be visible
    }))
  );

  const filteredFields = useMemo(
    () =>
      fieldStates.filter((field) =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [fieldStates, searchQuery]
  );

  const toggleField = (index: number) => {
    setFieldStates((prev) =>
      prev.map((field, i) =>
        i === index ? { ...field, visible: !field.visible } : field
      )
    );
  };

  const toggleAll = (visible: boolean) => {
    setFieldStates((prev) =>
      prev.map((field) => ({ ...field, visible }))
    );
  };

  const updateHiddenFields = async () => {
    const updatedHiddenFields = fieldStates
      .filter((field) => !field.visible)
      .map((field) => field.name);

    // Only update viewData if it's fully valid, otherwise set default values
    if (viewData) {
      const updatedViewData = {
        ...viewData,
        hiddenFields: updatedHiddenFields,
      };

      // Make sure required fields are set
      await updateViewData({
        id: viewData.id ?? 0, // Use default values if any required fields are missing
        name: viewData.name ?? "Unnamed View",
        createdat: viewData.createdat ?? new Date(),
        updatedat: viewData.updatedat ?? new Date(),
        filters: viewData.filters ?? {},
        sorting: viewData.sorting ?? {},
        hiddenFields: updatedHiddenFields,
        tableid: viewData.tableid ?? 0,
      });
    }
  };
  useEffect(() => {
    void (async () => {
      await updateHiddenFields(); // Now the promise is awaited
    })();
  }, [fieldStates]);

  return (
    <div className="w-[300px] bg-white rounded-lg shadow-lg border">
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Find a field"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 h-8 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {filteredFields.map((field, index) => (
          <div
            key={field.name}
            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.visible}
                  onChange={() => toggleField(index)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span className="text-sm">{field.name}</span>
              </div>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 border-t grid grid-cols-2 gap-2">
        <button
          onClick={() => toggleAll(false)}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Hide all
        </button>
        <button
          onClick={() => toggleAll(true)}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Show all
        </button>
      </div>
    </div>
  );
}
