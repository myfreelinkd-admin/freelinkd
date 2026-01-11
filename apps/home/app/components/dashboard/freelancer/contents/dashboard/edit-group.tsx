"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Camera,
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import Image from "next/image";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any;
  onSuccess?: () => void;
}

export default function EditGroupModal({
  isOpen,
  onClose,
  group,
  onSuccess,
}: EditGroupModalProps) {
  const [name, setName] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [skills, setSkills] = useState<string[]>([]);
  const [icon, setIcon] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with group data
  useEffect(() => {
    if (group) {
      setName(group.name || "");
      setMaxMembers(group.maxMembers || 5);
      setSkills(group.skills || []);
      setIcon(group.icon || "");
    }
  }, [group]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill) && skills.length < 10) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage("Group name is required");
      return;
    }

    setStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch("/api/freelancer/group/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id || group._id,
          name: name.trim(),
          maxMembers,
          skills,
          icon: icon || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          setStatus("idle");
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to update group");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred");
    }
  };

  if (!isOpen) return null;

  const currentMemberCount = 1 + (group?.members?.length || 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={status !== "saving" ? onClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden"
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
                  Group Updated!
                </h2>
                <p className="text-gray-500 text-sm">
                  Your group settings have been saved successfully.
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
                  Update Failed
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

          {/* Form State */}
          {(status === "idle" || status === "saving") && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0B1C46]">
                  Preferences
                </h2>
                <button
                  onClick={onClose}
                  disabled={status === "saving"}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Group Icon */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden shadow-lg ring-4 ring-white cursor-pointer group"
                  >
                    {icon ? (
                      <Image
                        src={icon}
                        alt="Group Icon"
                        fill
                        className="object-cover"
                        unoptimized={icon.startsWith("data:")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B1C46] to-[#1a3a7c]">
                        <span className="text-white text-4xl font-bold">
                          {name.charAt(0).toUpperCase() || "G"}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Click to change group icon
                  </p>
                </div>

                {/* Group Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-[#0B1C46] focus:ring-2 focus:ring-[#0B1C46]/10 outline-none transition-all"
                  />
                </div>

                {/* Max Members */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Maximum Members
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={currentMemberCount}
                      max={20}
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B1C46]"
                    />
                    <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl min-w-[80px] justify-center">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        {maxMembers}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Currently {currentMemberCount} member(s) in the group
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Group Skills (Max 10)
                  </label>

                  {/* Skill Tags */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="p-0.5 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Skill Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type a skill and press Enter..."
                      disabled={skills.length >= 10}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-[#0B1C46] focus:ring-2 focus:ring-[#0B1C46]/10 outline-none transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={skills.length >= 10 || !skillInput.trim()}
                      className="px-4 py-3 bg-[#0B1C46] text-white rounded-xl hover:bg-[#152c66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Press Enter or click + to add a skill
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={status === "saving"}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={status === "saving" || !name.trim()}
                  className="flex-1 py-3 bg-[#0B1C46] hover:bg-[#152c66] text-white font-medium rounded-2xl transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === "saving" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
