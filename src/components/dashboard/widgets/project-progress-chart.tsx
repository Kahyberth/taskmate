import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { projectProgressData } from "@/data/dashboard-data";

export function ProjectProgressChart() {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={projectProgressData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
          <XAxis type="number" stroke="var(--chart-text)" />
          <YAxis dataKey="name" type="category" stroke="var(--chart-text)" width={100} />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "var(--chart-tooltip-bg)",
              borderColor: "var(--chart-tooltip-border)",
              color: "var(--chart-tooltip-text)",
            }}
            labelStyle={{ color: "var(--chart-tooltip-text)" }}
            formatter={(value) => [`${value}%`, "Progress"]}
          />
          <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
            {projectProgressData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.progress > 75
                    ? "#10b981"
                    : entry.progress > 50
                      ? "#8b5cf6"
                      : entry.progress > 25
                        ? "#f59e0b"
                        : "#ef4444"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
