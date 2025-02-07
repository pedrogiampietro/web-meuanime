import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/global.css";
import { router } from "./routes";
import { store } from "./store";
import { SidebarProvider } from "./contexts/SidebarContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </Provider>
  </StrictMode>
);
