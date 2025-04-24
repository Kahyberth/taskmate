import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/routes";
import { AuthProvider } from "./context/AuthProvider";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MantineProvider>
        <AuthProvider>
          {/* <SocketProvider> */}
          <Notifications />
          {/* </SocketProvider> */}
          <AppRoutes />
        </AuthProvider>
      </MantineProvider>
    </ThemeProvider>
  </StrictMode>
);
