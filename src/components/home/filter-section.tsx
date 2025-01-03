import { ChevronDown, LayoutGrid, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function FilterSection() {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex gap-4">
        <Button variant="ghost" className="text-gray-600">
          Opened by you
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="ghost" className="text-gray-600">
          Show all types
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

