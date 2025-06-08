import { Settings, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ThemeToggle } from "../ui/theme-toggle";
import { NotificationsComponent } from "../notifications/notifications.component";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const { userProfile, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between p-4 backdrop-blur-md bg-white dark:bg-black/20 border-b border-black/10 dark:border-white/10 ">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5 dark:text-white text-black" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-primary-foreground font-semibold text-xl">
            <img src="/image/taskmate-x.png" alt="TaskMate Logo" width={32} height={32} />
          </div>
          <h1 className="text-xl font-bold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-900">
              TaskMate
            </span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsComponent />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userProfile?.profile.profile_picture}
                  alt="User"
                />
                <AvatarFallback>{userProfile?.name.slice(0,2)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userProfile?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userProfile?.email}
                </p>
                <Badge className="mt-1 w-fit">User</Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link className="flex items-center gap-2" to="/dashboard/profile">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="flex items-center gap-2" to="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}