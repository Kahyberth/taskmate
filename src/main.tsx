import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/routes";
import { AuthProvider } from "./context/AuthProvider";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('%c[Fetch] Petición al backend:', 'color: #2196F3; font-weight: bold', args[0]);
  return originalFetch(...args);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);
