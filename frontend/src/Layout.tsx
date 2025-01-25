import { useState } from "react";
import Topbar from "./components/Mainlayout/TopBar";
import { Outlet } from "react-router-dom";
import Footr from "./components/Mainlayout/Footr";
import Sidebar from "./components/Mainlayout/SideBar";
import { motion } from "framer-motion";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="">
        <Topbar setIsOpen={setIsOpen} />
        <div className="flex">
          <Sidebar isOpen={isOpen} />
          <div className="mx-auto w-[95%] pt-12 sm:w-3/5">
            <Outlet />
            <Footr />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
