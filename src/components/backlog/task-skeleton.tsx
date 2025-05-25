import { Skeleton } from "@/components/ui/skeleton"

export function TaskSkeleton() {
  return (
    <div className="mb-2 p-2 border rounded-lg bg-white/50 dark:bg-gray-800/50 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1">
        <Skeleton className="h-5 w-5" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
} 