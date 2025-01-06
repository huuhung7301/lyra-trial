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
    setValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'Tab');
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'ShiftTab');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'Enter');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'ArrowRight'); // Move to the next column
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'ArrowLeft'); // Move to the previous column
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'ArrowDown'); // Move to the same column in the next row
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate(rowIndex, columnId, 'ArrowUp'); // Move to the same column in the previous row
    }
  };
  

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default EditableCell;

