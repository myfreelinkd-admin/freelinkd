"use client";

import { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import SearchBar from "./search-bar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    const root = document.documentElement;
    root.classList.toggle("sidebar-collapsed");
    try {
      const ev = new CustomEvent("sidebar-collapsed-change");
      root.dispatchEvent(ev as Event);
    } catch {}
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-(--background)/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-400 mx-auto px-8 flex items-center gap-6">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="group p-2.5 rounded-xl hover:bg-(--primary)/5 transition-all duration-200 cursor-pointer"
        >
          <Menu className="w-5 h-5 text-(--primary) group-hover:scale-110 transition-transform" />
        </button>

        {/* Search Section */}
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        {/* Actions Section */}
        <div className="ml-auto flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl hover:bg-(--primary)/5 transition-all duration-200 text-(--primary) cursor-pointer group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-(--secondary) rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-2"></div>

          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-(--primary)">Welcome back,</p>
            <p className="text-xs text-gray-500">Freelancer Page</p>
          </div>
        </div>
      </div>
    </header>
  );
}
