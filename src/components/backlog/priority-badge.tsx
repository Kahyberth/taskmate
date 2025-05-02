import { Badge } from "@/components/ui/badge";

export const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "low":
      return <Badge className="bg-slate-500">Low</Badge>;
    case "medium":
      return <Badge className="bg-blue-500">Medium</Badge>;
    case "high":
      return <Badge className="bg-red-500">High</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};
