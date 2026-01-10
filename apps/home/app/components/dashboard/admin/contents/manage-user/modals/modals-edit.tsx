"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, MapPin, Briefcase, Building2, Save, ShieldCheck, AtSign } from "lucide-react";

interface UserData {
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
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData | null;
  type: "freelancer" | "umkm";
}

export default function EditUserModal({ isOpen, onClose, data, type }: EditUserModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<UserData>(data || {});

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!mounted || !isOpen) return null;

  const isFreelancer = type === "freelancer";
  const TitleIcon = isFreelancer ? User : Building2;
  const PrimaryColor = isFreelancer ? "text-orange-500" : "text-blue-600";
  const BgIconColor = isFreelancer ? "bg-orange-50" : "bg-blue-50";
  const RingColor = isFreelancer ? "focus:ring-orange-500/20" : "focus:ring-blue-500/20";
  const BorderColor = isFreelancer ? "focus:border-orange-500" : "focus:border-blue-500";
  const ButtonColor = isFreelancer ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700";
  const ShadowColor = isFreelancer ? "hover:shadow-orange-200" : "hover:shadow-blue-200";

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#081f5c]/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 w-full max-w-lg transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${BgIconColor} flex items-center justify-center shadow-inner`}>
              <TitleIcon className={`w-7 h-7 ${PrimaryColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#081f5c]">
                Edit {isFreelancer ? "Freelancer" : "UMKM"}
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                Update profile information and status
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
           {/* Name / Company Name */}
           <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
               {isFreelancer ? "Full Name" : "Company Name"}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {isFreelancer ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <input 
                type="text"
                value={isFreelancer ? formData.name || "" : formData.companyName || ""}
                onChange={(e) => handleChange(isFreelancer ? "name" : "companyName", e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[#081f5c] font-bold focus:outline-none focus:ring-4 ${RingColor} ${BorderColor} transition-all`}
                placeholder={isFreelancer ? "Enter full name" : "Enter company name"}
              />
            </div>
          </div>

          {/* Email / Owner */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
              {isFreelancer ? "Email Address" : "Owner Name"}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                 {isFreelancer ? <Mail className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <input 
                type="text"
                value={isFreelancer ? formData.email || "" : formData.owner || ""}
                onChange={(e) => handleChange(isFreelancer ? "email" : "owner", e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[#081f5c] font-bold focus:outline-none focus:ring-4 ${RingColor} ${BorderColor} transition-all`}
                placeholder={isFreelancer ? "name@example.com" : "Enter owner name"}
              />
            </div>
          </div>

           {/* Role / Industry */}
           <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
              {isFreelancer ? "Professional Role" : "Industry Sector"}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <input 
                type="text"
                value={isFreelancer ? formData.role || "" : formData.industry || ""}
                onChange={(e) => handleChange(isFreelancer ? "role" : "industry", e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[#081f5c] font-bold focus:outline-none focus:ring-4 ${RingColor} ${BorderColor} transition-all`}
                placeholder={isFreelancer ? "e.g. UI/UX Designer" : "e.g. Technology"}
              />
            </div>
          </div>

          {/* Location */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
              Location
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input 
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[#081f5c] font-bold focus:outline-none focus:ring-4 ${RingColor} ${BorderColor} transition-all`}
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Status & Rank/Verification */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
               <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
                  Status
               </label>
               <div className="relative">
                 <select 
                   value={formData.status || "Active"}
                   onChange={(e) => handleChange("status", e.target.value)}
                   className={`w-full pl-4 pr-10 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[#081f5c] font-bold appearance-none focus:outline-none focus:ring-4 ${RingColor} ${BorderColor} transition-all cursor-pointer`}
                 >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
               </div>
            </div>
            
            <div className="group">
               <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">
                  {isFreelancer ? "Rank" : "Verification"}
               </label>
               <div className="relative">
                 <select 
                   value={isFreelancer ? formData.rank || "Classic" : formData.status || "Pending"}
                   onChange={(e) => handleChange(isFreelancer ? "rank" : "status", e.target.value)}
                   className={`w-full pl-4 pr-10 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[#081f5c] font-bold appearance-none focus:outline-none focus:ring-4 ${RingColor} ${BorderColor} transition-all cursor-pointer`}
                 >
                    {isFreelancer ? (
                       <>
                        <option value="Classic">Classic</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                       </>
                    ) : (
                       <>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                       </>
                    )}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <AtSign className="w-5 h-5" />
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center gap-3">
           <button 
             onClick={onClose}
             className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer"
           >
             Cancel
           </button>
           <button 
             className={`flex-2 py-4 rounded-2xl font-bold text-white shadow-lg shadow-gray-200 ${ShadowColor} hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer ${ButtonColor}`}
           >
             <Save className="w-5 h-5" />
             Save Changes
           </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
