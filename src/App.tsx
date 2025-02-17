import { Outlet } from "react-router-dom";
import { NetflixLayout } from "./components/layout/NetflixLayout";

export function App() {
  return (
    <NetflixLayout>
      <Outlet />
    </NetflixLayout>
  );
}
