"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Search,
  Users,
  Check,
  MoreVertical,
  Settings,
  UserPlus,
  Link2,
} from "lucide-react";
import Image from "next/image";
import EditGroupModal from "./edit-group";
import InvitePeopleModal from "@/app/components/invitation/modals/invite-people";


interface Member {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
}

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any;
  onLeave?: () => void;
}

export default function GroupDetailsModal({
  isOpen,
  onClose,
  group,
  onLeave,
}: GroupDetailsModalProps) {
  const [message, setMessage] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [messages, setMessages] = useState<{id: number; senderId: string; text: string; time: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Dropdown and modal states
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen || !group) return null;

  const handleLeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    setIsLeaving(true);
    try {
      const storage = localStorage.getItem("freelancer_user")
        ? localStorage
        : sessionStorage;
      const storedUser = storage.getItem("freelancer_user");
      let id = "";

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        id = parsedUser.id;
      }

      if (!id) return;

      const response = await fetch("/api/freelancer/group", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freelancerId: id }),
      });

      if (response.ok) {
        if (onLeave) onLeave();
        onClose();
      } else {
        alert("Failed to leave group");
      }
    } catch (error) {
      console.error("Leave group error", error);
      alert("An error occurred");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const link = `${origin}/freelancer/group/join/${group.id}`;
    
    navigator.clipboard.writeText(link).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const members: Member[] = [];

  if (group.ownerDetails) {
    members.push({
      id: group.ownerDetails.id,
      name: group.ownerDetails.name || "Owner",
      role: "Owner",
      isOnline: true,
      avatar: group.ownerDetails.avatar,
    });
  }

  if (group.memberDetails) {
    group.memberDetails.forEach((m: any, i: number) => {
      members.push({
        id: m.id,
        name: m.name || `Member ${i + 1}`,
        role: m.role || "Member",
        isOnline: false,
        avatar: m.avatar,
      });
    });
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      senderId: "me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 w-screen h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 ring-1 ring-gray-200">
        {/* LEFT SIDEBAR: Members List */}
        <div className="w-full md:w-80 bg-gray-50/50 border-r border-gray-100 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-(--primary) flex items-center gap-2">
              <Users className="w-5 h-5 text-(--secondary)" />
              General Chat
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {members.length} Members •{" "}
              {members.filter((m) => m.isOnline).length} Online
            </p>
          </div>

          {/* Search Members */}
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
            {members.map((member) => (
              <div
                key={member.id}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-100 transition-all cursor-pointer"
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${member.role === "Owner" ? "bg-(--secondary)" : "bg-blue-300"}`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-700 truncate group-hover:text-(--secondary) transition-colors">
                      {member.name}
                    </p>
                    {member.role === "Owner" && (
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                        OWNER
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {member.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Settings / Leave Group could go here */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLeaveGroup}
              disabled={isLeaving}
              className="w-full py-2.5 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLeaving ? "Leaving..." : "Leave Group"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Chat Room */}
        <div className="flex-1 flex flex-col h-full bg-[#FAFBFF]">
          {/* Chat Header */}
          <div className="h-20 px-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-(--primary)/5 flex items-center justify-center text-(--primary)">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{group.name}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                  Active now
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Options Menu */}
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-(--secondary) transition-all cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {showOptionsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Group Preferences */}
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowEditModal(true);
                      }}
                      className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Preferences</span>
                    </button>

                    <div className="h-px bg-gray-100" />

                    {/* Invite People */}
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowInviteModal(true);
                      }}
                      className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Invite People</span>
                    </button>

                    <div className="h-px bg-gray-100" />

                    {/* Share Link Group */}
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        handleCopyLink();
                      }}
                      className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCopied ? 'bg-green-50' : 'bg-purple-50'}`}>
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Link2 className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <span className="font-medium text-gray-700">
                        {isCopied ? "Link Copied!" : "Share Link Group"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors ml-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
            <div className="text-center py-4">
              <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                Today
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.senderId === "me";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${isMe ? "bg-(--secondary)" : "bg-gray-400"}`}
                  >
                    {isMe ? "Me" : "O"}
                  </div>
                  <div className={`max-w-[70%] group`}>
                    <div
                      className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        isMe
                          ? "bg-(--secondary) text-white rounded-tr-none"
                          : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={`text-[10px] text-gray-400 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? "text-right" : ""}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-end gap-2 bg-gray-50 p-2 rounded-[24px] border border-gray-200 focus-within:border-(--secondary) focus-within:ring-4 focus-within:ring-(--secondary)/5 transition-all"
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none py-3 min-h-[44px] max-h-32 text-sm text-gray-700 resize-none placeholder:text-gray-400"
                rows={1}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-3 bg-(--secondary) text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shrink-0 mb-0.5 mr-0.5 cursor-pointer"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        group={group}
        onSuccess={onLeave}
      />

      {/* Invite People Modal */}
      <InvitePeopleModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        groupId={group?.id || group?._id || ""}
        groupName={group?.name || "Group"}
        currentMembers={[group?.ownerId, ...(group?.members || [])]}
        onSuccess={onLeave}
      />
    </div>
  );
}
