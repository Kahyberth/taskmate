import { Suspense } from "react";
import { Loader } from "@mantine/core";

import TeamChatComponent from "@/components/teams-dashboard/team-chat";
import { useParams } from "react-router-dom";

export default function TeamChatPage() {
  const { team_id } = useParams<{ team_id: string }>();
  return (
    <Suspense fallback={<Loader size="lg" color="blue" />}>
      <TeamChatComponent team_id={team_id || ""} />
    </Suspense>
  );
}
