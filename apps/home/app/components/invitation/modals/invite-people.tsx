"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  UserPlus,
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  Mail,
  Check,
} from "lucide-react";
import Image from "next/image";

interface Freelancer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills?: string[];
}

interface InvitePeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  currentMembers: string[]; // Array of member IDs already in the group
  onSuccess?: () => void;
}

export default function InvitePeopleModal({
  isOpen,
  onClose,
  groupId,
  groupName,
  currentMembers = [],
  onSuccess,
}: InvitePeopleModalProps) {
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invitedCount, setInvitedCount] = useState(0);

  // Fetch freelancers when modal opens or search changes
  useEffect(() => {
    const fetchFreelancers = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/freelancer/list?search=${encodeURIComponent(search)}&limit=20`);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Filter out current members
          const available = data.data.filter(
            (f: Freelancer) => !currentMembers.includes(f.id)
          );
          setFreelancers(available);
        }
      } catch (error) {
        console.error("Failed to fetch freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFreelancers, 300);
    return () => clearTimeout(debounceTimer);
  }, [isOpen, search, currentMembers]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleInvite = async () => {
    if (selectedIds.length === 0) return;

    setInviteStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/freelancer/group/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          freelancerIds: selectedIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInvitedCount(selectedIds.length);
        setInviteStatus("success");
        setSelectedIds([]);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setInviteStatus("idle");
        }, 2000);
      } else {
        setInviteStatus("error");
        setErrorMessage(data.error || "Failed to send invitations");
      }
    } catch (error) {
      setInviteStatus("error");
      setErrorMessage("An unexpected error occurred");
    }
  };

  const handleClose = () => {
    setSearch("");
    setSelectedIds([]);
    setInviteStatus("idle");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={inviteStatus !== "sending" ? handleClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Success State */}
          {inviteStatus === "success" && (
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#0B1C46]">
                  Invitations Sent!
                </h2>
                <p className="text-gray-500 text-sm">
                  {invitedCount} freelancer(s) have been added to {groupName}.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {inviteStatus === "error" && (
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center"
              >
                <XCircle className="w-12 h-12 text-red-500" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-600">
                  Invitation Failed
                </h2>
                <p className="text-gray-500 text-sm">{errorMessage}</p>
              </div>
              <button
                onClick={() => setInviteStatus("idle")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-2xl transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Main Form */}
          {(inviteStatus === "idle" || inviteStatus === "sending") && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1C46]">
                      Invite People
                    </h2>
                    <p className="text-xs text-gray-400">
                      Add freelancers to {groupName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={inviteStatus === "sending"}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search freelancers by name or email..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-[#0B1C46] focus:ring-2 focus:ring-[#0B1C46]/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Freelancer List */}
              <div className="max-h-[40vh] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : freelancers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No freelancers found</p>
                    <p className="text-gray-400 text-sm">Try a different search term</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {freelancers.map((freelancer) => {
                      const isSelected = selectedIds.includes(freelancer.id);
                      return (
                        <div
                          key={freelancer.id}
                          onClick={() => toggleSelect(freelancer.id)}
                          className={`p-4 flex items-center gap-4 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {/* Avatar */}
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            {freelancer.avatar ? (
                              <Image
                                src={freelancer.avatar}
                                alt={freelancer.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                                <span className="text-white text-lg font-bold">
                                  {freelancer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {freelancer.name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3" />
                              {freelancer.email}
                            </p>
                            {freelancer.skills && freelancer.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {freelancer.skills.slice(0, 3).map((skill) => (
                                  <span
                                    key={skill}
                                    className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {freelancer.skills.length > 3 && (
                                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                    +{freelancer.skills.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Checkbox */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#0B1C46] border-[#0B1C46]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={inviteStatus === "sending"}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviteStatus === "sending" || selectedIds.length === 0}
                  className="flex-1 py-3 bg-[#0B1C46] hover:bg-[#152c66] text-white font-medium rounded-2xl transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {inviteStatus === "sending" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Invite {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
