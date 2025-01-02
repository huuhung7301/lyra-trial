"use client";

import { useState, useEffect } from "react"
import { SearchModal } from "./search-modal"
import { Search } from "../nav/search";

// Sample data - in a real app, this would come from your backend
const recentItems = [
  {
    id: "1",
    title: "Lyra Base",
    type: "Base",
    workspace: "My First Workspace",
    lastOpened: "4 hours ago",
    icon: "Ly"
  },
  {
    id: "2",
    title: "Lyra base",
    type: "Base",
    workspace: "My First Workspace",
    lastOpened: "6 hours ago",
    icon: "Ly"
  },
  {
    id: "3",
    title: "Marketing Campaign",
    type: "Base",
    workspace: "Work Projects",
    lastOpened: "1 day ago",
    icon: "Mc"
  },
  {
    id: "4",
    title: "Product Roadmap",
    type: "Base",
    workspace: "Product Team",
    lastOpened: "2 days ago",
    icon: "Pr"
  }
]

export function SearchTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        e.preventDefault()
        setIsModalOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearchClick = () => {
    setIsModalOpen(true); // Open the modal when the search bar is clicked
  };

  return (
    <>
      <div className="mx-auto w-1/4">
        {/* Pass the onClick handler to the Search component */}
        <Search onClick={handleSearchClick} />
      </div>

      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        items={recentItems}
      />
    </>
  )
}

