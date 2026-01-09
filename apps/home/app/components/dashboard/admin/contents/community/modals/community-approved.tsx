"use client";

import {
  X,
  CheckCircle2,
  XCircle,
  MapPin,
  Users,
  Globe,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface CommunityApprovedModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: {
    id: number;
    name: string;
    description: string;
    location: string;
    members: number;
    category: string;
    creator: string;
    date: string;
  } | null;
  onApprove: () => void;
  onReject: () => void;
}

export default function CommunityApprovedModal({
  isOpen,
  onClose,
  community,
  onApprove,
  onReject,
}: CommunityApprovedModalProps) {
  if (!isOpen || !community) return null;

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
            <h2 className="text-2xl font-bold text-(--primary)">
              Review Community Request
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Review details before approving or rejecting.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* Main Info Card */}
          <div className="p-6 rounded-4xl border border-gray-100 bg-white hover:border-(--secondary)/30 hover:shadow-md transition-all group">
            <div className="flex flex-col gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Submitted: {community.date}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" /> Pending Review
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-(--primary) mb-2">
                  {community.name}
                </h3>
                 <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                       <Users className="w-4 h-4 text-(--secondary)" /> Creator: {community.creator}
                    </span>
                 </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <MapPin className="w-4 h-4 text-green-500" />
                    {community.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <Globe className="w-4 h-4 text-blue-500" />
                    {community.category}
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/* Description Section */}
           <div className="space-y-3">
               <h4 className="text-sm font-bold text-(--primary) ml-1">Description</h4>
                <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                    {community.description}
                </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
          <button
            onClick={onReject}
            className="flex-1 py-3.5 bg-white border border-red-100 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Reject Request
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-all cursor-pointer shadow-lg shadow-green-600/20 hover:shadow-green-600/30 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve Community
          </button>
        </div>
      </div>
    </div>
  );
}
