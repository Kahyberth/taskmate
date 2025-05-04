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
import { taskCompletionData } from "@/data/dashboard-data";

export function TaskChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={taskCompletionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
