import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const LoadingSkeleton = () => (
  <Card className="relative overflow-hidden">
    <CardHeader>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-1/3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-9 w-24" />
    </CardFooter>
  </Card>
)