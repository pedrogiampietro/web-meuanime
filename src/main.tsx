import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/global.css";
import { router } from "./routes";
import { store } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider>
            <RouterProvider router={router} />
          </SidebarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
