"use client";

import React from "react";
import { usePathname } from "next/navigation";

const pageTitles = {
  "/": "Dashboard",
};

const Navbar = () => {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] || "HealthX Dashboard";

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <span className="text-xl font-semibold text-slate-800">{currentPage}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
