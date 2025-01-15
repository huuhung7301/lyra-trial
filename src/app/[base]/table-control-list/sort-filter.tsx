"use client";

import React, { useState } from "react";
import { ChevronDown, X, HelpCircle } from "lucide-react";
import { useViewContext } from "../view-context";
import { JsonValue } from "type-fest";

interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

interface SortFilterProps {
  onClose: () => void;
}

function isSortOptionLike(
  item: JsonValue,
): item is { field: string; direction: "asc" | "desc" } {
  return (
    typeof item === "object" &&
    item !== null &&
    "field" in item &&
    "direction" in item &&
    typeof item.field === "string" &&
    (item.direction === "asc" || item.direction === "desc")
  );
}

function isSortOptionArray(
  arr: JsonValue,
): arr is { field: string; direction: "asc" | "desc" }[] {
  return Array.isArray(arr) && arr.every(isSortOptionLike);
}

function convertToSortOption(item: {
  field: string;
  direction: "asc" | "desc";
}): SortOption {
  return { field: item.field, direction: item.direction };
}

function convertToJsonValue(sortOptions: SortOption[]): JsonValue {
  return sortOptions.map((option) => ({
    field: option.field,
    direction: option.direction,
  }));
}

export default function SortFilter({ onClose }: SortFilterProps) {
  const { columns, viewData, updateViewData } = useViewContext();

  const [sortOptions, setSortOptions] = useState<SortOption[]>(() => {
    if (viewData?.sorting && isSortOptionArray(viewData.sorting)) {
      return viewData.sorting.map(convertToSortOption);
    }
    return [{ field: columns[0] ?? "Name", direction: "asc" }];
  });
  const [autoSort, setAutoSort] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const addSort = () => {
    setSortOptions([
      ...sortOptions,
      { field: columns[0] ?? "Name", direction: "asc" },
    ]);
  };

  const removeSort = (index: number) => {
    setSortOptions(sortOptions.filter((_, i) => i !== index));
  };

  const updateSort = (
    index: number,
    field: string | null,
    direction: "asc" | "desc" | null,
  ) => {
    setSortOptions(
      sortOptions.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            ...(field !== null && { field }),
            ...(direction !== null && { direction }),
          };
        }
        return option;
      }),
    );
  };

  const handleClose = async () => {
    if (viewData) {
      await updateViewData({
        ...viewData,
        sorting: convertToJsonValue(sortOptions),
      });
    }
    onClose(); // Trigger the passed onClose function
  };

  return (
    <div className="w-full rounded-lg border bg-white p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg text-gray-600">Sort by</h2>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {sortOptions.map((option, index) => (
        <div key={index} className="mb-3 flex items-center gap-2">
          {/* Field Selector */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === `field-${index}` ? null : `field-${index}`,
                )
              }
              className="flex w-full min-w-80 items-start justify-between rounded border px-2 py-1.5 hover:bg-gray-50"
            >
              {option.field}
              <ChevronDown className="h-4 w-4" />
            </button>
            {activeDropdown === `field-${index}` && (
              <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                {columns.map((field) => (
                  <button
                    key={field}
                    onClick={async () => {
                      updateSort(index, field, null); // Update local state
                      setActiveDropdown(null);
                      if (viewData) {
                        await updateViewData({
                          ...viewData,
                          sorting: convertToJsonValue(
                            sortOptions.map((option, i) =>
                              i === index ? { ...option, field } : option,
                            ),
                          ),
                        });
                      }
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {field}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direction Selector */}
          <div className="relative">
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === `direction-${index}`
                    ? null
                    : `direction-${index}`,
                )
              }
              className="flex min-w-[100px] items-center justify-between rounded border px-3 py-1.5 hover:bg-gray-50"
            >
              {option.direction === "asc" ? "A → Z" : "Z → A"}
              <ChevronDown className="h-4 w-4" />
            </button>
            {activeDropdown === `direction-${index}` && (
              <div className="absolute right-0 top-full z-10 mt-1 w-[100px] rounded-md border bg-white shadow-lg">
                <button
                  onClick={async () => {
                    // Update local state
                    updateSort(index, null, "asc");
                    setActiveDropdown(null);

                    // Update viewData with the new sorting direction
                    if (viewData) {
                      await updateViewData({
                        ...viewData,
                        sorting: convertToJsonValue(
                          sortOptions.map((option, i) =>
                            i === index
                              ? { ...option, direction: "asc" }
                              : option,
                          ),
                        ),
                      });
                    }
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  A → Z
                </button>
                <button
                  onClick={async () => {
                    // Update local state
                    updateSort(index, null, "desc");
                    setActiveDropdown(null);

                    // Update viewData with the new sorting direction
                    if (viewData) {
                      await updateViewData({
                        ...viewData,
                        sorting: convertToJsonValue(
                          sortOptions.map((option, i) =>
                            i === index
                              ? { ...option, direction: "desc" }
                              : option,
                          ),
                        ),
                      });
                    }
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  Z → A
                </button>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {sortOptions.length > 1 && (
            <button
              onClick={() => removeSort(index)}
              className="rounded-md p-1.5 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addSort}
        className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-800"
      >
        <span className="text-xl">+</span> Add another sort
      </button>

      <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={autoSort}
            onChange={(e) => setAutoSort(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full"></div>
        </label>
        <span className="text-sm">Automatically sort records</span>
      </div>
    </div>
  );
}
