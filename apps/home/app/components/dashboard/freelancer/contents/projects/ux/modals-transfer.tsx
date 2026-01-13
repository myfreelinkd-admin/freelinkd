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
  const [status, setStatus] = useState<
    "idle" | "transferring" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user's group
  useEffect(() => {
    const fetchGroup = async () => {
      if (!isOpen || !freelancerId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/freelancer/group?freelancerId=${freelancerId}`
        );
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
                  Project "{project.name}" has been transferred to {group?.name}
                  . All group members can now collaborate on this project.
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
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Transfer to Group
                    </h2>
                    <p className="text-xs text-gray-500">
                      Collaborate with your team
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
              <div className="p-6 space-y-8">
                {/* Project Info - Cleaner Look */}
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">
                    Project to Transfer
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Client: {project.client}
                  </p>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-xs font-medium">
                      Fetching group info...
                    </span>
                  </div>
                )}

                {/* No Group Warning */}
                {!loading && !group && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4 mx-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-900 text-sm">
                        No Group Found
                      </p>
                      <p className="text-amber-700/80 text-xs mt-1 leading-relaxed">
                        You need to create or join a group before you can
                        transfer projects to a team.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-3 text-xs font-bold bg-amber-100 text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Create or Join Group
                      </button>
                    </div>
                  </div>
                )}

                {/* Group Info Visual */}
                {!loading && group && (
                  <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent border-t border-dashed border-gray-300 z-0"></div>

                    <div className="relative z-10 flex items-center justify-center gap-12">
                      {/* From: You */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center relative group-hover:border-blue-100 transition-colors">
                          <span className="text-2xl font-bold text-gray-700">
                            You
                          </span>
                          <div className="absolute -bottom-1.5 px-2 py-0.5 bg-gray-800 text-white text-[9px] font-bold rounded-full">
                            Owner
                          </div>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center ring-4 ring-white">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>

                      {/* To: Group */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center relative">
                          <Users className="w-8 h-8 text-white" />
                          <div className="absolute -bottom-1.5 px-2 py-0.5 bg-blue-700 text-white text-[9px] font-bold rounded-full border border-blue-500">
                            {group.memberCount} Mbrs
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between px-10 mt-3 text-center">
                      <p className="text-xs text-center w-20 text-gray-500 font-medium">
                        Individual Ownership
                      </p>
                      <p className="text-xs text-center w-20 text-blue-700 font-bold">
                        {group.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Important Notes */}
                {!loading && group && (
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <p className="text-[10px] items-center text-blue-700 font-bold tracking-widest uppercase mb-3 flex gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      What changes?
                    </p>
                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="flex items-start gap-3 text-xs text-gray-600 bg-white/60 p-2.5 rounded-lg border border-blue-100/50">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-gray-900">
                            Shared Access:
                          </strong>{" "}
                          All {group.memberCount} group members can view and
                          collaborate.
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-gray-600 bg-white/60 p-2.5 rounded-lg border border-blue-100/50">
                        <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-gray-900">
                            Client View:
                          </strong>{" "}
                          Assigned to "You + {group.name}".
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!loading && group && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={status === "transferring"}
                    className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all focus:ring-2 focus:ring-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={status === "transferring"}
                    className="flex-[2] py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === "transferring" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transferring Project...
                      </>
                    ) : (
                      <>Confirm Transfer</>
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
