"use client"

import { useState } from "react";

export function NavMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // State to track hovered item

  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-4">
        <li>
          <a
            href="#"
            className={`hover:text-white hover:bg-[#854631] px-4 py-2 rounded-full ${
              hoveredIndex === 0 ? "bg-[#854631] text-white" : "text-[#ebded9]"
            }`}
          >
            Data
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`text-[#ebded9] hover:bg-[#854631] px-4 py-2 rounded-full ${
              hoveredIndex === 1 ? "bg-[#854631] text-white" : ""
            }`}
          >
            Automations
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`text-[#ebded9] hover:bg-[#854631] px-4 py-2 rounded-full ${
              hoveredIndex === 2 ? "bg-[#854631] text-white" : ""
            }`}
          >
            Interfaces
          </a>
        </li>
        <li>
          <div className="border-l border-[#bc9182]">
          <a
            href="#"
            className={`text-[#ebded9] hover:bg-[#854631] px-4 ms-2 py-2 rounded-full ${
              hoveredIndex === 3 ? "bg-[#854631] text-white" : ""
            }`}
          >
            Forms
          </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}
