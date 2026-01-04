"use client";

import {
  MapPin,
  Users,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Globe,
  MessageSquare,
} from "lucide-react";

interface Community {
  id: number;
  name: string;
  description: string;
  location: string;
  members: number;
  category: string;
  status: "Active" | "Maintenance" | "New";
  gradient: string;
}

const communitiesData: Community[] = [
  {
    id: 1,
    name: "CodeLink Collective",
    description:
      "A network of freelance developers in Indonesia sharing knowledge and opportunities.",
    location: "Indonesia",
    members: 1250,
    category: "Development",
    status: "Maintenance",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    name: "Pixel Perfect Guild",
    description:
      "UI/UX designers focused on creating world-class digital experiences and design systems.",
    location: "Global / Remote",
    members: 850,
    category: "Design",
    status: "Active",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: 3,
    name: "Data Wizards ID",
    description:
      "Community for data scientists and analysts to collaborate on big data projects.",
    location: "Jakarta, ID",
    members: 420,
    category: "Data Science",
    status: "New",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    name: "Copywriting Circle",
    description:
      "Professional writers and content strategists sharing tips on high-converting copy.",
    location: "Remote",
    members: 310,
    category: "Writing",
    status: "Active",
    gradient: "from-orange-400 to-red-500",
  },
];

export default function Community() {
  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 focus:border-(--secondary) outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-(--primary) hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-(--primary) text-white rounded-2xl text-sm font-bold hover:bg-(--primary)/90 transition-all shadow-lg shadow-(--primary)/10 cursor-pointer group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Create Community
        </button>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {communitiesData.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-(--primary)/5 transition-all duration-500 flex flex-col"
          >
            {/* Top Gradient Section */}
            <div
              className={`relative h-48 bg-linear-to-br ${item.gradient} p-6 flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {item.category}
                </span>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${
                    item.status === "Maintenance"
                      ? "bg-amber-400 text-white"
                      : item.status === "Active"
                        ? "bg-green-400 text-white"
                        : "bg-blue-400 text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  {item.status}
                </span>
              </div>

              {/* Decorative Element */}
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Globe className="w-32 h-32 -mr-8 -mb-8 text-white" />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-(--primary) mb-3 group-hover:text-(--secondary) transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2">
                {item.description}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                  <MapPin className="w-4 h-4 text-green-500" />
                  {item.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                  <Users className="w-4 h-4 text-(--secondary)" />
                  {item.members.toLocaleString()} Members
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  Click to explore
                </span>
                <button className="flex items-center gap-2 text-sm font-bold text-(--secondary) hover:gap-3 transition-all cursor-pointer">
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / CTA for Creating */}
      <div className="bg-(--alternative)/30 rounded-[40px] p-12 text-center border-2 border-dashed border-gray-200 mt-12">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-(--secondary)" />
        </div>
        <h2 className="text-2xl font-bold text-(--primary) mb-2">
          Can&apos;t find your niche?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Start your own community and lead the conversation with like-minded
          freelancers.
        </p>
        <button className="px-8 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-(--primary) hover:bg-(--primary) hover:text-white hover:border-(--primary) transition-all shadow-sm cursor-pointer">
          Start a New Community
        </button>
      </div>
    </div>
  );
}
