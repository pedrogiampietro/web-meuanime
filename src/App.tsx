import { Routes, Route } from "react-router-dom";
import { NetflixLayout } from "./components/layout/NetflixLayout";
import { Home } from "./pages/Home";
import { Watch } from "./pages/Watch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<NetflixLayout />}>
          <Route index element={<Home />} />
          <Route path="watch/*" element={<Watch />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
