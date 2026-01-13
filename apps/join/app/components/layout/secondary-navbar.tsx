import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SecondaryNavbarProps {
  title: string;
  href?: string;
}

export function SecondaryNavbar({
  title,
  href = "https://freelinkd.com",
}: SecondaryNavbarProps) {
  return (
    <div className="w-full bg-white text-[#081f5c] sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6 flex items-center gap-4 md:gap-6">
        <Link
          href={href}
          className="group flex items-center gap-2 hover:opacity-80 transition-opacity text-gray-600 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-xl md:text-2xl font-bold capitalize text-[#081f5c] truncate">
          {title}
        </h1>
      </div>
    </div>
  );
}
