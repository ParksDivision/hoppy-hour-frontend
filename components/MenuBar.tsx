'use client'

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  SlidersHorizontal,
  Clock,
  Star,
  DollarSign,
  Timer,
  Navigation,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function MenuBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const QuickFilterButton = ({
    label,
    icon: Icon,
    filter
  }: {
    label: string
    icon: React.ElementType
    filter: string
  }) => (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2 border-[#9DC7AC] text-[#2A5A45] hover:bg-[#E8F3E8] hover:text-[#1B365D]",
        activeFilters.includes(filter) &&
        "bg-[#9DC7AC] text-[#1B365D] hover:bg-[#9DC7AC] hover:text-[#1B365D]"
      )}
      onClick={() => toggleFilter(filter)}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )

  return (
    <div className="sticky top-24 md:top-28 z-40 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 space-y-4">
        {/* Search Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#527C6B]" />
            <Input
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 border-[#9DC7AC] focus:ring-[#527C6B] placeholder:text-[#9DC7AC]"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[#9DC7AC] text-[#527C6B] hover:bg-[#E8F3E8]"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white border-l border-[#9DC7AC]"
            >
              <SheetHeader>
                <SheetTitle className="text-[#1B365D]">Filters</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <FilterOptions />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick Filters */}
        <div className="flex justify-center items-center gap-4 pb-1">
          <QuickFilterButton
            label="Ending Soon"
            icon={Timer}
            filter="ending-soon"
          />
          <QuickFilterButton
            label="Nearest"
            icon={Navigation}
            filter="nearest"
          />
          <QuickFilterButton
            label="Top Rated"
            icon={TrendingUp}
            filter="top-rated"
          />
        </div>
      </div>
    </div>
  )
}

const FilterOptions = () => {
  const selectClasses = "border-[#9DC7AC] text-[#2A5A45] hover:bg-[#E8F3E8]"

  return (
    <>
      <Select>
        <SelectTrigger className={selectClasses}>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <SelectValue placeholder="Open Now" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open Now</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className={selectClasses}>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <SelectValue placeholder="Rating" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4plus">4+ Stars</SelectItem>
          <SelectItem value="3plus">3+ Stars</SelectItem>
          <SelectItem value="all">All Ratings</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className={selectClasses}>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <SelectValue placeholder="Price Range" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">$ Low</SelectItem>
          <SelectItem value="medium">$$ Medium</SelectItem>
          <SelectItem value="high">$$$ High</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}