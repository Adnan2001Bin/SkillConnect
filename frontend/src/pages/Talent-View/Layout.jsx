import React from "react";
import { Outlet } from "react-router";
import TalentHeader from "@/components/Talent-View/Header";
import TalentSideBar from "@/components/Talent-View/SideBar";
import { motion } from "framer-motion";
import { mainVariants } from "@/utils/Talent/animationVariants";

const TalentLayout = () => {
  return (
    <div className="min-h-screen bg-light-teal" style={{ backgroundColor: "#c1d4d3" }}>
      <TalentHeader />
      <div className="flex">
        <TalentSideBar />
        <motion.main
          initial="hidden"
          animate="visible"
          variants={mainVariants}
          className="flex-1 ml-0 sm:ml-16 lg:ml-64 p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default TalentLayout;