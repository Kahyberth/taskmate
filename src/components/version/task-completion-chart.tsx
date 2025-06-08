import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell } from "recharts"
import { useTheme } from "@/context/ThemeContext"

const generateData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day) => {
    const completedBase = Math.floor(Math.random() * 30) + 20
    const inProgressBase = Math.floor(Math.random() * 15) + 10

    return {
      name: day,
      Completed: completedBase,
      "In Progress": inProgressBase,
    }
  })
}

const projectProgressData = [
  { name: "UI Design", progress: 85 },
  { name: "Backend API", progress: 65 },
  { name: "Documentation", progress: 45 },
  { name: "Testing", progress: 25 },
  { name: "Deployment", progress: 10 },
];

export function TaskCompletionChart() {
  const { theme } = useTheme()
  const [data, setData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [hoveredData, setHoveredData] = useState<any>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    setMounted(true)
    setData(generateData())

    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#170f3e]/90 backdrop-blur-md p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-white/80">{entry.name}:</span>
              <span className="text-white font-medium">{entry.value}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 text-xs text-violet-300">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            AI Optimized Prediction
          </div>
        </div>
      )
    }
    return null
  }

  const ProjectProgressTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#170f3e]/90 backdrop-blur-md p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-1">{payload[0].payload.name}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].fill }} />
            <span className="text-white/80">Progress:</span>
            <span className="text-white font-medium">{payload[0].value}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  const parentTabId = document.querySelector('[role="tabpanel"][data-state="active"]')?.id;
  const isProjectTab = parentTabId?.includes('projects');

  if (isProjectTab) {
    return (
      <div className="w-full h-[350px] relative rounded-2xl overflow-hidden p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={projectProgressData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 
              horizontal={false} 
            />
            <XAxis 
              type="number" 
              tick={{ fill: theme === "dark" ? "rgba(255,255,255,0.7)" : "#4b5563", fontSize: 12 }}
              axisLine={{ stroke: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: theme === "dark" ? "rgba(255,255,255,0.7)" : "#4b5563", fontSize: 12 }}
              axisLine={{ stroke: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
              tickLine={false}
              width={100} 
            />
            <RechartsTooltip content={<ProjectProgressTooltip />} />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]} animationDuration={1500}>
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

  return (
    <div className={`w-full h-[350px] relative rounded-2xl overflow-hidden p-2`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          onMouseMove={(data) => {
            if (data.activePayload) {
              setHoveredData(data.activePayload[0].payload)
            }
          }}
          onMouseLeave={() => setHoveredData(null)}
        >
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: theme === "dark" ? "rgba(255,255,255,0.7)" : "#4b5563", fontSize: 12 }}
            axisLine={{ stroke: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: theme === "dark" ? "rgba(255,255,255,0.7)" : "#4b5563", fontSize: 12 }}
            axisLine={{ stroke: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
            tickLine={false}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className={theme === "dark" ? "text-white/80" : "text-gray-700"}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="Completed"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorCompleted)"
            strokeWidth={2}
            animationDuration={1500}
            isAnimationActive={!animationComplete}
          />
          <Area
            type="monotone"
            dataKey="In Progress"
            stroke="#d946ef"
            fillOpacity={1}
            fill="url(#colorInProgress)"
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={300}
            isAnimationActive={!animationComplete}
          />
        </AreaChart>
      </ResponsiveContainer>

      {hoveredData && (
        <div className="absolute top-4 right-4 bg-[#170f3e]/80 backdrop-blur-md p-3 border border-white/10 rounded-lg shadow-lg">
          <div className="text-white/80 text-sm">
            Total:{" "}
            <span className="text-white font-medium">
              {hoveredData.Completed + hoveredData["In Progress"]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

