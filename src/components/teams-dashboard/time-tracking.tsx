import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  DownloadIcon,
  FilterIcon,
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  BarChart3Icon,
  SearchIcon,
  XIcon,
  CheckIcon,
  FileTextIcon,
  AlertCircleIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

// Tipos para los datos
type TeamMember = {
  id: number
  name: string
  avatar: string
  initials: string
}

type Project = {
  id: number
  name: string
}

type TimeEntry = {
  id: number
  member: TeamMember
  project: string
  projectId: number
  date: string
  hours: number
  task: string
  createdAt: string
}

// Datos de ejemplo
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SC",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MR",
  },
  {
    id: 3,
    name: "Emily Taylor",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "ET",
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "DK",
  },
  {
    id: 5,
    name: "Jessica Patel",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JP",
  },
]

const projects: Project[] = [
  { id: 1, name: "Dashboard Redesign" },
  { id: 2, name: "API Integration" },
  { id: 3, name: "Mobile App" },
  { id: 4, name: "User Authentication System" },
  { id: 5, name: "Analytics Dashboard" },
]

const initialTimeEntries: TimeEntry[] = [
  {
    id: 1,
    member: teamMembers[0],
    project: "Dashboard Redesign",
    projectId: 1,
    date: "2025-03-15",
    hours: 6.5,
    task: "Frontend Implementation",
    createdAt: "2025-03-15T10:30:00",
  },
  {
    id: 2,
    member: teamMembers[1],
    project: "API Integration",
    projectId: 2,
    date: "2025-03-15",
    hours: 8,
    task: "Backend Development",
    createdAt: "2025-03-15T11:45:00",
  },
  {
    id: 3,
    member: teamMembers[2],
    project: "Dashboard Redesign",
    projectId: 1,
    date: "2025-03-14",
    hours: 5,
    task: "UI Design",
    createdAt: "2025-03-14T09:15:00",
  },
  {
    id: 4,
    member: teamMembers[3],
    project: "Mobile App",
    projectId: 3,
    date: "2025-03-14",
    hours: 7.5,
    task: "DevOps Setup",
    createdAt: "2025-03-14T14:20:00",
  },
  {
    id: 5,
    member: teamMembers[4],
    project: "Mobile App",
    projectId: 3,
    date: "2025-03-13",
    hours: 4,
    task: "Product Planning",
    createdAt: "2025-03-13T16:10:00",
  },
]

