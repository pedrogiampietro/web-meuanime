import { Outlet } from "react-router-dom";
import { Header } from "../Header";

export function NetflixLayout() {
  return (
    <div className="min-h-screen bg-zax-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
