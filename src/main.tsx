import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/routes.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "@mantine/core/styles.css";
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MantineProvider>
        <Notifications />
        <AppRoutes />
      </MantineProvider>
    </AuthProvider>
  </StrictMode>
);
