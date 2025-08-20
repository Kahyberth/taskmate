import { Suspense } from "react";
import { Loader } from "@mantine/core";

import TeamChatComponent from "@/components/teams-dashboard/team-chat";


export default function TeamChatPage() {
  return (
    <Suspense fallback={<Loader size="lg" color="blue" />}>
      <TeamChatComponent />
    </Suspense>
  );
}
