import { Outlet } from "react-router-dom";
import { NetflixLayout } from "./components/layout/NetflixLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetflixLayout>
        <Outlet />
      </NetflixLayout>
    </QueryClientProvider>
  );
}

export default App;
