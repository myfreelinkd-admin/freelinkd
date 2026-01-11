"use client";

import { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Preferences() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
        const storedUser = storage.getItem("freelancer_user");
        let id = "";
        
        if (storedUser) {
           const parsedUser = JSON.parse(storedUser);
           id = parsedUser.id;
           setUserId(id);
        }

        if (!id) return;

        const response = await fetch(`/api/freelancer/profile?id=${id}`);
        if (response.ok) {
           const data = await response.json();
           if (data.success && data.data) {
             const user = data.data;
             setFullName(user.name || "");
             setFreelancerId(user.freelancerId || "");
             setEmail(user.email || "");
             setPhone(user.phone || "");
             setPortfolioUrl(user.portfolioUrl || "");
             setSkills(user.skills || []);
             setProfileImg(user.photoUrl);
           }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed" });
        return;
    }

    // Check size < 2MB
    if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: "Image size must be less than 2MB" });
        return;
    }

    if (!userId) {
        setMessage({ type: 'error', text: "User ID not found. Please refresh the page." });
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("freelancerId", userId);

    try {
        // Use the new freelancer upload-photo API that saves to AstraDB as base64
        const response = await fetch("/api/freelancer/upload-photo", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            setProfileImg(data.url);
            
            // Update local storage immediately
            const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
            const storedUser = JSON.parse(storage.getItem("freelancer_user") || "{}");
            storedUser.photoUrl = data.url;
            storage.setItem("freelancer_user", JSON.stringify(storedUser));
            
            // Trigger storage event to update sidebar
            window.dispatchEvent(new Event("storage"));
            
            setMessage({ type: 'success', text: "Image uploaded and saved successfully!" });
        } else {
            setMessage({ type: 'error', text: data.message || "Upload failed" });
        }
    } catch (err) {
        console.error("Upload error", err);
        setMessage({ type: 'error', text: "Failed to upload image" });
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);

    const payload: any = {
        id: userId,
        name: fullName,
        email,
        phone,
        portfolioUrl,
        skills,
        freelancerId,
        photoUrl: profileImg
    };

    if (newPassword) {
        // ideally validated against currentPassword if strict, omitting for now
        payload.password = newPassword;
    }

    try {
        const response = await fetch("/api/freelancer/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (data.success) {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setNewPassword("");
            setCurrentPassword("");
            // Update local storage if name/email changed to keep consistency?
            const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
            const storedUser = JSON.parse(storage.getItem("freelancer_user") || "{}");
            storedUser.username = fullName;
            storedUser.email = email;
            storage.setItem("freelancer_user", JSON.stringify(storedUser));
        } else {
            setMessage({ type: 'error', text: data.error || "Update failed." });
        }
    } catch (error) {
        console.error("Save error:", error);
        setMessage({ type: 'error', text: "An error occurred while saving." });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading profile settings...</div>;
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
        
        {message && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message.text}
            </div>
        )}
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    value={freelancerId}
                    onChange={(e) => setFreelancerId(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="freelancer@example.com"
                    disabled
                    readOnly
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed outline-none text-sm font-medium"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
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
                    unoptimized={profileImg.startsWith("data:")}
                  />
                ) : (
                  <span className="text-6xl font-bold text-(--primary)">
                    {getInitials(fullName)}
                  </span>
                )}
              </div>
              <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="text-white w-8 h-8" />
                <input 
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
              <label htmlFor="profile-upload-btn" className="flex items-center justify-center gap-2 w-full py-3 bg-(--secondary) text-white rounded-xl text-sm font-bold hover:bg-(--secondary)/90 transition-all cursor-pointer">
                <Upload className="w-4 h-4" /> Upload Photo
                <input 
                    id="profile-upload-btn"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
              </label>
              <button 
                onClick={() => setProfileImg(null)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all cursor-pointer">
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
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
        <button 
            onClick={() => router.back()}
            className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-2 rounded-xl group-hover:bg-red-50 transition-colors">
            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-red-500 uppercase tracking-tighter">
            Cancel
          </span>
        </button>

        <button 
             onClick={() => {
                // Fetch again or reset to defaults
                window.location.reload();
             }}
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
            disabled={saving}
            className="flex items-center gap-4 px-8 py-4 bg-(--secondary) text-white rounded-2xl font-bold shadow-lg shadow-(--secondary)/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-70"
        >
          <span className="text-lg">{saving ? "Saving..." : "Save Changes"}</span>
          {!saving && (
          <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white/50">
            <Save className="w-5 h-5 text-white" />
          </div>
          )}
        </button>
      </div>
    </div>
  );
}
