import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const generateData = () => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  return days.map((day, index) => {
    const completedBase = Math.floor(Math.random() * 30) + 20
    const inProgressBase = Math.floor(Math.random() * 15) + 10
    const pendingBase = Math.floor(Math.random() * 10) + 5

    return {
      name: day,
      Completadas: completedBase,
      "En progreso": inProgressBase,
      Pendientes: pendingBase,
    }
  })
}

export function TaskCompletionChart() {
  const [data, setData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [hoveredData, setHoveredData] = useState<any>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    setMounted(true)
    setData(generateData())

    // Simulate animation completion after 1.5s
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
            Predicción optimizada por IA
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[350px] relative">
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
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => <span className="text-white/80">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="Completadas"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorCompleted)"
            strokeWidth={2}
            animationDuration={1500}
            isAnimationActive={!animationComplete}
          />
          <Area
            type="monotone"
            dataKey="En progreso"
            stroke="#d946ef"
            fillOpacity={1}
            fill="url(#colorInProgress)"
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={300}
            isAnimationActive={!animationComplete}
          />
          <Area
            type="monotone"
            dataKey="Pendientes"
            stroke="#0ea5e9"
            fillOpacity={1}
            fill="url(#colorPending)"
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={600}
            isAnimationActive={!animationComplete}
          />
        </AreaChart>
      </ResponsiveContainer>

      {hoveredData && (
        <div className="absolute top-4 right-4 bg-[#170f3e]/80 backdrop-blur-md p-3 border border-white/10 rounded-lg shadow-lg">
          <div className="text-white/80 text-sm">
            Total:{" "}
            <span className="text-white font-medium">
              {hoveredData.Completadas + hoveredData["En progreso"] + hoveredData.Pendientes}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

