"use client";

import React, { useEffect, useRef } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
  searchQuery,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="bordershadow-md flex w-full max-w-sm items-center justify-center">
      <div className="w-full max-w-sm bg-gray-100 shadow-sm border-gray-200 border-2">
        {/* Input and Button Container */}
        <div className="relative mb-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Find in view"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="h-12 w-full rounded-none border border-gray-300 px-3 text-sm placeholder:text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform text-base font-normal text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        {/* Help Text Container */}
        <div className="p-1 px-3 flex-start">
          <p className="text-sm text-gray-600">
            Use advanced search options in the{" "}
          </p>
          <span className="cursor-pointer text-blue-600 text-sm">
            search extension .
          </span>
        </div>
      </div>
    </div>
  );
}
