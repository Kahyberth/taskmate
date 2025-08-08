import {
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Area,
} from "recharts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useProjectIssues, useTaskCompletionStats } from "@/api/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskChartProps {
  selectedProjectId: string | null;
}

export function TaskChart({ selectedProjectId }: TaskChartProps) {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { data: allTaskCompletionData, isLoading: isLoadingAllTasks } = useTaskCompletionStats(user?.id);

  const { data: projectIssues, isLoading: isLoadingProjectIssues } = useProjectIssues(
    selectedProjectId || undefined
  );
  
  const isLoading = selectedProjectId ? isLoadingProjectIssues : isLoadingAllTasks;

  useEffect(() => {
    if (selectedProjectId && projectIssues) { 
      const processedData = calculateTaskStatsByDay(projectIssues);
      setChartData(processedData);
    } else if (!selectedProjectId && allTaskCompletionData) {
      setChartData(allTaskCompletionData);
    } else {
      // Si no hay datos, establecemos un array vacío para evitar el estado de carga infinito
      setChartData([]);
    }
  }, [selectedProjectId, projectIssues, allTaskCompletionData]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  // Show "No data available" when there's no real data
  if (!chartData || chartData.length === 0 || chartData.every(day => day.total === 0)) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">
            {selectedProjectId 
              ? "This project has no task completion data" 
              : "No task completion data found"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--chart-grid)" />
          <XAxis dataKey="name" stroke="var(--chart-text)" />
          <YAxis stroke="var(--chart-text)" />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "var(--chart-tooltip-bg)",
              borderColor: "var(--chart-tooltip-border)",
              color: "var(--chart-tooltip-text)",
            }}
            labelStyle={{ color: "var(--chart-tooltip-text)" }}
            formatter={(value) => [`${value} tasks`, undefined]}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorCompleted)"
            name="Completed"
          />
          <Area
            type="monotone"
            dataKey="pending"
            stroke="#ec4899"
            fillOpacity={1}
            fill="url(#colorPending)"
            name="Pending"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const calculateTaskStatsByDay = (issues: any[]) => {

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const lastSevenDays = Array.from({length: 7}, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return {
      date: startDate,
      endDate: endDate,
      name: dayNames[date.getDay()]
    };
  });
  
  const statsByDay = lastSevenDays.map(day => {
    const completedThatDay = issues.filter(issue => {
      if (issue.updatedAt && (issue.status === 'done' || issue.status === 'closed')) {
        const updatedDate = new Date(issue.updatedAt);
        return updatedDate >= day.date && updatedDate <= day.endDate;
      }
      return false;
    }).length;
    
    const pendingThatDay = issues.filter(issue => {
      const createdDate = new Date(issue.createdAt);
      if (createdDate <= day.endDate) {
        if (issue.status === 'done' || issue.status === 'closed') {
          const updatedDate = new Date(issue.updatedAt || new Date());
          return updatedDate > day.endDate;
        }
        return true;
      }
      return false;
    }).length;
    
    return {
      name: day.name,
      completed: completedThatDay,
      pending: pendingThatDay,
      total: completedThatDay + pendingThatDay
    };
  });
  
  return statsByDay;
};
