"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  Camera,
  Trash2,
  Save,
  RotateCcw,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Dropdown } from "@repo/ui/dropdown";

export default function Preferences() {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nama_umkm: "",
    email: "",
    no_hp: "",
    industry: "",
    profile_image: "",
    currentPassword: "",
    newPassword: "",
  });

  const businessOptions = [
    { label: "Creative Agency", value: "creative" },
    { label: "Manufacturing", value: "manufacturing" },
    { label: "Retail & E-commerce", value: "retail" },
    { label: "Technology", value: "technology" },
    { label: "Franchise", value: "franchise" },
    { label: "Service", value: "service" },
  ];

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const storedUser =
          sessionStorage.getItem("umkm_user") || localStorage.getItem("umkm_user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        if (!user.email) {
          setLoading(false);
          return;
        }

        // Fetch fresh data from API
        const res = await fetch(`/api/umkm/profile?email=${user.email}`);
        const data = await res.json();

        if (data.success) {
          let incomingIndustry = data.data.profile.industry || "";
          
          // Normalize industry value to match dropdown options
          const matchedOption = businessOptions.find(
            opt => opt.value.toLowerCase() === incomingIndustry.toLowerCase() || 
                   opt.label.toLowerCase() === incomingIndustry.toLowerCase()
          );
          
          if (matchedOption) {
            incomingIndustry = matchedOption.value;
          }

          setFormData((prev) => ({
            ...prev,
            nama_umkm: data.data.profile.nama_umkm || "",
            email: data.data.email || "",
            no_hp: data.data.profile.no_hp || "",
            industry: incomingIndustry,
            profile_image: data.data.profile.profile_image || "",
          }));

          if (data.data.profile.profile_image) {
            setProfileImg(data.data.profile.profile_image);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (option: { label: string; value: string }) => {
    setFormData((prev) => ({ ...prev, industry: option.value }));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (optional but good practice)
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      setMessage({ type: "error", text: "Image size must be less than 2MB" });
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();

      if (data.success) {
        setProfileImg(data.url);
        setFormData(prev => ({ ...prev, profile_image: data.url }));
        setMessage({ type: "success", text: "Image uploaded! Click Save Changes to apply." });
      } else {
        setMessage({ type: "error", text: data.message || "Upload failed" });
      }
    } catch (error) {
       console.error("Upload error:", error);
       setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = () => {
    setProfileImg(null);
    setFormData(prev => ({ ...prev, profile_image: "" }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/umkm/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // Update local storage with new data
        const storedUser = sessionStorage.getItem("umkm_user") || localStorage.getItem("umkm_user");
        const storage = sessionStorage.getItem("umkm_user") ? sessionStorage : localStorage;
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const newData = {
             ...user,
             username: result.data.username,
             profile: result.data.profile
          };
          storage.setItem("umkm_user", JSON.stringify(newData));
        }

        // Clear password fields
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-(--secondary)" />
      </div>
    );
  }

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

      {message && (
        <div 
          className={`mb-6 p-4 rounded-xl border ${
            message.type === "success" 
              ? "bg-green-50 text-green-600 border-green-200" 
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Company Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
                  <input
                    type="text"
                    name="nama_umkm"
                    value={formData.nama_umkm}
                    onChange={handleChange}
                    placeholder="Company Name"
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
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed outline-none transition-all text-sm font-medium"
                    title="Email cannot be changed"
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
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="+62 812 3456 7890"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Business Type Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-(--primary) ml-1">
                  Business Type
                </label>
                <Dropdown
                  options={businessOptions}
                  value={formData.industry}
                  onSelect={handleDropdownSelect}
                  placeholder="Select Business Type"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                />
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
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
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
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium"
                />
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
                      {getInitials(formData.nama_umkm)}
                    </span>
                  )}
                </div>
                <div onClick={handleFileClick} className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleFileChange}
              />

              <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
                <button 
                  onClick={handleFileClick}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-(--secondary) text-white rounded-xl text-sm font-bold hover:bg-(--secondary)/90 transition-all cursor-pointer disabled:opacity-70"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4" />} 
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
                <button 
                  onClick={handleDeletePhoto}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete
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

        <button 
          onClick={() => window.location.reload()}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-2 rounded-xl group-hover:bg-gray-100 transition-colors">
            <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-(--primary)" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-(--primary) uppercase tracking-tighter">
            Undo
          </span>
        </button>

        <div className="h-12 w-px bg-gray-200 mx-2"></div>

        <button 
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex items-center gap-4 px-8 py-4 bg-(--secondary) text-white rounded-2xl font-bold shadow-lg shadow-(--secondary)/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="text-lg">{saving ? "Saving..." : "Save Changes"}</span>
          <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5 text-white" />}
          </div>
        </button>
      </div>
    </div>
  );
}
