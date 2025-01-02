import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Search() {
  return (
    <div className="relative mx-auto flex w-full max-w-2xl items-center rounded-full border border-solid border-indigo-600 bg-white border-gray-300	">
      {/* Search Icon */}
      <SearchIcon className="absolute left-4 h-4 w-4 text-gray-500" />

      {/* Input Field */}
      <Input className="w-full rounded-full pl-12 pr-4 text-sm px-3 py-1" placeholder="Search..."/>

      {/* Shortcut Key */}
      <kbd className="pointer-events-none absolute right-4 hidden h-5 select-none items-center gap-1 rounded bg-transparent px-1.5 font-mono text-xs font-medium sm:flex text-gray-500">
        <span>⌘</span>K
      </kbd>
    </div>
  );
}
