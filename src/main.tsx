import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/routes.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MantineProvider>
        <AppRoutes />
      </MantineProvider>
    </AuthProvider>
  </StrictMode>
);
