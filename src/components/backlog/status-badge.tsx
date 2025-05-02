import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "not-started":
      return (
        <Badge variant="outline" className="bg-slate-100 text-slate-700">
          Not Started
        </Badge>
      );
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-700">
          In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-700">
          Completed
        </Badge>
      );
    case "at-risk":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700">
          At Risk
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
