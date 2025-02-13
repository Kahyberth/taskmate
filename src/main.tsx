import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/routes";
import { AuthProvider } from "./context/AuthProvider";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <AuthProvider>
        <Notifications />
        <AppRoutes />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>
);
