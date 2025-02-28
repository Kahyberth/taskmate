import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface TeamsFiltersProps {
  filterValue: string
  setFilterValue: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
}

export function TeamsFilters({ filterValue, setFilterValue, searchQuery, setSearchQuery, sortBy, setSortBy}: TeamsFiltersProps) { //cambiar tipo
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <>
            <Button
              size="icon"
              variant='ghost'
              onClick={() => setSearchQuery('')}
              className="absolute rounded-full right-2 top-1/2 
                        transform -translate-y-1/2 h-6 w-6 p-0
                        text-muted-foreground hover:text-black hover:bg-gray-200"
            >
              <X className="h-4 w-" />
            </Button>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="leader">Teams I Lead</SelectItem>
            <SelectItem value="member">Teams I'm In</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="members">Sort by Members</SelectItem>
            {/* <SelectItem value="activity">Sort by Activity</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
