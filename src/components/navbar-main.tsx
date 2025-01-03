// src/components/navbar-main.tsx

"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/nav/user-nav";
import { SearchTrigger } from "./search/search-trigger";
import { SidebarNav } from "./sidebar-nav/sidebar-nav";
import { Base } from "~/types/types";

export function NavBar({
  recentItems,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  recentItems: Partial<Base>[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="z-50 flex items-center gap-2 border-b px-2 py-1">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Use the passed setter function
      >
        <Menu className="h-6 w-6 text-gray-500" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div>
        <img
          src="/images/airtable-logo2.png" // Path to the image in the public folder
          alt="Airtable Logo"
          className="h-16 cursor-pointer" // Adjust the height as needed
        />
      </div>
      <SearchTrigger recentItems={recentItems} />
      <UserNav />
    </div>
  );
}
