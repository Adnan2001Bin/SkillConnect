// src/components/Talent-View/TalentLayout.jsx
import React from "react";
import { Outlet } from "react-router";
import TalentHeader from "@/components/Talent-View/Header";
import TalentSideBar from "@/components/Talent-View/SideBar";

const TalentLayout = () => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <TalentHeader />

      <div className="flex flex-1">
        <TalentSideBar />

        <main className="flex-1 pt-16 pl-0 sm:pl-[80px] lg:pl-[250px] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TalentLayout;