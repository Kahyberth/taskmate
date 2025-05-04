import {
  PieChart,
  Pie,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { timeAllocationData } from "@/data/dashboard-data";

export function TimeAllocationChart({size}: { size: string }) {

  const aspect = size === "large" ? 1 : size === "medium" ? 0.3: 2;
 
  return (
    <div className="h-[250px] flex flex-col items-center ">
      <ResponsiveContainer width="100%" height="100%" aspect={aspect}>
        <PieChart>
          <Pie
            data={timeAllocationData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            isAnimationActive={false}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {timeAllocationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "var(--chart-tooltip-bg)",
              borderColor: "var(--chart-tooltip-border)",
              color: "var(--chart-tooltip-text)",
            }}
            formatter={(value) => [`${value}%`, undefined]}
            labelStyle={{ color: "var(--chart-tooltip-text)" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs">
        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
          AI Optimized
        </Badge>
      </div>
    </div>
  );
}
