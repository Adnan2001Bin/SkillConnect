// src/pages/User/Layout.jsx
import React from "react";
import UserHeader from "@/components/User-View/Header";
import { Outlet } from "react-router";
import Footer from "@/components/User-View/Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full">
        <UserHeader />
        <main className="flex flex-col w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;