"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Paperclip,
  MoreVertical,
  Briefcase,
  Smile,
  Check,
  CheckCheck,
  Loader2,
  WifiOff,
} from "lucide-react";
import { useProjectChat, UIMessage } from "../../../../chat/connection/ably";

interface UMKMChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string; // Required for Ably room
  userId: string;    // Current UMKM user's ID
  project?: {
    name: string;
    freelancer: {
      name: string;
      avatar?: string;
      status?: "online" | "offline";
    };
  };
}

export default function UMKMChatModal({
  isOpen,
  onClose,
  projectId,
  userId,
  project,
}: UMKMChatModalProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the Ably chat hook
  const { messages, sendMessage, isConnected, error } = useProjectChat(
    isOpen ? projectId : "", // Only connect when modal is open
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

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 w-screen h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-(--primary) font-bold text-lg border-2 border-white shadow-sm">
                {project.freelancer.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-(--primary)">
                {project.freelancer.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {isConnected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Connected
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Connecting...
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-(--primary) transition-all cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project Context Bar */}
        <div className="px-8 py-3 bg-blue-50/50 border-b border-blue-100/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Briefcase className="w-4 h-4 text-(--secondary)" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--primary) opacity-70 uppercase tracking-wider">
                Project Discussion
              </p>
              <p className="text-sm font-bold text-(--primary)">
                {project.name}
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 bg-white rounded-md text-blue-600 font-bold border border-blue-100">
            Live Chat
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#f8f9fc] custom-scrollbar relative">
          {/* Safety Notice */}
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-2 rounded-full border border-yellow-100 shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
              Please communicate with respect and professionalism.
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex justify-center mb-6">
              <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-full border border-red-100 shadow-sm flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length === 0 && isConnected && (
            <div className="flex justify-center text-gray-400 text-sm py-10">
              No messages yet. Start the conversation!
            </div>
          )}

          {messages.map((msg: UIMessage) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] group relative ${msg.isSelf ? "items-end" : "items-start"} flex flex-col`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.isSelf
                      ? "bg-(--primary) text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1.5 px-1">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.isSelf && (
                    <span className="text-gray-400">
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <button
              type="button"
              className="p-3 text-gray-400 hover:text-(--primary) hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-(--primary) focus-within:ring-2 focus-within:ring-(--primary)/10 transition-all flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected}
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3.5 text-sm text-(--primary) placeholder:text-gray-400 outline-none disabled:opacity-50"
              />
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-amber-500 transition-all cursor-pointer mr-1"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected}
              className="p-3.5 bg-(--primary) text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
