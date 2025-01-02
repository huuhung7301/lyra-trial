"use client"

import { useEffect, useRef } from "react"
import { SearchIcon } from 'lucide-react'
import { SearchItem } from "./search-item"
import { SearchItemProps } from "./search-item"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  items: SearchItemProps[]
}

export function SearchModal({ isOpen, onClose, items }: SearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayedItems = items.slice(0, 7)

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className="fixed left-1/2 top-[72px] z-50 w-full max-w-2xl -translate-x-1/2 rounded-lg border border-gray-200 bg-white shadow-xl"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b p-4">
          <SearchIcon className="h-6 w-6 text-gray-500" />
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Recently Opened */}
        <div className="p-2">
          <h2 className="px-3 py-2 text-sm font-medium text-gray-500">Recently opened</h2>
          <div className="space-y-1">
            {displayedItems.map((item) => (
              <SearchItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 text-center">
          <div className="text-sm text-gray-400">
            Press <kbd className="rounded bg-gray-100 px-2 py-1">⌘</kbd>{" "}
            <kbd className="rounded bg-gray-100 px-2 py-1">K</kbd> any time to search
          </div>
        </div>
      </div>
    </>
  )
}

