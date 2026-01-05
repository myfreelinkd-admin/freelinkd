import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  PieChart,
  FileText,
  Mail,
  Bell,
  Search,
  Database,
  Server,
  Globe,
  Lock,
  Key,
  CreditCard,
  Briefcase,
  TrendingUp,
  Activity,
  Calendar,
  Laptop,
  Smartphone,
  Cloud,
  Code,
  Terminal,
} from "lucide-react";

const icons = [
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  PieChart,
  FileText,
  Mail,
  Bell,
  Search,
  Database,
  Server,
  Globe,
  Lock,
  Key,
  CreditCard,
  Briefcase,
  TrendingUp,
  Activity,
  Calendar,
  Laptop,
  Smartphone,
  Cloud,
  Code,
  Terminal,
];

const LoginBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-white">
      {/* Subtle Gradient Overlay to fade out edges or add depth */}
      <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-white/40 z-10"></div>

      {/* Icon Pattern */}
      <div className="flex flex-wrap content-start justify-center gap-8 p-4 w-[150%] h-[150%] -ml-[30%] -mt-[30%] transform -rotate-12 opacity-[0.07]">
        {Array.from({ length: 300 }).map((_, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="flex items-center justify-center w-16 h-16">
              <Icon size={32} className="text-var(--primary)" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoginBackground;
