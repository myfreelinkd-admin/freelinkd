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
} from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "client";
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface ProjectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    name: string;
    client: {
      name: string;
      avatar?: string;
      status?: "online" | "offline";
    };
  };
}

export default function ProjectChatModal({
  isOpen,
  onClose,
  project,
}: ProjectChatModalProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dummy messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "client",
      text: "Halo, saya tertarik dengan portofolio anda. Apakah bisa diskusi mengenai proyek UI/UX ini?",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: "2",
      sender: "me",
      text: "Halo! Tentu saja, dengan senang hati. Apa yang bisa saya bantu?",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: "3",
      sender: "client",
      text: "Saya butuh desain untuk aplikasi mobile marketplace UMKM. Apakah anda berpengalaman di bidang ini?",
      timestamp: "10:35 AM",
      status: "read",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--primary)/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-(--primary) font-bold text-lg border-2 border-white shadow-sm">
                {project.client.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-(--primary)">
                {project.client.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Online
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
            On Going
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

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] group relative ${msg.sender === "me" ? "items-end" : "items-start"} flex flex-col`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === "me"
                      ? "bg-(--primary) text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1.5 px-1">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {msg.timestamp}
                  </span>
                  {msg.sender === "me" && (
                    <span className="text-gray-400">
                      {msg.status === "read" ? (
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
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
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3.5 text-sm text-(--primary) placeholder:text-gray-400 outline-none"
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
              disabled={!newMessage.trim()}
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
