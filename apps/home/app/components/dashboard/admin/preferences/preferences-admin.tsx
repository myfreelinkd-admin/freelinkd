"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Trash2,
  Save,
  RotateCcw,
  X,
  Upload,
  ShieldAlert,
  Bell,
  Globe,
  Monitor,
} from "lucide-react";
import Image from "next/image";

export default function PreferencesAdmin() {
  const [profileImg] = useState<string | null>(null);
  const [userName] = useState("Admin");

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--primary)">
          Admin Preferences
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal settings and system configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-(--primary) mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-(--secondary)" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="text"
                    placeholder="Admin Name"
                    defaultValue="Admin User"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@freelinkd.com"
                    defaultValue="admin@freelinkd.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Role Field - Read Only for Admin */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Access Role
                </label>
                <div className="relative group">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value="Super Admin"
                    readOnly
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent text-gray-500 cursor-not-allowed outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Password Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-(--primary) mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-(--secondary)" /> Security &
              Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Current Password
                </label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                    <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  New Password
                </label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                    <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Profile Picture */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center h-full flex flex-col">
            <label className="text-sm font-bold text-(--primary) block mb-6">
              Profile Picture
            </label>

            <div className="flex-1 flex flex-col justify-center">
              <div className="relative w-48 h-48 mx-auto mb-8 group">
                <div className="w-full h-full rounded-3xl overflow-hidden ring-4 ring-(--alternative) group-hover:ring-(--secondary)/20 transition-all duration-300 flex items-center justify-center bg-(--alternative)/50">
                  {profileImg ? (
                    <Image
                      src={profileImg}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-(--primary)">
                      {getInitials(userName)}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-(--secondary) text-white rounded-xl text-sm font-bold hover:bg-(--secondary)/90 transition-all cursor-pointer shadow-lg shadow-(--secondary)/20">
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-8">
              Allowed JPG, GIF or PNG. Max size of 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-end gap-6">
        <button className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-2 rounded-xl group-hover:bg-red-50 transition-colors">
            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-red-500 uppercase tracking-tighter">
            Cancel
          </span>
        </button>

        <button className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="p-2 rounded-xl group-hover:bg-gray-100 transition-colors">
            <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-(--primary)" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-(--primary) uppercase tracking-tighter">
            Reset
          </span>
        </button>

        <div className="h-12 w-px bg-gray-200 mx-2"></div>

        <button className="flex items-center gap-4 px-8 py-4 bg-(--secondary) text-white rounded-2xl font-bold shadow-lg shadow-(--secondary)/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
          <span className="text-lg">Save Config</span>
          <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/50">
            <Save className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
