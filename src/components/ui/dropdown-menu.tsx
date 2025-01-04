"use client"

import React, { useState } from "react"

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative inline-block text-left">
      {children}
    </div>
  )
}

export const DropdownMenuTrigger = ({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) => {
  return <div>{children}</div> // Use the trigger as a child element
}

export const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">{children}</div>
    </div>
  )
}

export const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
    >
      {children}
    </button>
  )
}
