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
import PlanningPokerPage from "@/pages/planning-poker/planning-poker";
import ProjectsPage from "@/pages/projects/page";
import { PlanningPokerRoom } from "@/pages/planning-poker/room/planning-poker-room";
import TeamsPage from "@/pages/teams/team-page";
import ChatPage from "@/pages/chat/chat-page";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="planning-poker" element={<PlanningPokerPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route
            path="planning-poker/room/:id"
            element={<PlanningPokerRoom />}
          />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingLayout children={<Home />} />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/docs/*"
          element={
            <PublicRoute>
              <DocsLayout children={<DocsPage />} />
            </PublicRoute>
          }
        ></Route>
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <LandingLayout children={<RegisterPage />} />
            </PublicRoute>
          }
        ></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
