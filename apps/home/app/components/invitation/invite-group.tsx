"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Users, Loader2, CheckCircle, XCircle } from "lucide-react";

interface InviteGroupProps {
  groupName?: string;
  inviterName?: string;
  groupImageUrl?: string;
  memberCount?: number;
  maxMembers?: number;
  onAccept?: () => void;
  onDecline?: () => void;
  isLoading?: boolean;
  status?: "pending" | "accepting" | "success" | "error";
  errorMessage?: string;
}

export default function InviteGroup({
  groupName = "Group Name",
  inviterName = "freelancer1",
  groupImageUrl = "",
  memberCount = 1,
  maxMembers = 5,
  onAccept,
  onDecline,
  isLoading = false,
  status = "pending",
  errorMessage = "",
}: InviteGroupProps) {
  // Success state
  if (status === "success") {
    return (
      <div className="flex items-center justify-center p-4 w-full h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-95 p-8 pb-10 flex flex-col items-center text-center space-y-6 border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-[#0B1C46] text-2xl font-bold tracking-tight">
            Welcome to {groupName}!
          </h2>
          <p className="text-gray-500 text-sm">
            You have successfully joined the group. Redirecting to dashboard...
          </p>
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex items-center justify-center p-4 w-full h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-95 p-8 pb-10 flex flex-col items-center text-center space-y-6 border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-red-600 text-2xl font-bold tracking-tight">
            Unable to Join
          </h2>
          <p className="text-gray-500 text-sm">
            {errorMessage || "Something went wrong. Please try again."}
          </p>
          <button
            onClick={onDecline}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-medium py-3 px-6 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // Pending / Default state
  return (
    <div className="flex items-center justify-center p-4 w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-95 p-8 pb-10 flex flex-col items-center text-center space-y-6 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
          <Users className="w-4 h-4" />
          <span className="text-sm font-bold">Group Invitation</span>
        </div>

        {/* Group Image */}
        <div className="relative w-32 h-32 rounded-full bg-linear-to-br from-blue-100 to-purple-100 overflow-hidden shadow-lg mt-2 mb-2 ring-4 ring-white">
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

        {/* Group Name & Inviter Info */}
        <div className="space-y-3 w-full">
          <h1 className="text-[#0B1C46] text-3xl font-extrabold tracking-tight">
            {groupName}
          </h1>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            <span className="text-[#0B1C46] font-bold">{inviterName}</span> invited you to join this group
          </p>
          
          {/* Member count badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {memberCount}/{maxMembers} members
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full pt-4 space-y-3">
          <button
            onClick={onAccept}
            disabled={isLoading || status === "accepting"}
            className="w-full bg-[#0B1C46] hover:bg-[#152c66] text-white text-lg font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(isLoading || status === "accepting") ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining...
              </>
            ) : (
              "Accept Invitation"
            )}
          </button>
          
          {onDecline && (
            <button
              onClick={onDecline}
              disabled={isLoading || status === "accepting"}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-3 px-6 rounded-2xl transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              Decline
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

