import { UserNav } from "@/components/dashboard/user-nav";
import { Search } from "@/components/dashboard/search";
import { Notifications } from "@/components/dashboard/notifications";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 items-center gap-4 px-4">
        <SidebarTrigger />
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <Notifications />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
