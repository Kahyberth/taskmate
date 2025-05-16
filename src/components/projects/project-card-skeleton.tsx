import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCardSkeleton = () => (
  <Card className="h-full overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="pb-2">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardContent>
    <CardFooter className="pt-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-36" />
      </div>
    </CardFooter>
  </Card>
); 