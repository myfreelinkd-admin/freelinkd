"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Users,
  ArrowRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  maxMembers: number;
  skills?: string[];
}

interface TransferProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    client: string;
  };
  freelancerId: string;
  onSuccess?: () => void;
}

export default function TransferProjectModal({
  isOpen,
  onClose,
  project,
  freelancerId,
  onSuccess,
}: TransferProjectModalProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "transferring" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user's group
  useEffect(() => {
    const fetchGroup = async () => {
      if (!isOpen || !freelancerId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/freelancer/group?freelancerId=${freelancerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setGroup({
            id: data.data.id || data.data._id,
            name: data.data.name,
            memberCount: (data.data.members?.length || 0) + 1,
            maxMembers: data.data.maxMembers || 5,
            skills: data.data.skills,
          });
        } else {
          setGroup(null);
        }
      } catch (error) {
        console.error("Failed to fetch group:", error);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [isOpen, freelancerId]);

  const handleTransfer = async () => {
    if (!group) return;

    setStatus("transferring");
    setErrorMessage("");

    try {
      const response = await fetch("/api/freelancer/projects/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          freelancerId: freelancerId,
          groupId: group.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to transfer project");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred");
    }
  };

  const handleClose = () => {
    if (status !== "transferring") {
      setStatus("idle");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Success State */}
          {status === "success" && (
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
                  Transfer Successful!
                </h2>
                <p className="text-gray-500 text-sm">
                  Project "{project.name}" has been transferred to {group?.name}.
                  All group members can now collaborate on this project.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
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
                  Transfer Failed
                </h2>
                <p className="text-gray-500 text-sm">{errorMessage}</p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-2xl transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Main Content */}
          {(status === "idle" || status === "transferring") && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1C46]">
                      Transfer to Group
                    </h2>
                    <p className="text-xs text-gray-400">
                      Share this project with your team
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={status === "transferring"}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Project Info */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
                    Project
                  </p>
                  <p className="font-bold text-[#0B1C46] text-lg">{project.name}</p>
                  <p className="text-sm text-gray-500">Client: {project.client}</p>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                )}

                {/* No Group */}
                {!loading && !group && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800 text-sm">No Group Found</p>
                      <p className="text-amber-700 text-xs mt-1">
                        You need to create or join a group before you can transfer projects.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        Create a Group
                      </button>
                    </div>
                  </div>
                )}

                {/* Group Info */}
                {!loading && group && (
                  <>
                    <div className="flex items-center gap-4">
                      {/* From */}
                      <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#0B1C46] mx-auto flex items-center justify-center text-white font-bold text-lg mb-2">
                          You
                        </div>
                        <p className="text-sm text-gray-500">Individual</p>
                      </div>

                      {/* Arrow */}
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                      </div>

                      {/* To */}
                      <div className="flex-1 bg-blue-50 rounded-2xl p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white font-bold text-lg mb-2">
                          <Users className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-[#0B1C46]">{group.name}</p>
                        <p className="text-xs text-gray-500">
                          {group.memberCount} member(s)
                        </p>
                      </div>
                    </div>

                    {/* What happens */}
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <p className="text-blue-800 text-sm font-medium mb-2">
                        What happens after transfer:
                      </p>
                      <ul className="space-y-1.5 text-blue-700 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          All group members can view and work on this project
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          UMKM will see "Your Name + {group.name}" as the assignee
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          You can revoke this transfer anytime
                        </li>
                      </ul>
                    </div>

                    {group.skills && group.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.slice(0, 5).map((skill: string) => (
                          <span
                            key={skill}
                            className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!loading && group && (
                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={status === "transferring"}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={status === "transferring"}
                    className="flex-1 py-3 bg-[#0B1C46] hover:bg-[#152c66] text-white font-medium rounded-2xl transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {status === "transferring" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5" />
                        Transfer to Group
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
