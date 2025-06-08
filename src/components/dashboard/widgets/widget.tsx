import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskChart } from "@/components/dashboard/widgets/task-chart";
import { ProjectProgressChart } from "./project-progress-chart";
import { UpcomingTasksChart } from "./upcoming-tasks-chart";
import { WidgetMenu } from "@/components/dashboard/widgets/widget-menu";

interface WidgetProps {
  size: string;
  isLoading: boolean;
  onChangeSize: (size: string) => void;
  onRemove: () => void;
  widgetType: string;  
  label: string;
  selectedProjectId: string | null;
}

export function Widget({
  size,
  isLoading,
  onChangeSize,
  onRemove,
  widgetType,
  label,
  selectedProjectId,
}: WidgetProps) {

  const renderChart = () => {
    switch (widgetType) {
      case "taskCompletion":
        return <TaskChart selectedProjectId={selectedProjectId} />;
      case "projectProgress":
        return <ProjectProgressChart selectedProjectId={selectedProjectId} />;
      case "teamPerformance":
        return <TaskChart selectedProjectId={selectedProjectId} />;
      case "upcomingTasks":
        return <UpcomingTasksChart selectedProjectId={selectedProjectId} />;
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
