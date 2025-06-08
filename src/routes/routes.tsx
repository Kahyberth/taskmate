import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/Dashboard";
import Home from "@/pages/Home";
import NotFound from "@/pages/404";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import ProfilePage from "@/pages/profile/profile";
import { PlanningPokerRoom } from "@/pages/planning-poker/room/planning-poker-room";
import TeamsPage from "@/pages/teams/team-page";
import PlanningPokerRoomGuard from "@/guard/PlanningPokerRoomGuard";
import { SessionProvider } from "@/context/SessionProvider";
import PlanningPokerPageGuard from "@/guard/PlanningPokerPageGuard";
import InvitationVerify from "../pages/Invitation";
import { TeamsProvider } from "@/context/TeamsContext";
import TeamDashboard from "@/pages/teams/dashboard/page";
import RegisterPage from "@/pages/register/page";
import TeamChatPage from "@/pages/teams/dashboard/TeamChatPage";
import Layout from "@/layouts/dashboard/layout";
import ProjectsPage from "@/pages/projects/page";
import ProjectManagement from "@/components/backlog/project-management";
import ProjectBoardPage from "@/pages/board/page";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SessionProvider>
                <Layout />
              </SessionProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="planning-poker" element={<PlanningPokerPageGuard />} />
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

          <Route 
            path="projects" 
            element={
              <TeamsProvider>
                <ProjectsPage />
              </TeamsProvider>
            } 
          />
        </Route>

        <Route
          path="/teams/dashboard/:team_id"
          element={
            <ProtectedRoute>
              <TeamsProvider>
                <Layout />
              </TeamsProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<TeamDashboard />} />
          <Route path="chat" element={<TeamChatPage />} />
        </Route>

        <Route
          path="projects/backlog/:project_id"
          element={
            <ProtectedRoute>
              <TeamsProvider>
                <Layout />
              </TeamsProvider>
            </ProtectedRoute>
          }
        >
          <Route index 
            element={
              <TeamsProvider>
                <ProjectManagement />
              </TeamsProvider>
            }
          />
        </Route>

        <Route
          path="projects/board/:project_id"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProjectBoardPage />} />
        </Route>

        <Route
          path="/invitation"
          element={<InvitationVerify />}
        />

        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
