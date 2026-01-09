"use client";

import { useState } from "react";
import {
  MapPin,
  Users,
  Search,
  Filter,
  Globe,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import CommunityApprovedModal from "./modals/community-approved";

interface Community {
  id: number;
  name: string;
  description: string;
  location: string;
  members: number;
  category: string;
  status: "Active" | "Pending" | "Rejected";
  gradient: string;
  creator: string;
  date: string;
}

const initialCommunitiesData: Community[] = [
  {
    id: 1,
    name: "CodeLink Collective",
    description:
      "A network of freelance developers in Indonesia sharing knowledge and opportunities.",
    location: "Indonesia",
    members: 1250,
    category: "Development",
    status: "Active",
    gradient: "from-blue-500 to-indigo-600",
    creator: "Rizky Dev",
    date: "2025-12-01",
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
    creator: "Sarah Design",
    date: "2025-11-15",
  },
  {
    id: 3,
    name: "Data Wizards ID",
    description:
      "Community for data scientists and analysts to collaborate on big data projects.",
    location: "Jakarta, ID",
    members: 0,
    category: "Data Science",
    status: "Pending",
    gradient: "from-emerald-500 to-teal-600",
    creator: "Budi Data",
    date: "2026-01-09",
  },
  {
    id: 4,
    name: "Independent Writers",
    description:
      "A safe haven for freelance writers to discuss rates and clients.",
    location: "Remote",
    members: 10,
    category: "Writing",
    status: "Pending",
    gradient: "from-orange-400 to-red-500",
    creator: "Jessica Pen",
    date: "2026-01-10",
  },
  {
    id: 5,
    name: "Spam Community",
    description:
      "Just a spam community description example.",
    location: "Unknown",
    members: 1,
    category: "Other",
    status: "Rejected",
    gradient: "from-gray-400 to-gray-600",
    creator: "Spammer",
    date: "2026-01-05",
  },
];

export default function AdminManageCommunity() {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Active" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<Community[]>(initialCommunitiesData);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCommunities = communities.filter(
    (c) =>
      (activeTab === "All" || c.status === activeTab) &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenApproval = (community: Community) => {
    setSelectedCommunity(community);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedCommunity) {
      setCommunities(
        communities.map((c) =>
          c.id === selectedCommunity.id ? { ...c, status: "Active" } : c
        )
      );
      setIsModalOpen(false);
      setSelectedCommunity(null);
    }
  };

  const handleReject = () => {
    if (selectedCommunity) {
      setCommunities(
        communities.map((c) =>
          c.id === selectedCommunity.id ? { ...c, status: "Rejected" } : c
        )
      );
      setIsModalOpen(false);
      setSelectedCommunity(null);
    }
  };

  const handleDelete = (id: number) => {
      if(confirm("Are you sure you want to delete this community?")) {
           setCommunities(communities.filter(c => c.id !== id));
      }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--primary)">Community Management</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            Review, approve, and manage freelancer communities.
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                 {communities.filter(c => c.status === 'Pending').length} Pending Requests
            </div>
        </div>
      </div>

       {/* Tabs & Filters */}
       <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center bg-(--alternative)/50 p-1.5 rounded-2xl border border-gray-100 gap-1 w-full lg:w-fit overflow-x-auto no-scrollbar">
            {(["All", "Pending", "Active", "Rejected"] as const).map((tab) => (
                 <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                   activeTab === tab
                     ? "bg-white shadow-md shadow-gray-200/50 text-(--primary)"
                     : "text-gray-400 hover:bg-white/60 hover:text-(--primary)"
                 }`}
               >
                 {tab}
               </button>
            ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto p-1">
          <div className="relative group flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary)/20 focus:border-(--secondary) transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          <button className="p-2.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl transition-all cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-(--primary)/5 transition-all duration-500 flex flex-col relative"
            >
              {/* Status Badge Absolute */}
               <div className="absolute top-4 right-4 z-20">
                     <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg backdrop-blur-md border border-white/20 ${
                            item.status === "Pending"
                            ? "bg-amber-400/90 text-white"
                            : item.status === "Active"
                            ? "bg-green-500/90 text-white"
                            : "bg-red-500/90 text-white"
                        }`}
                        >
                        {item.status === "Pending" && <Clock className="w-3 h-3" />}
                        {item.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === "Rejected" && <XCircle className="w-3 h-3" />}
                        {item.status}
                    </span>
               </div>

              {/* Top Gradient Section */}
              <div
                className={`relative h-40 bg-linear-to-br ${item.gradient} p-6 flex flex-col justify-end`}
              >
                 <div className="relative z-10 flex items-center justify-between">
                     <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {item.category}
                     </span>
                 </div>

                {/* Decorative Element */}
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Globe className="w-32 h-32 -mr-8 -mb-8 text-white" />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-(--primary) group-hover:text-(--secondary) transition-colors line-clamp-1" title={item.name}>
                        {item.name}
                    </h3>
                    <div className="relative">
                         {/* Simple Menu Trigger (Mock) */}
                         <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                         </button>
                    </div>
                </div>
               
                <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-2 min-h-[2.5em]">
                  {item.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-green-500" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <Users className="w-3.5 h-3.5 text-(--secondary)" />
                    {item.members.toLocaleString()} Members
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center gap-3">
                  {item.status === "Pending" ? (
                    <button 
                        onClick={() => handleOpenApproval(item)}
                        className="flex-1 py-2.5 bg-(--primary) text-white rounded-xl text-xs font-bold hover:bg-(--primary)/90 transition-all shadow-lg shadow-(--primary)/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                        Review Request
                    </button>
                  ) : item.status === "Active" ? (
                     <button className="flex-1 py-2.5 bg-gray-50 text-gray-400 rounded-xl text-xs font-bold border border-gray-100 cursor-not-allowed flex items-center justify-center gap-2" disabled>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </button>
                  ) : (
                     <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <Search className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-bold">No communities found</p>
             </div>
        )}
      </div>

      <CommunityApprovedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        community={selectedCommunity}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
