import { Home, Users, BookOpen, ShoppingBag, Globe, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface IconSidebarProps {
  isVisible: boolean;
}

export function IconSidebar({ isVisible }: IconSidebarProps) {
  if (!isVisible) return null;

  return (
    <div className=" flex h-[calc(100vh-48px)] w-16 flex-col justify-between bg-white border-e">
      {/* Top Group of Icons */}
      <div className="flex flex-col items-center pb-3 pt-4 space-y-2">
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <Home className="h-6 w-6 text-gray-800" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 border-b">
          <Users className="h-6 w-6 text-gray-800" />
        </Button>
      </div>

      {/* Bottom Group of Icons */}
      <div className="flex flex-col items-center py-2 space-y-2">
        <Button variant="ghost" size="icon" className="h-12 w-12 border-t">
          <BookOpen className="h-4 w-4 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <ShoppingBag className="h-4 w-4 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <Globe className="h-4 w-4 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <Plus className="h-7 w-7 text-gray-500 border rounded-sm p-1" />
        </Button>
      </div>
    </div>
  )
}

