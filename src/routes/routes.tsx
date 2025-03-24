import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/Dashboard";
import Home from "@/pages/Home";
import DashboardLayout from "@/layouts/dashboard/layout";
import DocsPage from "@/pages/docs/page";
import LandingLayout from "@/layouts/landing/layout";
import DocsLayout from "@/layouts/docs/layout";
import NotFound from "@/pages/404";
import RegisterPage from "@/pages/register/page";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import ProfilePage from "@/pages/profile/profile";
import ProjectsPage from "@/pages/projects/page";
import { PlanningPokerRoom } from "@/pages/planning-poker/room/planning-poker-room";
import TeamsPage from "@/pages/teams/team-page";
import ProjectsDashboardLayout from "@/layouts/projects/layout";
import BacklogPage from "@/pages/projects/backlog/page";
import BoardPage from "@/pages/projects/board/page";
import PlanningPokerRoomGuard from "@/guard/PlanningPokerRoomGuard";
import { SessionProvider } from "@/context/SessionProvider";
import PlanningPokerPageGuard from "@/guard/PlanningPokerPageGuard";
import InvitationVerify from "../pages/Invitation";
import { TeamsProvider } from "@/context/TeamsContext";
import TeamDashboard from "@/pages/teams/dashboard/page";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SessionProvider>
                <DashboardLayout />
              </SessionProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="planning-poker" element={<PlanningPokerPageGuard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route
            path="planning-poker/room/:id"
            element={
              <PlanningPokerRoomGuard>
                <PlanningPokerRoom />
              </PlanningPokerRoomGuard>
            }
          />
          <Route
            path="teams"
            element={
              <TeamsProvider>
                <TeamsPage />
              </TeamsProvider>
            }
          />

          <Route path="teams/:team_id" element={<TeamDashboard />} />
        </Route>

        <Route
          path="/invitation"
          element={
            <PublicRoute>
              <InvitationVerify />
            </PublicRoute>
          }
        />

        <Route
          path="/projects/:project_name"
          element={
            <ProtectedRoute>
              <ProjectsDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BacklogPage />} />
          <Route path="backlog" element={<BacklogPage />} />
          <Route path="board" element={<BoardPage />} />
        </Route>

        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingLayout children={<Home />} />
            </PublicRoute>
          }
        />
        <Route
          path="/docs/*"
          element={
            <PublicRoute>
              <DocsLayout children={<DocsPage />} />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <LandingLayout children={<RegisterPage />} />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
