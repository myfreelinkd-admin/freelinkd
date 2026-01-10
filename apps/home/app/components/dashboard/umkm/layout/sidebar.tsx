"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings2, LogOut, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: "UMKM User",
    email: "loading...",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const storedUser =
          sessionStorage.getItem("umkm_user") || localStorage.getItem("umkm_user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email) {
            // Fetch fresh data from AstraDB via API
            const res = await fetch(`/api/umkm/profile?email=${parsedUser.email}`);
            const data = await res.json();

            if (data.success) {
              setUser({
                name: data.data.profile.nama_umkm || parsedUser.username || "UMKM User",
                email: data.data.email || parsedUser.email,
                image: data.data.profile.profile_image,
              });
            } else {
               // Fallback to storage if API fails
               setUser({
                name: parsedUser.username || "UMKM User",
                email: parsedUser.email,
                image: parsedUser.profile?.profile_image
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }

    fetchUserData();

    // Sidebar collapse logic
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
    root.addEventListener("sidebar-collapsed-change", onToggle as EventListener);

    return () => {
      if (obs) obs.disconnect();
      root.removeEventListener("sidebar-collapsed-change", onToggle as EventListener);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6F00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("umkm_user");
        localStorage.removeItem("umkm_user");
        router.replace("/umkm/login");
        
        // Show success toast briefly
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Logged out successfully"
        });
      }
    });
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = [
    { name: "Dashboard", href: "/umkm/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/umkm/preferences", icon: Settings2 },
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
            <ProfileAvatar 
               collapsed={collapsed} 
               name={user.name}
               image={user.image}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user.name}
                </p>
                <p className="text-white/50 text-xs truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
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

function ProfileAvatar({ 
  collapsed = false, 
  name, 
  image 
}: { 
  collapsed?: boolean;
  name: string;
  image?: string;
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const [imgError, setImgError] = useState(false);

  const sizeClass = collapsed ? "w-10 h-10" : "w-11 h-11";

  // Reset error when image url changes
  useEffect(() => {
    setImgError(false);
  }, [image]);

  return (
    <div
      className={`${sizeClass} rounded-xl overflow-hidden flex items-center justify-center ring-2 ring-white/10 transition-all duration-300 bg-white/5`}
    >
      {image && !imgError ? (
        <Image
          src={image}
          alt="UMKM Profile"
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
