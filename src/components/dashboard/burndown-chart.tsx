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
import { useMemo, useState, useContext, useEffect } from "react"
import { useContainerSize } from "@/hooks/use-container-size"
import { useSprintsByProject, useSprintBurndownData } from "@/api/queries"
import { AuthContext } from "@/context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type ApiDay = { 
  date: string; 
  remaining: number; 
  isWeekend?: boolean;
  completedToday?: number;
  completedIssues?: any[];
}
type ApiSprint = { id?: string | number; name: string; startDate: string; endDate: string; days: ApiDay[] }
type ApiPayload = { sprints: ApiSprint[] }

type Row = { 
  date: string; 
  remaining: number; 
  guideline: number; 
  isWeekend?: boolean; 
  completedToday?: number;
  completedIssues?: any[];
}
type SprintShape = { name: string; startDate: string; endDate: string; data: Row[] }
type SprintsByName = Record<string, SprintShape>

function formatLabel(iso: string) {
  console.log(`Formatting date: ${iso}`);
  const d = new Date(iso)
  const formatted = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d)
  console.log(`Formatted result: ${formatted}`);
  return formatted
}

function normalize(api: ApiPayload): SprintsByName {
  console.log("Normalizing API data:", api);
  const out: SprintsByName = {}
  for (const s of api.sprints) {
    console.log(`Processing sprint: ${s.name}`);
    console.log(`Days count: ${s.days.length}`);
    console.log(`Date range: ${s.startDate} to ${s.endDate}`);
    
    const startRemaining = s.days[0]?.remaining ?? 0
    const len = s.days.length
    
    const workingDays = s.days.filter(d => !d.isWeekend).length
    const slope = workingDays > 0 ? startRemaining / workingDays : 0
    
    console.log(`Start remaining: ${startRemaining}, Working days: ${workingDays}, Slope: ${slope}`);
    
    const rows: Row[] = s.days.map((d, i) => {
      const workingDaysSoFar = s.days.slice(0, i + 1).filter(day => !day.isWeekend).length
      const guideline = Math.max(0, Math.round(startRemaining - (slope * workingDaysSoFar)))
      
      return {
        date: formatLabel(d.date),
        remaining: d.remaining,
        guideline,
        isWeekend: Boolean(d.isWeekend),
        completedToday: d.completedToday || 0,
        completedIssues: d.completedIssues || []
      }
    })

    for (let i = 0; i < rows.length; i++) {
      if (i === 0) {
        rows[i].completedToday = 0
      } else {
        const previousRemaining = rows[i - 1].remaining
        const currentRemaining = rows[i].remaining
        rows[i].completedToday = Math.max(0, previousRemaining - currentRemaining)
      }
    }
    
    console.log(`Normalized rows:`, rows.map(r => ({ date: r.date, remaining: r.remaining, guideline: r.guideline, isWeekend: r.isWeekend })));
    
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
  ],
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d: Row = payload[0].payload
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg text-sm" style={{ minWidth: 250 }}>
      <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
      <div className="mt-2 space-y-1">
        <p className="text-purple-600 dark:text-purple-400">
          <span className="inline-block w-3 h-[2px] bg-purple-600 dark:bg-purple-400 mr-2 align-middle"></span>
          Remaining: {d.remaining} pts
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          <span className="inline-block w-3 h-[2px] bg-gray-400 dark:bg-gray-500 mr-2 align-middle"></span>
          Guideline: {d.guideline} pts
        </p>
        <p className="text-green-600 dark:text-green-400 font-medium">Completed today: {d.completedToday ?? 0} pts</p>
        {d.isWeekend && <p className="text-gray-400 dark:text-gray-500">Non‑working day</p>}
        
        {/* Mostrar issues completadas hoy si las hay */}
        {d.completedIssues && d.completedIssues.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Completed today:</p>
            {d.completedIssues.map((issue: any, index: number) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                • {issue.title} ({issue.story_points || 0} pts)
              </div>
            ))}
          </div>
        )}
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
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={rx} ry={rx} fill="#dcfce7" stroke="#16a34a" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#15803d">
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
      <text dy={12} textAnchor="end" transform="rotate(-25)" fill="#6b7280" fontSize={12}>
        {value}
      </text>
    </g>
  )
}

interface BurndownChartProps {
  selectedProjectId?: string | null;
}

