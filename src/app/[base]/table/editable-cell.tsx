import React, { useEffect, useState, useRef, KeyboardEvent } from "react";

interface EditableCellProps {
  getValue: () => unknown;
  rowIndex: number;
  columnId: string;
  setValue: (newValue: string) => void;
  onNavigate: (rowIndex: number, columnId: string, key: 'Tab' | 'ShiftTab' | 'Enter' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  rowIndex,
  columnId,
  setValue,
  onNavigate,
}) => {
  const initialValue = getValue() as string;
  const [value, setLocalValue] = useState<string>(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

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
      onNavigate(rowIndex, columnId, e.key as any);
    };

    if (["Tab", "ShiftTab", "Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      setValue(value); // Update the value in the parent component

      // Wait for `setValue` to complete before triggering navigation
      setTimeout(triggerNavigation, 0);
    }
  };
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur} // Trigger setValue when input loses focus
      onKeyDown={handleKeyDown}
      className="w-full bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default EditableCell;

