import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  LabelList,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo, useState } from "react"
import { useContainerSize } from "@/hooks/use-container-size"

type ApiDay = { date: string; remaining: number; isWeekend?: boolean }
type ApiSprint = { id?: string | number; name: string; startDate: string; endDate: string; days: ApiDay[] }
type ApiPayload = { sprints: ApiSprint[] }

type Row = { date: string; remaining: number; guideline: number; isWeekend?: boolean; completedToday?: number }
type SprintShape = { name: string; startDate: string; endDate: string; data: Row[] }
type SprintsByName = Record<string, SprintShape>

function formatLabel(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d)
}

function normalize(api: ApiPayload): SprintsByName {
  const out: SprintsByName = {}
  for (const s of api.sprints) {
    const startRemaining = s.days[0]?.remaining ?? 0
    const len = s.days.length
    const slope = len > 1 ? startRemaining / (len - 1) : 0
    const rows: Row[] = s.days.map((d, i) => ({
      date: formatLabel(d.date),
      remaining: d.remaining,
      guideline: Math.max(0, Math.round(startRemaining - slope * i)),
      isWeekend: Boolean(d.isWeekend),
    }))

    for (let i = 0; i < rows.length; i++) {
      rows[i].completedToday = i === 0 ? 0 : Math.max(0, rows[i - 1].remaining - rows[i].remaining)
    }
    out[s.name] = {
      name: s.name,
      startDate: formatLabel(s.startDate),
      endDate: formatLabel(s.endDate),
      data: rows,
    }
  }
  return out
}

const defaultApi: ApiPayload = {
  sprints: [
    {
      name: "Sprint 23 (Current)",
      startDate: "2024-12-14",
      endDate: "2025-01-01",
      days: [
        { date: "2024-12-14", remaining: 40, isWeekend: false },
        { date: "2024-12-15", remaining: 38, isWeekend: false },
        { date: "2024-12-16", remaining: 36, isWeekend: true },
        { date: "2024-12-17", remaining: 36, isWeekend: true },
        { date: "2024-12-18", remaining: 34, isWeekend: false },
        { date: "2024-12-19", remaining: 32, isWeekend: false },
        { date: "2024-12-20", remaining: 30, isWeekend: false },
        { date: "2024-12-21", remaining: 28, isWeekend: false },
        { date: "2024-12-22", remaining: 26, isWeekend: false },
        { date: "2024-12-23", remaining: 24, isWeekend: true },
        { date: "2024-12-24", remaining: 24, isWeekend: true },
        { date: "2024-12-25", remaining: 20, isWeekend: false },
        { date: "2024-12-26", remaining: 18, isWeekend: false },
        { date: "2024-12-27", remaining: 16, isWeekend: false },
        { date: "2024-12-28", remaining: 16, isWeekend: false },
        { date: "2024-12-29", remaining: 16, isWeekend: false },
        { date: "2024-12-30", remaining: 8, isWeekend: true },
        { date: "2024-12-31", remaining: 8, isWeekend: true },
        { date: "2025-01-01", remaining: 5, isWeekend: false },
      ],
    },
    {
      name: "Sprint 22",
      startDate: "2024-11-30",
      endDate: "2024-12-13",
      days: [
        { date: "2024-11-30", remaining: 35, isWeekend: false },
        { date: "2024-12-01", remaining: 32, isWeekend: false },
        { date: "2024-12-02", remaining: 32, isWeekend: true },
        { date: "2024-12-03", remaining: 32, isWeekend: true },
        { date: "2024-12-04", remaining: 28, isWeekend: false },
        { date: "2024-12-05", remaining: 25, isWeekend: false },
        { date: "2024-12-06", remaining: 22, isWeekend: false },
        { date: "2024-12-07", remaining: 18, isWeekend: false },
        { date: "2024-12-08", remaining: 15, isWeekend: false },
        { date: "2024-12-09", remaining: 15, isWeekend: true },
        { date: "2024-12-10", remaining: 15, isWeekend: true },
        { date: "2024-12-11", remaining: 12, isWeekend: false },
        { date: "2024-12-12", remaining: 8, isWeekend: false },
        { date: "2024-12-13", remaining: 3, isWeekend: false },
      ],
    },
  ],
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d: Row = payload[0].payload
  return (
    <div className="bg-white p-3 border rounded shadow-lg text-sm" style={{ minWidth: 200 }}>
      <p className="font-semibold text-gray-800">{label}</p>
      <div className="mt-2 space-y-1">
        <p className="text-red-500">
          <span className="inline-block w-3 h-[2px] bg-red-500 mr-2 align-middle"></span>
          Remaining: {d.remaining} pts
        </p>
        <p className="text-gray-500">
          <span className="inline-block w-3 h-[2px] bg-gray-400 mr-2 align-middle"></span>
          Guideline: {d.guideline} pts
        </p>
        <p className="text-emerald-600 font-medium">Completed today: {d.completedToday ?? 0} pts</p>
        {d.isWeekend && <p className="text-gray-400">Non‑working day</p>}
      </div>
    </div>
  )
}

