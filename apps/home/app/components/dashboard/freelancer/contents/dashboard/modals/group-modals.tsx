"use client";

import React, { useState } from "react";
import {
  X,
  Camera,
  Users,
  Search,
  Plus,
  Check,
  UserPlus,
  User,
} from "lucide-react";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy data for freelancers to invite
const availableFreelancers = [
  { id: 1, name: "Sarah Jenkins", role: "UI Designer", avatar: "S" },
  { id: 2, name: "Mike Ross", role: "Frontend Dev", avatar: "M" },
  { id: 3, name: "Jessica Pearson", role: "Project Manager", avatar: "J" },
  { id: 4, name: "Harvey Specter", role: "Backend Dev", avatar: "H" },
  { id: 5, name: "Louis Litt", role: "QA Engineer", avatar: "L" },
  { id: 6, name: "Rachel Zane", role: "Paralegal", avatar: "R" },
  { id: 7, name: "Donna Paulsen", role: "Executive Assistant", avatar: "D" },
];

export default function GroupModal({ isOpen, onClose }: GroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const toggleMember = (id: number) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== id));
    } else {
      if (selectedMembers.length < maxMembers - 1) {
        // -1 because you are the owner
        setSelectedMembers([...selectedMembers, id]);
      }
    }
  };

  const filteredFreelancers = availableFreelancers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-(--primary) flex items-center gap-2">
              <Users className="w-6 h-6 text-(--secondary)" />
              Create New Group
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Collaborate with other freelancers on projects.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-(--secondary) transition-all overflow-hidden shadow-inner">
                <Camera className="w-8 h-8 text-gray-400 group-hover:text-(--secondary) transition-colors" />
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-(--secondary) rounded-full flex items-center justify-center text-white border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Upload Group Icon
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Creative Squad 2026"
                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-(--secondary) focus:ring-4 focus:ring-(--secondary)/10 outline-none transition-all text-sm font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Max Members */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-(--primary)">
                  Max Members
                </label>
                <span className="text-xs font-bold text-(--secondary) bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                  {maxMembers} People
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <User className="w-5 h-5 text-gray-400" />
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-(--secondary)"
                />
                <Users className="w-5 h-5 text-(--secondary)" />
              </div>
              <p className="text-xs text-gray-400 px-1">
                Limit the number of members in your group (Max 20).
              </p>
            </div>

            {/* Invite Members */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-(--primary)">
                  Invite Members
                </label>
                <span className="text-xs font-bold text-(--secondary)">
                  {selectedMembers.length} / {maxMembers - 1} Selected
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search freelancers by name or role..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-(--secondary) focus:ring-4 focus:ring-(--secondary)/10 outline-none text-sm transition-all shadow-sm"
                />
              </div>

              {/* List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredFreelancers.length > 0 ? (
                  filteredFreelancers.map((freelancer) => {
                    const isSelected = selectedMembers.includes(freelancer.id);
                    const isDisabled =
                      !isSelected && selectedMembers.length >= maxMembers - 1;

                    return (
                      <div
                        key={freelancer.id}
                        onClick={() =>
                          !isDisabled && toggleMember(freelancer.id)
                        }
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100"
                            : "cursor-pointer"
                        } ${
                          isSelected
                            ? "bg-blue-50 border-blue-200 shadow-sm"
                            : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            {freelancer.avatar}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-bold ${isSelected ? "text-blue-900" : "text-gray-700"}`}
                            >
                              {freelancer.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {freelancer.role}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? "bg-blue-500 border-blue-500 text-white scale-110"
                              : "border-gray-300 text-transparent bg-white"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No freelancers found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!groupName.trim()}
            className="px-8 py-3.5 bg-(--primary) text-white rounded-2xl font-bold text-sm hover:bg-blue-900 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
