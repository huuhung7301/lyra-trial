"use client"

import React, { useState, useEffect } from 'react'
import { ChevronDown, X, HelpCircle } from 'lucide-react'
import { useViewContext } from '../view-context'
import { JsonValue } from 'type-fest'

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

interface SortFilterProps {
  onClose: () => void;
}

function isSortOptionLike(item: JsonValue): item is { field: string; direction: 'asc' | 'desc' } {
  return (
    typeof item === 'object' &&
    item !== null &&
    'field' in item &&
    'direction' in item &&
    typeof item.field === 'string' &&
    (item.direction === 'asc' || item.direction === 'desc')
  )
}

function isSortOptionArray(arr: JsonValue): arr is { field: string; direction: 'asc' | 'desc' }[] {
  return Array.isArray(arr) && arr.every(isSortOptionLike)
}

function convertToSortOption(item: { field: string; direction: 'asc' | 'desc' }): SortOption {
  return { field: item.field, direction: item.direction }
}

function convertToJsonValue(sortOptions: SortOption[]): JsonValue {
  return sortOptions.map(option => ({
    field: option.field,
    direction: option.direction
  }))
}

export default function SortFilter({ onClose }: SortFilterProps) {
  const { columns, viewData, updateViewData } = useViewContext();
  
  const [sortOptions, setSortOptions] = useState<SortOption[]>(() => {
    if (viewData?.sorting && isSortOptionArray(viewData.sorting)) {
      return viewData.sorting.map(convertToSortOption);
    }
    return [{ field: columns[0] ?? 'Name', direction: 'asc' }];
  });
  const [autoSort, setAutoSort] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const addSort = () => {
    setSortOptions([...sortOptions, { field: columns[0] ?? 'Name', direction: 'asc' }]);
  };

  const removeSort = (index: number) => {
    setSortOptions(sortOptions.filter((_, i) => i !== index));
  };

  const updateSort = (index: number, field: string | null, direction: 'asc' | 'desc' | null) => {
    setSortOptions(sortOptions.map((option, i) => {
      if (i === index) {
        return {
          ...option,
          ...(field !== null && { field }),
          ...(direction !== null && { direction }),
        };
      }
      return option;
    }));
  };

  const handleClose = () => {
    if (viewData) {
      updateViewData({
        ...viewData,
        sorting: convertToJsonValue(sortOptions),
      });
    }
    onClose(); // Trigger the passed onClose function
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-600 text-lg">Sort by</h2>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {sortOptions.map((option, index) => (
        <div key={index} className="flex items-center gap-2 mb-3">
          {/* Field Selector */}
          <div className="relative flex-1">
            <button
              onClick={() => setActiveDropdown(activeDropdown === `field-${index}` ? null : `field-${index}`)}
              className="w-full flex items-start justify-between min-w-80 px-2 py-1.5 border rounded hover:bg-gray-50"
            >
              {option.field}
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === `field-${index}` && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                {columns.map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      updateSort(index, field, null);
                      setActiveDropdown(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
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
              onClick={() => setActiveDropdown(activeDropdown === `direction-${index}` ? null : `direction-${index}`)}
              className="flex items-center justify-between px-3 py-1.5 border rounded hover:bg-gray-50 min-w-[100px]"
            >
              {option.direction === 'asc' ? 'A → Z' : 'Z → A'}
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === `direction-${index}` && (
              <div className="absolute top-full right-0 mt-1 w-[100px] bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    updateSort(index, null, 'asc');
                    setActiveDropdown(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  A → Z
                </button>
                <button
                  onClick={() => {
                    updateSort(index, null, 'desc');
                    setActiveDropdown(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
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
              className="p-1.5 hover:bg-gray-100 rounded-md"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addSort}
        className="text-gray-600 hover:text-gray-800 flex items-center gap-1 mb-4"
      >
        <span className="text-xl">+</span> Add another sort
      </button>

      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoSort}
            onChange={(e) => setAutoSort(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
        </label>
        <span className="text-sm">Automatically sort records</span>
      </div>
    </div>
  );
}