function CompletedPillLabel(props: any) {
  const { x, y, value } = props
  if (!value || value <= 0 || x == null || y == null) return null
  const text = String(value)
  const w = text.length * 7 + 12
  const h = 18
  const rx = 9
  const cx = Number(x)
  const cy = Number(y) - 12
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={rx} ry={rx} fill="#ecfdf5" stroke="#10b981" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#065f46">
        {text}
      </text>
    </g>
  )
}

function CustomDateTick(props: any) {
  const { x = 0, y = 0, payload } = props || {}
  const value = payload?.value
  if (value == null) return null
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={12} textAnchor="end" transform="rotate(-25)" fill="#667085" fontSize={12}>
        {value}
      </text>
    </g>
  )
}

export default function BurndownChart({
  apiData = defaultApi,
  initialSprintName = "Sprint 23 (Current)",
}: {
  apiData?: ApiPayload
  initialSprintName?: string
}) {
  const byName = useMemo(() => normalize(apiData), [apiData])

  const sprintNames = Object.keys(byName)
  const defaultName = sprintNames.includes(initialSprintName) ? initialSprintName : sprintNames[0]
  const [selectedSprint, setSelectedSprint] = useState(defaultName)

  const current = byName[selectedSprint]
  const chartData = current?.data ?? []

  const [containerRef, size] = useContainerSize<HTMLDivElement>()
  const allDates = chartData.map((d) => d.date)
  const maxLabels = size.width < 420 ? 5 : size.width < 640 ? 7 : size.width < 920 ? 9 : 12
  const step = Math.max(1, Math.ceil(Math.max(1, allDates.length) / maxLabels))
  const ticks = allDates.filter((_, i) => i % step === 0 || i === 0 || i === allDates.length - 1)

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white">
      {/* Sprint selector - simple/original block */}
      <div className="mb-4 flex justify-between items-start">
        <div className="bg-white p-3 rounded border shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Sprint</label>
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Choose sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprintNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {byName[name].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 text-xs text-gray-500">
            {current?.startDate} - {current?.endDate}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Legend like original (top-right) */}
        <div className="absolute top-4 right-4 bg-gray-50 p-3 rounded border text-sm z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-gray-400"></div>
              <span>Guideline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-red-500"></div>
              <span>Remaining Values</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200"></div>
              <span>Non-Working Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked className="w-3 h-3" disabled />
              <span>Show Non-Working Days</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 w-full" ref={containerRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 28, right: 200, left: 48, bottom: 56 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <Tooltip
                content={(p) => <CustomTooltip {...p} />}
                cursor={{ stroke: "#666", strokeWidth: 1, strokeDasharray: "3 3" }}
                wrapperStyle={{ zIndex: 1000 }}
              />

              {/* Weekend backgrounds (decorative, absolute overlay below) */}
              {chartData.map(
                (item, index) =>
                  item.isWeekend && (
                    <ReferenceLine
                      key={index}
                      x={item.date}
                      stroke="transparent"
                      strokeWidth={20}
                      strokeOpacity={0.1}
                    />
                  ),
              )}

              <XAxis
                dataKey="date"
                ticks={Array.isArray(ticks) && ticks.length ? ticks : undefined}
                interval={0}
                tick={<CustomDateTick />}
                tickMargin={16}
                axisLine={false}
                tickLine={false}
                minTickGap={6}
                label={{
                  value: "TIME",
                  position: "insideBottom",
                  offset: -10,
                  style: { textAnchor: "middle", fontSize: "12px", fill: "#666" },
                }}
              />
              <YAxis
                domain={[0, 45]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                label={{
                  value: "STORY POINTS",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: "12px", fill: "#666" },
                }}
              />

              {/* Guideline */}
              <Line type="linear" dataKey="guideline" stroke="#9ca3af" strokeWidth={2} dot={false} />

              {/* Remaining with numeric labels */}
              <Line
                type="stepAfter"
                dataKey="remaining"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2, fill: "#fff" }}
              >
                <LabelList dataKey="completedToday" content={<CompletedPillLabel />} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekend shading overlay (visual approximation, like original) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full">
            <div className="absolute bg-gray-100 opacity-30" style={{ left: "16%", width: "8%", height: "76%", top: "12%" }} />
            <div className="absolute bg-gray-100 opacity-30" style={{ left: "24%", width: "8%", height: "76%", top: "12%" }} />
            <div className="absolute bg-gray-100 opacity-30" style={{ left: "52%", width: "8%", height: "76%", top: "12%" }} />
            <div className="absolute bg-gray-100 opacity-30" style={{ left: "60%", width: "8%", height: "76%", top: "12%" }} />
            <div className="absolute bg-gray-100 opacity-30" style={{ left: "76%", width: "8%", height: "76%", top: "12%" }} />
            <div className="absolute bg-gray-100 opacity-30" style={{ left: "84%", width: "8%", height: "76%", top: "12%" }} />
          </div>
        </div>
      </div>
    </Card>
  )
}
