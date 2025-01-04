"use client"

import React from "react"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = "horizontal", className }) => {
  return (
    <div
      className={`${
        orientation === "vertical" ? "border-l" : "border-t"
      } border-gray-300 ${className}`}
      style={{
        // Customize the separator thickness and other styles if necessary
        height: orientation === "vertical" ? "auto" : "1px",
        width: orientation === "vertical" ? "1px" : "auto",
      }}
    />
  )
}
