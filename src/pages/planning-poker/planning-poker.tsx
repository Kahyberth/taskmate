import { ActiveRooms } from "@/components/planning-poker/active-rooms";
import { PlanningPokerHeader } from "@/components/planning-poker/planning-poker-header";
import { QuickJoin } from "@/components/planning-poker/quick-join";

export default function PlanningPokerPage() {
  return (
    <>
      <PlanningPokerHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActiveRooms />
        </div>
        <div>
          <QuickJoin />
        </div>
      </div>
    </>
  );
}