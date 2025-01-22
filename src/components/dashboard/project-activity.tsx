import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Lun", commits: 12, pullRequests: 4, issues: 8 },
  { name: "Mar", commits: 18, pullRequests: 6, issues: 10 },
  { name: "Mie", commits: 15, pullRequests: 3, issues: 6 },
  { name: "Jue", commits: 20, pullRequests: 8, issues: 12 },
  { name: "Vie", commits: 25, pullRequests: 5, issues: 15 },
  { name: "Sab", commits: 10, pullRequests: 2, issues: 4 },
  { name: "Dom", commits: 5, pullRequests: 1, issues: 2 },
];

export function ProjectActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad del Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="pullRequests"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="issues" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-500">Commits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-500">Pull Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-500">Issues</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
