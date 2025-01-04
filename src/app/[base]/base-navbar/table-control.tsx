"use client"

import { Grid, Settings2, EyeOff, Filter, GroupIcon as GroupObjects, ArrowUpDown, Palette, MoreHorizontal, Share2, Search, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function TableControls() {
  return (
    <div className="flex h-12 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="gap-2">
          <Menu className="h-4 w-4" />
          Views
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" className="gap-2">
          <Grid className="h-4 w-4" />
          Grid view
          <Settings2 className="h-3 w-3" />
        </Button>

        <Button variant="ghost" size="icon">
          <EyeOff className="h-4 w-4" />
        </Button>

        <Button variant="ghost" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>

        <Button variant="ghost" className="gap-2">
          <GroupObjects className="h-4 w-4" />
          Group
        </Button>

        <Button variant="ghost" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>

        <Button variant="ghost" className="gap-2">
          <Palette className="h-4 w-4" />
          Color
        </Button>

        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share and sync
        </Button>
      </div>

      <div>
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

