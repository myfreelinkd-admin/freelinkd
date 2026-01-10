"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Paperclip,
  Smile,
  Users,
  Loader2,
  WifiOff,
  CheckCheck,
} from "lucide-react";
import { useGroupChat, UIMessage } from "../../../../../chat/connection/ably";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
}

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  userId: string;
  group: {
    id: string;
    name: string;
    icon?: string;
  };
  members: Member[];
}

export default function GroupChatModal({
  isOpen,
  onClose,
  groupId,
  userId,
  group,
  members,
}: GroupChatModalProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the Ably group chat hook
  const { messages, sendMessage, isConnected, error } = useGroupChat(
    isOpen ? groupId : "",
    userId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    await sendMessage(newMessage);
    setNewMessage("");
  };

  // Helper to get member name by ID
  const getMemberName = (senderId: string): string => {
    const member = members.find(m => m.id === senderId);
    return member?.name || "Unknown";
  };

  const getMemberInitial = (senderId: string): string => {
    const name = getMemberName(senderId);
    return name.charAt(0).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 w-screen h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex animate-in fade-in zoom-in duration-300">
        
        {/* LEFT SIDE: Members List */}
        <div className="w-72 bg-gray-50/50 border-r border-gray-100 flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-(--primary) flex items-center gap-2">
              <Users className="w-5 h-5 text-(--secondary)" />
              {group.name}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {members.length} Members
            </p>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                      member.role === "Owner" ? "bg-(--secondary)" : "bg-blue-300"
                    }`}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {member.role || (member.isOnline ? "Online" : "Offline")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Chat Room */}
        <div className="flex-1 flex flex-col h-full bg-[#FAFBFF]">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-(--primary)/5 flex items-center justify-center text-(--primary)">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">General Chat</h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  {isConnected ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                      Connected
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Connecting...
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {/* Error State */}
            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-full border border-red-100 shadow-sm flex items-center gap-2">
                  <WifiOff className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}

            {/* Empty State */}
            {messages.length === 0 && isConnected && (
              <div className="flex justify-center text-gray-400 text-sm py-10">
                No messages yet. Start the conversation!
              </div>
            )}

            {/* Messages */}
            {messages.map((msg: UIMessage) => (
              <div
                key={msg.id}
                className={`flex ${msg.isSelf ? "justify-end" : "justify-start"} gap-2`}
              >
                {/* Avatar for others */}
                {!msg.isSelf && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    {getMemberInitial(msg.senderId)}
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] ${msg.isSelf ? "items-end" : "items-start"} flex flex-col`}
                >
                  {/* Sender Name (for others) */}
                  {!msg.isSelf && (
                    <span className="text-[10px] text-gray-400 mb-1 px-1 font-medium">
                      {getMemberName(msg.senderId)}
                    </span>
                  )}
                  
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.isSelf
                        ? "bg-(--primary) text-white rounded-tr-sm"
                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.isSelf && (
                      <CheckCheck className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-(--secondary) focus-within:ring-4 focus-within:ring-(--secondary)/5 transition-all"
            >
              <button
                type="button"
                className="p-2.5 text-gray-400 hover:text-(--secondary) hover:bg-white rounded-full transition-all shrink-0 cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                disabled={!isConnected}
                className="flex-1 bg-transparent border-none outline-none py-2.5 text-sm text-gray-700 placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                type="button"
                className="p-2.5 text-gray-400 hover:text-(--secondary) hover:bg-white rounded-full transition-all shrink-0 cursor-pointer"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="p-2.5 bg-(--secondary) text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
