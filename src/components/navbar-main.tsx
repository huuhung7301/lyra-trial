"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/nav/search";
import { UserNav } from "@/components/nav/user-nav";
import { Logo } from "@/components/nav/logo";

export function NavBar() {
  return (
    <header className="flex h-12 items-center gap-2 border-b px-2">
      <Button variant="ghost" size="icon" className="shrink-0">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <Logo />
      <p>Airtable</p>
      <div className="w-1/4 mx-auto">
        <Search />
      </div>
      <UserNav />
    </header>
  );
}