export default function TimeTracking() {
  // Estados para manejar los datos y filtros
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>(initialTimeEntries)
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [isAddingTime, setIsAddingTime] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)

  // Estados para el formulario de registro de tiempo
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [hoursWorked, setHoursWorked] = useState<string>("")
  const [workDate, setWorkDate] = useState<Date | undefined>(new Date())
  const [taskDescription, setTaskDescription] = useState<string>("")
  const [formErrors, setFormErrors] = useState<{
    project?: string
    hours?: string
    date?: string
    task?: string
  }>({})

  // Estados para filtros de reporte
  const [reportStartDate, setReportStartDate] = useState<Date | undefined>(new Date())
  const [reportEndDate, setReportEndDate] = useState<Date | undefined>(new Date())
  const [reportProject, setReportProject] = useState<string>("all")
  const [reportMember, setReportMember] = useState<string>("all")

  // Calcular datos para el gráfico circular
  const calculateProjectData = () => {
    const projectHours: Record<string, number> = {}

    filteredEntries.forEach((entry) => {
      if (projectHours[entry.project]) {
        projectHours[entry.project] += entry.hours
      } else {
        projectHours[entry.project] = entry.hours
      }
    })

    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--primary) / 0.7)",
      "hsl(var(--primary) / 0.4)",
      "hsl(var(--primary) / 0.6)",
      "hsl(var(--primary) / 0.3)",
    ]

    return Object.keys(projectHours).map((project, index) => ({
      name: project,
      value: projectHours[project],
      color: colors[index % colors.length],
    }))
  }

  // Calcular horas totales
  const calculateTotalHours = () => {
    return filteredEntries.reduce((total, entry) => total + entry.hours, 0)
  }

  // Calcular promedio de horas por día
  const calculateAvgHoursPerDay = () => {
    const days = new Set(filteredEntries.map((entry) => entry.date)).size
    return days > 0 ? (calculateTotalHours() / days).toFixed(1) : "0"
  }

  // Validar el formulario
  const validateForm = () => {
    const errors: {
      project?: string
      hours?: string
      date?: string
      task?: string
    } = {}

    if (!selectedProject) {
      errors.project = "Please select a project"
    }

    if (!hoursWorked) {
      errors.hours = "Please enter hours worked"
    } else if (isNaN(Number.parseFloat(hoursWorked)) || Number.parseFloat(hoursWorked) <= 0) {
      errors.hours = "Hours must be a positive number"
    }

    if (!workDate) {
      errors.date = "Please select a date"
    }

    if (!taskDescription.trim()) {
      errors.task = "Please describe the task"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Manejar el envío del formulario
  const handleSubmitTimeEntry = () => {
    if (!validateForm()) return

    const projectObj = projects.find((p) => p.id.toString() === selectedProject)
    if (!projectObj) return

    const newEntry: TimeEntry = {
      id: timeEntries.length + 1,
      member: teamMembers[0], // Asumimos que el usuario actual es el primer miembro
      project: projectObj.name,
      projectId: projectObj.id,
      date: workDate ? format(workDate, "yyyy-MM-dd") : "",
      hours: Number.parseFloat(hoursWorked),
      task: taskDescription,
      createdAt: new Date().toISOString(),
    }

    const updatedEntries = [newEntry, ...timeEntries]
    setTimeEntries(updatedEntries)
    setFilteredEntries(updatedEntries)

    // Resetear el formulario
    setSelectedProject("")
    setHoursWorked("")
    setWorkDate(new Date())
    setTaskDescription("")
    setIsAddingTime(false)

    // Mostrar notificación
    toast({
      title: "Time entry added",
      description: `${newEntry.hours} hours logged for ${newEntry.project}`,
    })
  }

  // Generar y descargar el informe
  const generateReport = () => {
    // Filtrar entradas según los criterios del informe
    let reportEntries = [...timeEntries]

    if (reportStartDate && reportEndDate) {
      const start = new Date(reportStartDate)
      start.setHours(0, 0, 0, 0)

      const end = new Date(reportEndDate)
      end.setHours(23, 59, 59, 999)

      reportEntries = reportEntries.filter((entry) => {
        const entryDate = new Date(entry.date)
        return entryDate >= start && entryDate <= end
      })
    }

    if (reportProject !== "all") {
      reportEntries = reportEntries.filter((entry) => entry.projectId.toString() === reportProject)
    }

    if (reportMember !== "all") {
      reportEntries = reportEntries.filter((entry) => entry.member.id.toString() === reportMember)
    }

    // Crear el contenido CSV
    const headers = ["Date", "Member", "Project", "Hours", "Task"]
    const rows = reportEntries.map((entry) => [
      entry.date,
      entry.member.name,
      entry.project,
      entry.hours.toString(),
      entry.task,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `time-report-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setShowReportDialog(false)

    // Mostrar notificación
    toast({
      title: "Report downloaded",
      description: `Report with ${reportEntries.length} entries has been downloaded`,
    })
  }

  // Aplicar filtros según el período seleccionado
  const applyPeriodFilter = (period: string) => {
    setSelectedPeriod(period)

    const now = new Date()
    let filteredData = [...timeEntries]

    if (period === "day") {
      const today = format(now, "yyyy-MM-dd")
      filteredData = timeEntries.filter((entry) => entry.date === today)
    } else if (period === "week") {
      const oneWeekAgo = new Date(now)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      filteredData = timeEntries.filter((entry) => new Date(entry.date) >= oneWeekAgo)
    } else if (period === "month") {
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      filteredData = timeEntries.filter((entry) => new Date(entry.date) >= oneMonthAgo)
    }

    setFilteredEntries(filteredData)
  }

  return (
    <Card className="relative overflow-hidden bg-card border border-border/40 rounded-xl min-h-[80vh] w-full max-w-none flex flex-col overscroll-contain">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-primary" />
              Time Tracking
            </CardTitle>
            <CardDescription>Monitor team hours and project allocation</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="week" value={selectedPeriod} onValueChange={(value) => applyPeriodFilter(value)}>
              <SelectTrigger className="w-[150px] bg-background/50 border-border/50 focus:bg-background">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Download Time Report</AlertDialogTitle>
                  <AlertDialogDescription>Select the filters to apply to your time report.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-start-date">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reportStartDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reportStartDate ? format(reportStartDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reportStartDate}
                            onSelect={setReportStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-end-date">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reportEndDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reportEndDate ? format(reportEndDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={reportEndDate} onSelect={setReportEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-project">Project</Label>
                      <Select value={reportProject} onValueChange={setReportProject}>
                        <SelectTrigger id="report-project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Projects</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-member">Team Member</Label>
                      <Select value={reportMember} onValueChange={setReportMember}>
                        <SelectTrigger id="report-member">
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={generateReport}>
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Download Report
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center">
                  <BarChart3Icon className="h-4 w-4 mr-2 text-primary" />
                  Recent Time Entries
                </CardTitle>
                <div className="relative w-[200px]">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search entries..."
                    className="pl-8 w-full bg-background/50 border-border/50 focus:bg-background h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Member</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead className="hidden md:table-cell">Task</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-primary/5">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={entry.member.avatar} />
                                <AvatarFallback className="bg-primary/10 text-xs">
                                  {entry.member.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{entry.member.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5 font-normal">
                              {entry.project}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(entry.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-1.5">
                                <span className="text-xs font-medium">{entry.hours}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">hrs</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{entry.task}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No time entries found for the selected period.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEntries.length > 0 ? (
                <>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <Pie
                          data={calculateProjectData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        >
                          {calculateProjectData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value) => [`${value} hours`, "Time Spent"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      {calculateProjectData().map((entry, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-xs">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center flex-col">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <AlertCircleIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    No data available for the selected period.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-20">
  {[
    {
      icon: <ClockIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />,
      value: calculateTotalHours().toFixed(1),
      label: `Total Hours This ${selectedPeriod === "day" ? "Day" : selectedPeriod === "week" ? "Week" : "Month"}`,
    },
    {
      icon: <BarChart3Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />,
      value: calculateAvgHoursPerDay(),
      label: "Avg. Hours Per Day",
    },
    {
      icon: <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />,
      value: new Set(filteredEntries.map((entry) => entry.date)).size,
      label: "Days Tracked",
    },
  ].map((item, i) => (
    <div
      key={i}
      className="bg-card/50 border rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-200 min-h-[180px] sm:min-h-[200px]"
    >
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
        {item.icon}
      </div>
      <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{item.value}</p>
      <p className="text-sm sm:text-base text-muted-foreground mt-1">{item.label}</p>
    </div>
  ))}
</div>


        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowReportDialog(true)}>
            <FileTextIcon className="h-3.5 w-3.5 mr-1" />
            Generate Report
          </Button>
          <Dialog open={isAddingTime} onOpenChange={setIsAddingTime}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Log Time
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log Time Entry</DialogTitle>
                <DialogDescription>Record your work hours for a specific project and task.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger id="project" className={formErrors.project ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.project && <p className="text-xs text-red-500">{formErrors.project}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours Worked</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      min="0.5"
                      placeholder="0.0"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      className={formErrors.hours ? "border-red-500" : ""}
                    />
                    {formErrors.hours && <p className="text-xs text-red-500">{formErrors.hours}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !workDate && "text-muted-foreground",
                            formErrors.date && "border-red-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {workDate ? format(workDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={workDate} onSelect={setWorkDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {formErrors.date && <p className="text-xs text-red-500">{formErrors.date}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task">Task Description</Label>
                  <Textarea
                    id="task"
                    placeholder="Describe what you worked on..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className={formErrors.task ? "border-red-500" : ""}
                  />
                  {formErrors.task && <p className="text-xs text-red-500">{formErrors.task}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTime(false)}>
                  <XIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmitTimeEntry}>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
