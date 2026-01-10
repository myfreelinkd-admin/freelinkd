"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Mail,
  MapPin,
  Check,
  X,
  Clock,
  Eye,
  Calendar,
  Loader2,
} from "lucide-react";
import ViewUserModal from "../modals/modals-view";

interface PendingFreelancer {
  id: string | number;
  name: string;
  email: string;
  role: string;
  location: string;
  appliedDate: string;
  status: string;
  portfolioUrl?: string;
}

export default function FreelancerPending() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<PendingFreelancer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFreelancers, setPendingFreelancers] = useState<PendingFreelancer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingFreelancers();
  }, []);

  const fetchPendingFreelancers = async () => {
    try {
      const res = await fetch("/api/admin/users/pending-freelancers");
      const data = await res.json();
      if (data.success) {
        setPendingFreelancers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch pending freelancers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: PendingFreelancer) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    console.log("Approved", selectedUser?.name);
    setIsModalOpen(false);
  };

  const handleReject = () => {
    console.log("Rejected", selectedUser?.name);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pending applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff6f00]/20 focus:border-[#ff6f00] transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden relative group/table">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Applicant
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Role & Location
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Applied Date
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingFreelancers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#ff6f00]/5 transition-all duration-300 group/row"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover/row:scale-105 transition-transform duration-500 bg-orange-50 flex items-center justify-center">
                        <span className="text-lg font-black text-[#ff6f00]">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-[#081f5c] group-hover/row:text-[#ff6f00] transition-colors">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {user.role}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#ff6f00]" />
                        {user.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {user.appliedDate}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm bg-orange-50 text-orange-600 border border-orange-100">
                      <Clock className="w-3 h-3 animate-pulse" />
                      Pending Review
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#081f5c] hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-green-500 hover:bg-green-50 hover:shadow-md rounded-xl transition-all cursor-pointer border border-transparent hover:border-green-100"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 hover:shadow-md rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Simplified for pending list */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400">
            Showing all pending applications
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-gray-400 cursor-not-allowed opacity-50">
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ff6f00] text-white text-xs font-bold">
                1
              </button>
            </div>
            <button className="px-4 py-2 text-xs font-bold text-gray-400 cursor-not-allowed opacity-50">
              Next
            </button>
          </div>
        </div>

        <ViewUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={
            selectedUser
              ? {
                  ...selectedUser,
                  joinedDate: selectedUser.appliedDate,
                  status: "Pending", // Ensure status is Pending to hide rank in modal
                }
              : null
          }
          type="freelancer"
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
