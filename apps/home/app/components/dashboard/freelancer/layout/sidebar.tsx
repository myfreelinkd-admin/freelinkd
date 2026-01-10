"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings2,
  LogOut,
  ChevronRight,
  Briefcase,
  Calendar,
  UserRound,
} from "lucide-react";

interface UserData {
  name: string;
  photoUrl: string;
  freelancerId: string;
}

function ProfileAvatar({ collapsed = false, userData }: { collapsed?: boolean; userData?: UserData | null }) {
  const fullName = userData?.name || "Freelancer";
  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "?";
  
  // Use fetched photoUrl or fallback
  // Handle case where photoUrl might be from uploads (need /api prefix?) or external
  // Assuming API returns a usable URL or we use default
  const profileSrc = userData?.photoUrl || "/assets/img/profile.jpg";
  
  const [imgError, setImgError] = useState(false);

  const sizeClass = collapsed ? "w-10 h-10" : "w-11 h-11";

  // Reset error when source changes
  useEffect(() => {
    setImgError(false);
  }, [profileSrc]);

  return (
    <div
      className={`${sizeClass} rounded-xl overflow-hidden flex items-center justify-center ring-2 ring-white/10 transition-all duration-300 bg-white/5`}
    >
      {!imgError ? (
        <Image
          src={profileSrc}
          alt="Freelancer Profile"
          className={`object-cover ${sizeClass}`}
          width={collapsed ? 40 : 44}
          height={collapsed ? 40 : 44}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center bg-(--secondary) text-white font-bold text-lg shadow-inner`}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const update = () => {
      try {
        setCollapsed(root.classList.contains("sidebar-collapsed"));
      } catch {}
    };

    update();

    let obs: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      obs = new MutationObserver(() => update());
      obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    }

    const onToggle = () => update();
    root.addEventListener(
      "sidebar-collapsed-change",
      onToggle as EventListener
    );

    return () => {
      if (obs) obs.disconnect();
      root.removeEventListener(
        "sidebar-collapsed-change",
        onToggle as EventListener
      );
    };
  }, []);

  // Fetch USER DATA
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try getting from storage first to get ID
        const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
        const storedUser = storage.getItem("freelancer_user");
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.id) {
            const response = await fetch(`/api/freelancer/profile?id=${parsedUser.id}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                setUserData(data.data);
              }
            }
          }
        }
      } catch (error) {
         console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = [
    { name: "Dashboard", href: "/freelancer/dashboard", icon: LayoutDashboard },
    {
      name: "Projects",
      href: "/freelancer/projects",
      icon: Briefcase,
    },
    {
      name: "Events",
      href: "/freelancer/events",
      icon: Calendar,
    },
    { name: "Community", href: "/freelancer/community", icon: UserRound },
    { name: "Preferences", href: "/freelancer/preferences", icon: Settings2 },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col justify-between bg-(--primary) border-r border-white/5 transition-all duration-300 ease-in-out shadow-2xl ${
        collapsed ? "w-20 px-3" : "w-72 px-6"
      } py-8`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-12">
          <Link
            href="/"
            className="transition-transform duration-200 hover:scale-105"
          >
            {!collapsed ? (
              <Image
                src="/assets/freelinkd.svg"
                alt="Freelinkd"
                width={140}
                height={44}
              />
            ) : (
              <Image
                src="/assets/freelinkd.svg"
                alt="Freelinkd"
                width={32}
                height={32}
                className="object-contain"
              />
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 space-y-2">
          {!collapsed && (
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold px-4 mb-4">
              Main Menu
            </p>
          )}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href} className="block group">
                  <div
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                      active
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-(--secondary) rounded-r-full" />
                    )}

                    <item.icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        active
                          ? "text-(--secondary) scale-110"
                          : "group-hover:scale-110"
                      }`}
                    />

                    {!collapsed && (
                      <span
                        className={`font-medium flex-1 ${active ? "text-white" : ""}`}
                      >
                        {item.name}
                      </span>
                    )}

                    {!collapsed && active && (
                      <ChevronRight className="w-4 h-4 text-white/40" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-white/10 space-y-6">
          {/* Profile Card */}
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-2"}`}
          >
            <ProfileAvatar collapsed={collapsed} userData={userData} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {userData?.name || "Freelancer"}
                </p>
                <p className="text-white/50 text-xs truncate">{userData?.freelancerId ? `@${userData.freelancerId}` : "@freelancerID"}</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
