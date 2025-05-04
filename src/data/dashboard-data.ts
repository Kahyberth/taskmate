// dashboard-data.ts

import { Bell, Briefcase, Calendar, CheckCircle2, Clock, Clock3, Sparkles, Users } from "lucide-react";

// Sample data for charts
export const taskCompletionData = [
  { name: "Mon", completed: 12, pending: 5, total: 17 },
  { name: "Tue", completed: 19, pending: 3, total: 22 },
  { name: "Wed", completed: 15, pending: 8, total: 23 },
  { name: "Thu", completed: 22, pending: 4, total: 26 },
  { name: "Fri", completed: 18, pending: 7, total: 25 },
  { name: "Sat", completed: 10, pending: 2, total: 12 },
  { name: "Sun", completed: 8, pending: 1, total: 9 },
];

export const projectProgressData = [
  { name: "Website Redesign", progress: 75, total: 100 },
  { name: "Mobile App", progress: 45, total: 100 },
  { name: "API Integration", progress: 90, total: 100 },
  { name: "Documentation", progress: 60, total: 100 },
  { name: "Testing", progress: 30, total: 100 },
];

export const timeAllocationData = [
  { name: "Development", value: 40, color: "#4f46e5" },
  { name: "Meetings", value: 20, color: "#8b5cf6" },
  { name: "Planning", value: 15, color: "#a855f7" },
  { name: "Research", value: 15, color: "#d946ef" },
  { name: "Other", value: 10, color: "#ec4899" },
];

export const teamPerformanceData = [
  { name: "Week 1", team1: 30, team2: 25, team3: 28 },
  { name: "Week 2", team1: 35, team2: 30, team3: 32 },
  { name: "Week 3", team1: 32, team2: 35, team3: 30 },
  { name: "Week 4", team1: 40, team2: 38, team3: 35 },
];

export const recentActivities = [
  {
    id: 1,
    user: "Alex Johnson",
    action: "completed task",
    item: "Update user documentation",
    time: "10 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    user: "Sarah Williams",
    action: "commented on",
    item: "API Integration issue",
    time: "25 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    user: "Michael Brown",
    action: "created project",
    item: "Mobile App Phase 2",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    user: "Emily Davis",
    action: "completed task",
    item: "Design review",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    user: "David Wilson",
    action: "updated",
    item: "Project timeline",
    time: "3 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export const upcomingTasks = [
  {
    id: 1,
    title: "Team meeting",
    priority: "high",
    due: "Today, 2:00 PM",
    completed: false,
  },
  {
    id: 2,
    title: "Review pull requests",
    priority: "medium",
    due: "Today, 4:00 PM",
    completed: false,
  },
  {
    id: 3,
    title: "Update documentation",
    priority: "low",
    due: "Tomorrow, 10:00 AM",
    completed: false,
  },
  {
    id: 4,
    title: "Prepare presentation",
    priority: "high",
    due: "Tomorrow, 2:00 PM",
    completed: false,
  },
  {
    id: 5,
    title: "Weekly report",
    priority: "medium",
    due: "Friday, 12:00 PM",
    completed: true,
  },
];

export const notifications = [
  {
    id: 1,
    type: "mention",
    message: "Alex mentioned you in a comment",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "task",
    message: "New task assigned: Update API documentation",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    message: "Server deployment completed successfully",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "update",
    message: "TaskMate 2.0.1 update available",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "reminder",
    message: "Meeting with design team in 30 minutes",
    time: "30 minutes ago",
    read: false,
  },
];

export const aiInsights = [
  {
    id: 1,
    insight:
      "Based on your work patterns, scheduling deep work sessions in the morning could improve productivity by 27%",
    type: "productivity",
  },
  {
    id: 2,
    insight:
      "Your team completes tasks 15% faster when they're broken down into smaller subtasks",
    type: "workflow",
  },
  {
    id: 3,
    insight:
      'Project "Website Redesign" is at risk of missing its deadline based on current progress',
    type: "risk",
  },
  {
    id: 4,
    insight:
      "You spend 35% of your time in meetings. Consider delegating some recurring meetings to boost productivity",
    type: "time",
  },
];

// Widget types for customization
export const widgetTypes = [
  { id: "taskCompletion", name: "Task Completion", icon: CheckCircle2 },
  { id: "projectProgress", name: "Project Progress", icon: Briefcase },
  { id: "timeAllocation", name: "Time Allocation", icon: Clock },
  { id: "teamPerformance", name: "Team Performance", icon: Users },
  { id: "upcomingTasks", name: "Upcoming Tasks", icon: Calendar },
  { id: "recentActivity", name: "Recent Activity", icon: Clock3 },
  { id: "aiInsights", name: "AI Insights", icon: Sparkles },
  { id: "notifications", name: "Notifications", icon: Bell },
];