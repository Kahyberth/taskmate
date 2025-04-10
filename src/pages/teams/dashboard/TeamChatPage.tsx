import { startTransition, useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@mantine/core";

import { apiClient } from "@/api/client-gateway";
import TeamChat from "@/components/teams-dashboard/team-chat";
import type { Members } from "@/interfaces/members.interface";

export default function TeamChatPage() {
  const { team_id } = useParams<{ team_id: string }>();
  const [channels, setChannels] = useState<any[]>([]);
  const [members, setMembers] = useState<Members[]>([]);
  const [team_data, setTeamData] = useState<any>(null);

  useEffect(() => {
    if (!team_id) return;

    startTransition(() => {
      apiClient
        .get(`channels/load-channels?team_id=${team_id}`)
        .then((r) => setChannels(r.data));

      apiClient
        .get(`teams/get-members-by-team/${team_id}`)
        .then((r) => setMembers(r.data));

      apiClient
        .get(`teams/get-team-by-id/${team_id}`)
        .then((r) => setTeamData(r.data));
    });
  }, [team_id]);

  return (
    <Suspense fallback={<Loader size="lg" color="blue" />}>
      <TeamChat channels={channels} teamMembers={members} team_data={team_data} />
    </Suspense>
  );
}
