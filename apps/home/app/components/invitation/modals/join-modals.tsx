"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  CheckCircle,
  X,
  MessageCircle,
  ArrowRight,
  Loader2,
  XCircle,
} from "lucide-react";
import Image from "next/image";

interface JoinConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onOpenChat?: () => void;
  groupName: string;
  groupImageUrl?: string;
  inviterName: string;
  memberCount: number;
  maxMembers: number;
  status: "confirming" | "joining" | "success" | "error";
  errorMessage?: string;
}

export default function JoinConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onOpenChat,
  groupName,
  groupImageUrl,
  inviterName,
  memberCount,
  maxMembers,
  status,
  errorMessage,
}: JoinConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={status !== "joining" ? onClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-4xl shadow-2xl w-full max-w-md overflow-hidden"
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
                  Welcome to {groupName}!
                </h2>
                <p className="text-gray-500 text-sm">
                  You have successfully joined the group. You can now
                  collaborate with your team members.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-2">
                {onOpenChat && (
                  <button
                    onClick={onOpenChat}
                    className="w-full bg-[#0B1C46] hover:bg-[#152c66] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Open Group Chat
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
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
                  Unable to Join
                </h2>
                <p className="text-gray-500 text-sm">
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

          {/* Confirming/Joining State */}
          {(status === "confirming" || status === "joining") && (
            <>
              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={status === "joining"}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pt-10 flex flex-col items-center text-center space-y-6">
                {/* Header Badge */}
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-bold">Confirm Join</span>
                </div>

                {/* Group Image */}
                <div className="relative w-28 h-28 rounded-full bg-linear-to-br from-blue-100 to-purple-100 overflow-hidden shadow-lg ring-4 ring-white">
                  {groupImageUrl ? (
                    <Image
                      src={groupImageUrl}
                      alt={groupName}
                      fill
                      className="object-cover"
                      unoptimized={groupImageUrl.startsWith("data:")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#0B1C46] to-[#1a3a7c]">
                      <span className="text-white text-4xl font-bold">
                        {groupName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Group Info */}
                <div className="space-y-3 w-full">
                  <h2 className="text-2xl font-bold text-[#0B1C46]">
                    {groupName}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    You are about to join this group invited by{" "}
                    <span className="text-[#0B1C46] font-bold">
                      {inviterName}
                    </span>
                  </p>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {memberCount}/{maxMembers} members
                    </span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="w-full bg-blue-50 rounded-2xl p-4 text-left">
                  <p className="text-blue-800 text-sm font-medium">
                    By joining this group:
                  </p>
                  <ul className="mt-2 space-y-1.5 text-blue-700 text-xs">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                      You can chat with other members
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                      Collaborate on projects together
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                      Share resources and ideas
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3 pt-2">
                  <button
                    onClick={onConfirm}
                    disabled={status === "joining"}
                    className="w-full bg-[#0B1C46] hover:bg-[#152c66] text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {status === "joining" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Joining Group...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm & Join Group
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    disabled={status === "joining"}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 px-6 rounded-2xl transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
