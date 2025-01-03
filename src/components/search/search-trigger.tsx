"use client";

import { useState, useEffect } from "react";
import { SearchModal } from "./search-modal";
import { Search } from "../nav/search";
import { Base } from "~/types/types";

export function SearchTrigger({ recentItems }: { recentItems: Partial<Base>[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setIsModalOpen(true); // Open the modal when the search bar is clicked
  };

  return (
    <>
      <div className="mx-auto w-1/4">
        {/* Pass the onClick handler to the Search component */}
        <Search onClick={handleSearchClick} />
      </div>

      <div className="fixed left-[28%] top-3 w-full">
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          items={recentItems}
        />
      </div>
    </>
  );
}