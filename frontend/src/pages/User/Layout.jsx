// src/pages/User-View/UserLayout.jsx
import React from "react";
import UserHeader from "@/components/User-View/Header";
import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="flex flex-col overflow-hidden min-h-screen">
      <div className="w-full">
        <UserHeader />
        <main className="flex flex-col w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;