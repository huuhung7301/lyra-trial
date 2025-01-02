import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchProps {
  onClick?: () => void;
}

export function Search({ onClick }: SearchProps) {
  return (
    <div
      className="relative mx-auto flex w-full max-w-2xl items-center rounded-full border border-solid bg-white border-gray-300 cursor-pointer"
      onClick={onClick} // Trigger the passed onClick prop
    >
      {/* Search Icon */}
      <SearchIcon className="absolute left-3 h-5 w-5 text-gray-500" />

      {/* Input Field */}
      <Input className="w-full rounded-full pl-12 pr-4 py-2 cursor-pointer" placeholder="Search..." />

      {/* Shortcut Key */}
      <kbd className="pointer-events-none absolute right-4 hidden h-5 select-none items-center gap-1 rounded bg-transparent px-1.5 font-mono font-medium sm:flex text-gray-500">
        <span>⌘</span>K
      </kbd>
    </div>
  );
}
