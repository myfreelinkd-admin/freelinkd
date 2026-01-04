"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Trash2,
  Save,
  RotateCcw,
  X,
  Upload,
  Globe,
  Cpu,
  Plus,
  Hash,
} from "lucide-react";
import Image from "next/image";

export default function Preferences() {
  const [profileImg] = useState<string | null>(null);
  const [userName] = useState("UMKM 1234");

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const [skills, setSkills] = useState([
    "UI/UX Design",
    "React",
    "Tailwind CSS",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--primary)">
          Account Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your business profile and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Row: Info + Skills on left, Profile on right */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="text"
                    placeholder="Freelancer Name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Freelancer ID Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Freelancer ID
                </label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="text"
                    placeholder="FL-2026-001"
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
                    placeholder="freelancer@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Portfolio URL Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Portfolio / Website URL
                </label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="url"
                    placeholder="https://yourportfolio.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Expertise Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-(--primary) mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-(--secondary)" /> Skills & Expertise
            </h3>
            <div className="space-y-4">
              <div className="relative group">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Add a skill (Press Enter)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-4 py-2 bg-(--alternative)/50 text-(--primary) rounded-xl text-xs font-bold border border-transparent hover:border-(--secondary)/30 transition-all group"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Profile Picture */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center h-full flex flex-col justify-center">
            <label className="text-sm font-bold text-(--primary) block mb-6">
              Profile Picture
            </label>

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
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-(--primary) text-white rounded-xl text-sm font-bold hover:bg-(--primary)/90 transition-all cursor-pointer">
                <Upload className="w-4 h-4" /> Upload Photo
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all cursor-pointer">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>

            <p className="text-[10px] text-gray-400 mt-8">
              Allowed JPG, GIF or PNG. Max size of 2MB
            </p>
          </div>
        </div>

        {/* Bottom Row: Password on left */}
        <div className="lg:col-span-2">
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
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
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
            Undo
          </span>
        </button>

        <div className="h-12 w-px bg-gray-200 mx-2"></div>

        <button className="flex items-center gap-4 px-8 py-4 bg-(--primary) text-white rounded-2xl font-bold shadow-lg shadow-(--primary)/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
          <span className="text-lg">Save Changes</span>
          <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/50">
            <Save className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
