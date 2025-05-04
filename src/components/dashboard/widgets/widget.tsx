import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskChart } from "@/components/dashboard/widgets/task-chart";
import { ProjectProgressChart } from "./project-progress-chart";
import { TimeAllocationChart } from "./time-allocation-chart";
import { UpcomingTasksChart } from "./upcoming-tasks-chart";
import { WidgetMenu } from "@/components/dashboard/widgets/widget-menu";

interface WidgetProps {
  size: string;
  isLoading: boolean;
  onChangeSize: (size: string) => void;
  onRemove: () => void;
  widgetType: string;  
  label: string;
}

export function Widget({
  size,
  isLoading,
  onChangeSize,
  onRemove,
  widgetType,
  label,
}: WidgetProps) {

  const renderChart = () => {
    switch (widgetType) {
      case "taskCompletion":
        return <TaskChart />;
      case "projectProgress":
        return <ProjectProgressChart />;
      case "teamPerformance":
        return <TaskChart />;
      case "timeAllocation":
        return <TimeAllocationChart size={size} />;
      case "upcomingTasks":
        return <UpcomingTasksChart />;

     
    }
  };


  return (
    <Card className={`${size} bg-white border-black/10 dark:bg-white/5 dark:border-white/10`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <WidgetMenu onChangeSize={onChangeSize} onRemove={onRemove} />
      </CardHeader>
      <CardContent className="w-full min-h-[250px]">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full dark:bg-white/10 bg-black/5" />
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
}
