"use client";

import { useState } from "react";
import { Search, Filter, Building2, MapPin, Trash2, Edit3 } from "lucide-react";

const umkms = [
  {
    id: 1,
    companyName: "TechNova Solutions",
    owner: "Budi Santoso",
    industry: "Technology",
    location: "Jakarta, ID",
    status: "Verified",
    joinedDate: "Jan 15, 2024",
  },
  {
    id: 2,
    companyName: "GreenLeaf Organic",
    owner: "Siti Aminah",
    industry: "Agriculture",
    location: "Malang, ID",
    status: "Verified",
    joinedDate: "Feb 10, 2024",
  },
  {
    id: 3,
    companyName: "CreativeFlow Studio",
    owner: "Andi Wijaya",
    industry: "Creative Agency",
    location: "Bali, ID",
    status: "Pending",
    joinedDate: "Mar 05, 2024",
  },
  {
    id: 4,
    companyName: "UrbanBite Catering",
    owner: "Dewi Lestari",
    industry: "Food & Beverage",
    location: "Bandung, ID",
    status: "Verified",
    joinedDate: "Apr 02, 2024",
  },
];

export default function UMKMManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search UMKM by company name or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--secondary)/20 focus:border-(--secondary) transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="px-6 py-3 bg-(--secondary) text-white rounded-2xl font-bold hover:bg-(--secondary)/90 transition-all shadow-lg shadow-(--secondary)/20 cursor-pointer">
            Add UMKM
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden relative group/table">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-gray-50/30 pointer-events-none"></div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Company & Owner
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Industry & Location
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Joined Date
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Verification Status
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {umkms.map((umkm) => (
                <tr
                  key={umkm.id}
                  className="hover:bg-(--alternative)/30 transition-all duration-300 group/row"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 bg-(--alternative) shadow-md group-hover/row:scale-105 transition-transform duration-500 flex items-center justify-center">
                        <span className="text-lg font-black text-(--primary)">
                          {umkm.companyName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-(--primary) group-hover/row:text-(--secondary) transition-colors">
                          {umkm.companyName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Building2 className="w-3.5 h-3.5" />
                          {umkm.owner}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {umkm.industry}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {umkm.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-600">
                      {umkm.joinedDate}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        umkm.status === "Verified"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-orange-50 text-orange-600 border border-orange-100"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${umkm.status === "Verified" ? "bg-blue-500" : "bg-orange-500"}`}
                      />
                      {umkm.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-(--secondary) hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                        title="Edit UMKM"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                        title="Delete UMKM"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400">
            Showing 4 of 45 UMKM
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-(--primary) transition-colors cursor-pointer">
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-(--secondary) text-white text-xs font-bold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-xs font-bold transition-colors cursor-pointer">
                2
              </button>
            </div>
            <button className="px-4 py-2 text-xs font-bold text-(--primary) hover:text-(--primary)/80 transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
