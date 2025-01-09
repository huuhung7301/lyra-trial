import React, { useEffect, useState, useRef, KeyboardEvent } from "react";

interface EditableCellProps {
  getValue: () => unknown;
  rowIndex: number;
  columnId: string;
  setValue: (newValue: string) => void;
  onNavigate: (rowIndex: number, columnId: string, key: 'Tab' | 'ShiftTab' | 'Enter' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
  searchQuery: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  rowIndex,
  columnId,
  setValue,
  onNavigate,
  searchQuery,
}) => {
  const initialValue = getValue() as string;
  const [value, setLocalValue] = useState<string>(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHighlighted = searchQuery != "" && value && typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase());

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };
  const handleBlur = () => {
    setValue(value); // Update the value when input loses focus
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const triggerNavigation = () => {
      onNavigate(
        rowIndex,
        columnId,
        e.key as
          | "Tab"
          | "ShiftTab"
          | "Enter"
          | "ArrowUp"
          | "ArrowDown"
          | "ArrowLeft"
          | "ArrowRight"
      );
    };

    if (["Tab", "ShiftTab", "Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      setValue(value); // Update the value in the parent component

      // Wait for `setValue` to complete before triggering navigation
      setTimeout(triggerNavigation, 0);
    }
  };
  const inputClassName = isHighlighted ? "bg-yellow-200" : "bg-transparent";
  return (
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{ width: "100%" }}
        className={`w-full ${inputClassName} focus:outline-none focus:ring-2 focus:ring-blue-500 p-2`} 
      />
  );
};

export default EditableCell;

