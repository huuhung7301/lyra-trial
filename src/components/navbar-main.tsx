"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/nav/search";
import { UserNav } from "@/components/nav/user-nav";
import { SearchTrigger } from "./search/search-trigger";
export function NavBar() {
  return (
    <div className="flex items-center gap-2 border-b px-2 py-1">
      <Button variant="ghost" size="icon" className="shrink-0">
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
      <SearchTrigger />
      <UserNav />
    </div>
  );
}
