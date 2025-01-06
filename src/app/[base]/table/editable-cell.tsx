import React, { useEffect, useState, useRef } from "react";

interface EditableCellProps {
  getValue: () => unknown;
  rowIndex: number;
  columnId: string;
  setValue: (newValue: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  rowIndex,
  columnId,
  setValue,
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

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className="w-full bg-transparent p-1"
    />
  );
};

export default EditableCell;