export default function BurndownChart({ selectedProjectId }: BurndownChartProps) {
  const { user } = useContext(AuthContext);
  
  const [includeCompletedSprints, setIncludeCompletedSprints] = useState(true);
  
  const { data: sprints = [], isLoading: isLoadingSprints } = useSprintsByProject(selectedProjectId || undefined, includeCompletedSprints);
  
  console.log("=== BURNDOWN CHART DEBUG ===");
  console.log("selectedProjectId:", selectedProjectId);
  console.log("includeCompletedSprints:", includeCompletedSprints);
  console.log("sprints data:", sprints);
  console.log("isLoadingSprints:", isLoadingSprints);
  
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const { data: burndownData, isLoading: isLoadingBurndown } = useSprintBurndownData(selectedSprintId || undefined);
  
  console.log("selectedSprintId:", selectedSprintId);
  console.log("burndownData:", burndownData);
  console.log("isLoadingBurndown:", isLoadingBurndown);
  
  useMemo(() => {
    console.log("useMemo triggered - sprints:", sprints.length, "selectedSprintId:", selectedSprintId);
    
    if (sprints.length > 0) {
      const activeSprint = sprints.find((sprint: any) => sprint.status === 'active');
      const completedSprint = sprints.find((sprint: any) => sprint.status === 'completed');
      const inactiveSprint = sprints.find((sprint: any) => sprint.status === 'inactive');
      
      console.log("Found sprints:", {
        active: activeSprint?.id,
        completed: completedSprint?.id,
        inactive: inactiveSprint?.id,
        first: sprints[0]?.id
      });
      
      const newSelectedSprintId = activeSprint?.id || completedSprint?.id || inactiveSprint?.id || sprints[0]?.id || null;
      
      if (newSelectedSprintId !== selectedSprintId) {
        console.log(`Updating selected sprint from ${selectedSprintId} to ${newSelectedSprintId}`);
        console.log(`Available sprints:`, sprints.map((s: any) => ({ id: s.id, name: s.name, status: s.status })));
        setSelectedSprintId(newSelectedSprintId);
      }
    } else {
      if (selectedSprintId !== null) {
        console.log("No sprints available, setting selectedSprintId to null");
        setSelectedSprintId(null);
      }
    }
  }, [sprints, selectedSprintId]);

  useEffect(() => {
    if (selectedSprintId) {
      console.log(`Selected sprint changed to: ${selectedSprintId}`);
    }
  }, [selectedSprintId]);

  const apiData: ApiPayload = useMemo(() => {
    if (!burndownData) {
      console.log("No burndown data available, using default");
      return defaultApi;
    }

    console.log("Burndown data received:", burndownData);
    console.log("Days count:", burndownData.days?.length || 0);
    console.log("Date range:", burndownData.startDate, "to", burndownData.endDate);

    return {
      sprints: [{
        name: burndownData.name,
        startDate: burndownData.startDate,
        endDate: burndownData.endDate,
        days: burndownData.days
      }]
    };
  }, [burndownData]);

  const byName = useMemo(() => normalize(apiData), [apiData])
  const sprintNames = Object.keys(byName)
  const defaultName = sprintNames[0] || ""
  const [selectedSprint, setSelectedSprint] = useState(defaultName)
  
  useEffect(() => {
    if (defaultName && defaultName !== selectedSprint) {
      console.log(`Updating selectedSprint from ${selectedSprint} to ${defaultName}`);
      setSelectedSprint(defaultName);
    }
  }, [defaultName, selectedSprint]);

  const current = byName[selectedSprint]
  const chartData = current?.data ?? []
  
  console.log("Chart data processing:");
  console.log("byName:", byName);
  console.log("sprintNames:", sprintNames);
  console.log("defaultName:", defaultName);
  console.log("selectedSprint:", selectedSprint);
  console.log("current:", current);
  console.log("chartData length:", chartData.length);

  const [containerRef, size] = useContainerSize<HTMLDivElement>()
  const allDates = chartData.map((d) => d.date)
  const maxLabels = size.width < 420 ? 5 : size.width < 640 ? 7 : size.width < 920 ? 9 : 12
  const step = Math.max(1, Math.ceil(Math.max(1, allDates.length) / maxLabels))
  const ticks = allDates.filter((_, i) => i % step === 0 || i === 0 || i === allDates.length - 1)
  
  console.log("Chart data analysis:");
  console.log("Chart data length:", chartData.length);
  console.log("All dates:", allDates);
  console.log("Max labels:", maxLabels);
  console.log("Step:", step);
  console.log("Ticks:", ticks);

  console.log("Render conditions - isLoadingSprints:", isLoadingSprints, "isLoadingBurndown:", isLoadingBurndown);
  
  if (isLoadingSprints || isLoadingBurndown) {
    console.log("Showing loading state");
    return (
      <Card className="w-full p-6 bg-white dark:bg-gray-900 border-0 shadow-sm">
        <div className="mb-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-56" />
        </div>
        <Skeleton className="h-96 w-full" />
      </Card>
    );
  }

  console.log("Checking sprints length:", sprints.length);
  if (sprints.length === 0) {
    console.log("Showing no sprints available state");
    return (
      <Card className="w-full p-6 bg-white dark:bg-gray-900 border-0 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sprint Burndown Chart</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track your sprint progress and velocity</p>
        </div>
        <div className="flex items-center justify-center h-96 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <span className="text-gray-400 text-2xl">📊</span>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">No sprints available</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProjectId 
                  ? includeCompletedSprints 
                    ? "This project doesn't have any sprints yet. Create a sprint to see the burndown chart."
                    : "This project doesn't have any active sprints. Try enabling 'Show completed sprints' to view historical data."
                  : "Select a project to view sprint burndown charts."
                }
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6 bg-white dark:bg-gray-900 border-0 shadow-sm">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sprint Burndown Chart</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your sprint progress and velocity</p>
          </div>
          <div className="mt-4 md:mt-0 space-y-3">
            <Select 
              value={selectedSprintId || ""} 
              onValueChange={(value) => {
                setSelectedSprintId(value);
                const sprint = sprints.find((s: any) => s.id === value);
                if (sprint) {
                  setSelectedSprint(sprint.name);
                }
              }}
            >
              <SelectTrigger className="w-56 bg-white dark:bg-gray-800">
                <SelectValue placeholder="Choose sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint: any) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name} {sprint.status === 'active' ? "(Active)" : sprint.status === 'completed' ? "(Completed)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="include-completed"
                checked={includeCompletedSprints}
                onCheckedChange={(checked) => {
                  setIncludeCompletedSprints(checked);
                  setSelectedSprintId(null);
                }}
              />
              <Label htmlFor="include-completed" className="text-sm text-gray-600 dark:text-gray-400">
                Show completed sprints
              </Label>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {current?.startDate} - {current?.endDate}
            </div>
          </div>
        </div>
      </div>

      {/* Debug information */}
      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h4>
        <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <div>Project ID: {selectedProjectId || 'None'}</div>
          <div>Sprints count: {sprints.length}</div>
          <div>Selected Sprint ID: {selectedSprintId || 'None'}</div>
          <div>Burndown data: {burndownData ? 'Available' : 'None'}</div>
          <div>Chart data length: {chartData.length}</div>
          <div>Loading states: Sprints={isLoadingSprints ? 'Yes' : 'No'}, Burndown={isLoadingBurndown ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div className="relative">
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-gray-400 dark:bg-gray-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Guideline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-purple-600 dark:bg-purple-400"></div>
              <span className="text-gray-700 dark:text-gray-300">Remaining Values</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Non-Working Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked className="w-3 h-3" disabled />
              <span className="text-gray-700 dark:text-gray-300">Show Non-Working Days</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 w-full" ref={containerRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 28, right: 200, left: 48, bottom: 56 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <Tooltip
                content={(p) => <CustomTooltip {...p} />}
                cursor={{ stroke: "#6b7280", strokeWidth: 1, strokeDasharray: "3 3" }}
                wrapperStyle={{ zIndex: 1000 }}
              />

              {/* Weekend backgrounds */}
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
                  style: { textAnchor: "middle", fontSize: "12px", fill: "#6b7280" },
                }}
              />
              <YAxis
                domain={[0, 'dataMax + 5']}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                label={{
                  value: "STORY POINTS",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: "12px", fill: "#6b7280" },
                }}
              />

              {/* Guideline */}
              <Line type="linear" dataKey="guideline" stroke="#9ca3af" strokeWidth={2} dot={false} />

              {/* Remaining with numeric labels */}
              <Line
                type="stepAfter"
                dataKey="remaining"
                stroke="#9333ea"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 6, stroke: "#9333ea", strokeWidth: 2, fill: "#fff" }}
              >
                <LabelList dataKey="completedToday" content={<CompletedPillLabel />} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekend shading overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full">
            {chartData.map((item, index) => 
              item.isWeekend && (
                <div
                  key={index}
                  className="absolute bg-gray-100 dark:bg-gray-700 opacity-30"
                  style={{ 
                    left: `${(index / chartData.length) * 100}%`, 
                    width: `${100 / chartData.length}%`, 
                    height: "76%", 
                    top: "12%" 
                  }} 
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Resumen de historias completadas */}
      {burndownData && burndownData.completedIssues && burndownData.completedIssues.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Sprint Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {burndownData.totalStoryPoints}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Story Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {burndownData.completedStoryPoints}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {burndownData.completedIssuesCount}/{burndownData.totalIssues}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Issues Completed</div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Completed User Stories
            </h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {burndownData.completedIssues.map((issue: any) => (
                <div key={issue.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {issue.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {issue.status}
                    </span>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {issue.storyPoints} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
