"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Mail, MapPin, Trash2, Edit3, Eye} from "lucide-react";
import EditUserModal from "./modals/modals-edit";
import ViewUserModal from "./modals/modals-view";

type Freelancer = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  location: string;
  status: string;
  rank: string;
  // Optional detailed fields
  joinedDate?: string;
  phone?: string;
  bio?: string;
  website?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  professionalExperience?: string;
};

export default function FreelancerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Freelancer | null>(null);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const res = await fetch("/api/admin/users/freelancers");
      const data = await res.json();
      if (data.success) {
        setFreelancers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch freelancers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: Freelancer) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleView = (user: Freelancer) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search freelancers by name, email or role..."
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
            Add Freelancer
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
                  Freelancer Profile
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Expertise & Location
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Rank
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Account Status
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {freelancers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-(--alternative)/30 transition-all duration-300 group/row"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover/row:scale-105 transition-transform duration-500 bg-(--alternative) flex items-center justify-center">
                        <span className="text-lg font-black text-(--primary)">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-(--primary) group-hover/row:text-(--secondary) transition-colors">
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
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {user.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-600">
                      {user.rank}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${user.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleView(user)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-(--secondary) hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                        title="Edit User"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                        title="Delete User"
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
            Showing 4 of 100 Freelancers
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
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-xs font-bold transition-colors cursor-pointer">
                3
              </button>
            </div>
            <button className="px-4 py-2 text-xs font-bold text-(--primary) hover:text-(--primary)/80 transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

      <EditUserModal
        key={`edit-${selectedUser?.id}`}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedUser}
        type="freelancer"
      />
      <ViewUserModal
        key={`view-${selectedUser?.id}`}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedUser}
        type="freelancer"
      />
    </div>
  );
}
