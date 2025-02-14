import React from "react";
import { Header } from "../Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

interface NetflixLayoutProps {
  children?: React.ReactNode;
}

export const NetflixLayout: React.FC<NetflixLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zax-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">{children || <Outlet />}</main>
      </div>
    </div>
  );
};
