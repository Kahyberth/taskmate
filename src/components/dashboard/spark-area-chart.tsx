import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface SparkAreaChartProps {
  data: number[]
  trend: "up" | "down"
}

export function SparkAreaChart({ data, trend }: SparkAreaChartProps) {
  const chartData = data.map((value) => ({ value }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={trend === "up" ? "#22c55e" : "#ef4444"}
          fill={`url(#color${trend === "up" ? "Up" : "Down"})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

