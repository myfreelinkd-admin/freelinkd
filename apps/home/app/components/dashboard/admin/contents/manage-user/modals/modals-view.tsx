"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Star,
  Phone,
  Globe,
  Award,
  Download,
  Check,
} from "lucide-react";

export interface UserData {
  id?: string | number;
  name?: string;
  companyName?: string;
  email?: string;
  owner?: string;
  role?: string;
  industry?: string;
  location?: string;
  status?: string;
  rank?: string;
  joinedDate?: string;
  rating?: number;
  phone?: string;
  website?: string;
  bio?: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData | null;
  type: "freelancer" | "umkm";
  onApprove?: () => void;
  onReject?: () => void;
}

export default function ViewUserModal({
  isOpen,
  onClose,
  data,
  type,
  onApprove,
  onReject,
}: ViewUserModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isOpen || !data) return null;

  const isFreelancer = type === "freelancer";
  const PrimaryColor = isFreelancer ? "text-(--secondary)" : "text-blue-600";
  const BgColor = isFreelancer ? "bg-(--secondary)/10" : "bg-blue-50";
  const ButtonColor = isFreelancer
    ? "bg-(--secondary) hover:bg-(--secondary)/80 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#f9fccc] rounded-[40px] p-0 shadow-2xl border border-gray-100 w-full max-w-2xl transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header / Banner Area */}
        <div
          className={`h-40 ${isFreelancer ? "bg-(--secondary)" : "bg-blue-600"} relative`}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-10 left-10">
            <div className={`w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl`}>
              <div
                className={`w-full h-full rounded-[20px] ${BgColor} flex items-center justify-center`}
              >
                <span className={`text-5xl font-black ${PrimaryColor}`}>
                  {(isFreelancer ? data.name : data.companyName)?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="pt-16 pb-8 px-10 overflow-y-auto custom-scrollbar flex-1 bg-[#F9FCFF]">
          {/* Top Info Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-black text-(--primary) tracking-tight mb-2">
              {isFreelancer ? data.name : data.companyName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-gray-500 font-bold text-sm">
              {isFreelancer ? (
                <>
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span>{data.role}</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-gray-400" />
                  <span>Owner: {data.owner}</span>
                </>
              )}
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-400" />
              <div className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{data.location}</span>
              </div>
            </div>

            {/* Status & Rating */}
            <div className="flex items-center gap-3 mt-4">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                  data.status === "Active" || data.status === "Verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : data.status === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    data.status === "Active" || data.status === "Verified"
                      ? "bg-emerald-500"
                      : data.status === "Pending"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-gray-500"
                  }`}
                />
                {data.status}
              </span>
              {isFreelancer && (
                <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-100 px-4 py-1.5 rounded-full shadow-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{data.rating || "4.9"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Grid Stats */}
          <div className={`grid grid-cols-1 ${data.status === "Pending" && isFreelancer ? "" : "md:grid-cols-3"} gap-6 mb-8`}>
            {/* Left Column - Stacked Cards (Hide for Pending Freelancers) */}
            {!(data.status === "Pending" && isFreelancer) && (
            <div className="flex flex-col gap-6">
              {/* Join Date Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-center h-27.5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-bold text-gray-800">Join Date</p>
                </div>
                <p className="text-xl font-black text-[#081f5c]">
                  {data.joinedDate || "N/A"}
                </p>
              </div>

              {/* Rank Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-center h-27.5">
                <div className="flex items-center gap-2 mb-1">
                  {isFreelancer ? (
                    <Award className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Building2 className="w-4 h-4 text-gray-500" />
                  )}
                  <p className="text-sm font-bold text-gray-800">
                    {isFreelancer ? "Rank" : "Industry"}
                  </p>
                </div>
                <p className="text-xl font-black text-[#081f5c]">
                  {isFreelancer ? data.rank || "Gold" : data.industry}
                </p>
              </div>
            </div>
            )}

            {/* Right Column - Large Contact Card */}
            <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm flex flex-col justify-center h-full min-h-57.5">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="text-base font-bold text-gray-800">
                  Contact Information
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold text-[#081f5c] border-b border-gray-200 pb-0.5 hover:text-orange-600 transition-colors cursor-pointer decoration-2 underline-offset-4">
                    {data.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold text-[#081f5c]">
                    {data.phone || "089876544567890"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio / About Section */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-[#081f5c] mb-4 uppercase tracking-widest opacity-80">
              About
            </h3>
            <p className="text-slate-600 leading-relaxed text-[15px] font-medium">
              {data.bio ||
                (isFreelancer
                  ? "Experienced professional with a demonstrated history of working in the technology industry. Skilled in UI/UX Design, Web Development, and Graphic Design. Strong arts and design professional."
                  : "Leading provider of innovative solutions in the local market. Committed to delivering high-quality products and services to our customers. Focused on sustainable growth and community development.")}
            </p>
          </div>

          {/* Portfolio / Website */}
          {isFreelancer ? (
            <div>
              <h3 className="text-xs font-black text-[#081f5c] mb-4 uppercase tracking-widest opacity-80">
                Portfolio & Resume
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 ring-2 ring-transparent hover:ring-orange-50 transition-all duration-300 group w-full cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#081f5c] text-sm group-hover:text-orange-600 transition-colors">
                      Portfolio Website
                    </p>
                    <p className="text-xs text-slate-400 font-medium cursor-pointer">
                      behance.net/portfolio
                    </p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 ring-2 ring-transparent hover:ring-blue-50 transition-all duration-300 group w-full cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#081f5c] text-sm group-hover:text-blue-600 transition-colors">
                      Download Resume
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      PDF, 2.4 MB
                    </p>
                  </div>
                </a>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xs font-black text-[#081f5c] mb-4 uppercase tracking-widest opacity-80">
                Business Details
              </h3>
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 shadow-sm flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#081f5c]">Company Website</p>
                    <p className="text-sm text-blue-600/80 font-semibold cursor-pointer hover:underline">
                      www.{data.companyName?.toLowerCase().replace(/\s/g, "")}
                      .com
                    </p>
                  </div>
                </div>
                <button className="w-full md:w-auto px-6 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border border-blue-100">
                  Visit Site
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm flex justify-end gap-3 rounded-b-[40px]">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all cursor-pointer"
          >
            Close
          </button>
          {data.status === "Pending" && (onApprove || onReject) ? (
            <>
              {onReject && (
                <button
                  onClick={onReject}
                  className="px-6 py-3 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50 transform hover:-translate-y-0.5 transition-all text-sm cursor-pointer flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              )}
              {onApprove && (
                <button
                  onClick={onApprove}
                  className="px-6 py-3 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transform hover:-translate-y-0.5 transition-all text-sm cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              )}
            </>
          ) : (
            <button
              className={`px-8 py-3 rounded-2xl font-bold text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transform hover:-translate-y-0.5 transition-all text-sm cursor-pointer ${ButtonColor}`}
            >
              {isFreelancer ? "Contact Freelancer" : "Contact Business"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
