"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Trash2, MoreHorizontal, X } from "lucide-react";
import { useViewContext } from "../view-context";
import { JsonValue } from "type-fest";

interface Condition {
  field: string;
  operator: string;
  value: string;
}

const operators = [
  "contains",
  "does not contain",
  "is",
  "is not",
  "starts with",
  "ends with",
  "is empty",
  "is not empty",
] as const;

function isJsonCondition(
  item: JsonValue,
): item is { field: string; operator: string; value: string } {
  return (
    typeof item === "object" &&
    item !== null &&
    "field" in item &&
    "operator" in item &&
    "value" in item &&
    typeof item.field === "string" &&
    typeof item.operator === "string" &&
    typeof item.value === "string"
  );
}

function isJsonConditionArray(
  arr: JsonValue,
): arr is { field: string; operator: string; value: string }[] {
  return Array.isArray(arr) && arr.every(isJsonCondition);
}

function convertToCondition(item: {
  field: string;
  operator: string;
  value: string;
}): Condition {
  return {
    field: item.field,
    operator: item.operator,
    value: item.value,
  };
}

function convertToJsonValue(conditions: Condition[]): JsonValue {
  return conditions.map((condition) => ({
    field: condition.field,
    operator: condition.operator,
    value: condition.value,
  }));
}

export default function QueryBuilder({ onClose }: { onClose: () => void }) {
  const { columns, viewData, updateViewData } = useViewContext();

  const defaultField = columns[0] ?? "Name";

  const [conditions, setConditions] = useState<Condition[]>(() => {
    if (viewData?.filters && isJsonConditionArray(viewData.filters)) {
      return viewData.filters.map(convertToCondition);
    }
    return [{ field: defaultField, operator: "contains", value: "" }];
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleConditionChange = (
    index: number,
    key: keyof Condition,
    value: string,
  ) => {
    const newConditions = conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, [key]: value };
      }
      return condition;
    });
    setConditions(newConditions);
  };

  const addCondition = () => {
    const newCondition: Condition = {
      field: defaultField,
      operator: "contains",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };
  const handleClose = () => {
    if (viewData) {
      updateViewData({
        ...viewData,
        filters: convertToJsonValue(conditions),
      });
    }
    onClose(); // Call the onClose prop to indicate component is closing
  };
  return (
    <div className="w-full rounded-lg border bg-white shadow-lg">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mb-4 text-gray-600">In this view, show records</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {conditions.map((condition, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            {index === 0 && <span className="text-gray-600">Where</span>}

            {/* Field Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === `field-${index}`
                      ? null
                      : `field-${index}`,
                  )
                }
                className="flex min-w-[100px] items-center justify-between gap-1 rounded border px-3 py-1.5 hover:bg-gray-50"
              >
                {condition.field}
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === `field-${index}` && (
                <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border bg-white shadow-lg">
                  {columns.map((field) => (
                    <button
                      key={field}
                      onClick={() => {
                        handleConditionChange(index, "field", field);
                        setActiveDropdown(null);
                      }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      {field}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Operator Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === `operator-${index}`
                      ? null
                      : `operator-${index}`,
                  )
                }
                className="flex min-w-[120px] items-center justify-between gap-1 rounded border px-3 py-1.5 hover:bg-gray-50"
              >
                {condition.operator}
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === `operator-${index}` && (
                <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border bg-white shadow-lg">
                  {operators.map((op) => (
                    <button
                      key={op}
                      onClick={() => {
                        handleConditionChange(index, "operator", op);
                        setActiveDropdown(null);
                      }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      {op}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Value Input */}
            <input
              type="text"
              value={condition.value}
              onChange={(e) =>
                handleConditionChange(index, "value", e.target.value)
              }
              placeholder="Enter a value"
              className="flex-1 rounded border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Action Buttons */}
            <button
              onClick={() => removeCondition(index)}
              className="rounded-md p-1.5 hover:bg-gray-100"
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </button>
            <button className="rounded-md p-1.5 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={addCondition}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          >
            <span className="text-xl">+</span> Add condition
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            Copy from another view
          </button>
        </div>
      </div>
    </div>
  );
}
