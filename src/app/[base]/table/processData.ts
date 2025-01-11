import { JsonValue } from "type-fest";

export interface ViewContextData {
  viewData: {
    id: number;
    name: string;
    createdat: Date;
    updatedat: Date;
    filters: JsonValue;
    sorting: JsonValue;
    hiddenFields: JsonValue;
    tableid: number;
  } | null;
  columns: string[]; // List of column names (keys)
  isLoading: boolean;
  isError: boolean;
  updateViewData: (updatedViewData: ViewContextData["viewData"]) => void;
}

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

interface SortCriterion {
  field: string;
  direction: "asc" | "desc";
}

export function processData(
    data: object[],
    viewData: ViewContextData["viewData"],
  ): object[] {
    if (!viewData) return data; // Return unprocessed data if viewData is null
  
    const { filters, sorting, hiddenFields } = viewData;
  
    const filteredData = data
      .filter((row) => {
        // Apply filters if filters is an array of conditions
        if (Array.isArray(filters)) {
          return filters.every((condition) => {
            if (isFilterCondition(condition)) {
              const { field, operator, value } = condition;
              const rowValue = (row as Record<string, unknown>)[field];
  
              switch (operator) {
                case "contains":
                  return String(rowValue)
                    .toLowerCase()
                    .includes(String(value).toLowerCase());
                case "does not contain":
                  return !String(rowValue)
                    .toLowerCase()
                    .includes(String(value).toLowerCase());
                case "is":
                  return rowValue === value;
                case "is not":
                  return rowValue !== value;
                case "starts with":
                  return String(rowValue)
                    .toLowerCase()
                    .startsWith(String(value).toLowerCase());
                case "ends with":
                  return String(rowValue)
                    .toLowerCase()
                    .endsWith(String(value).toLowerCase());
                case "is empty":
                  return (
                    rowValue === "" || rowValue === null || rowValue === undefined
                  );
                case "is not empty":
                  return (
                    rowValue !== "" && rowValue !== null && rowValue !== undefined
                  );
                default:
                  return true;
              }
            }
            return true;
          });
        }
        return true; // No filters applied if filters is not an array
      })
      .sort((a, b) => {
        // Apply sorting
        if (Array.isArray(sorting)) {
          for (const sort of sorting) {
            if (isSortCriterion(sort)) {
              const aValue = (a as Record<string, string>)[sort.field];
              const bValue = (b as Record<string, string>)[sort.field];
              if (aValue && bValue) {
                if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
              }
            }
          }
        }
        return 0; // No sorting applied
      })
      .map((row) => {
        // Remove hidden fields
        if (Array.isArray(hiddenFields)) {
          const filteredRow: Record<string, unknown> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (!hiddenFields.includes(key)) {
              filteredRow[key] = value;
            }
          });
          return filteredRow;
        }
        return row;
      });
  
    return filteredData;
  }
  

function isFilterCondition(condition: unknown): condition is FilterCondition {
  return (
    typeof condition === "object" &&
    condition !== null &&
    "field" in condition &&
    "operator" in condition &&
    "value" in condition &&
    typeof (condition as FilterCondition).field === "string" &&
    typeof (condition as FilterCondition).operator === "string" &&
    typeof (condition as FilterCondition).value === "string"
  );
}

function isSortCriterion(criterion: unknown): criterion is SortCriterion {
  return (
    typeof criterion === "object" &&
    criterion !== null &&
    "field" in criterion &&
    "direction" in criterion &&
    typeof (criterion as SortCriterion).field === "string" &&
    ((criterion as SortCriterion).direction === "asc" ||
      (criterion as SortCriterion).direction === "desc")
  );
}
