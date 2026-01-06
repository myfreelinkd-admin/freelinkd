"use client";

import React from "react";
import { Message } from "./LogicBot";
import { Bot, X, Send } from "lucide-react";
import ChatBackground from "./ChatBackground";

interface MobileBotProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MobileBot: React.FC<MobileBotProps> = ({
  isOpen,
  onClose,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  messagesEndRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-white flex flex-col md:hidden animate-slide-in-up">
      {/* Header */}
      <div className="bg-(--primary) px-4 py-3 flex items-center justify-between text-white shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Freelinkd AI</h3>
            <p className="text-xs text-gray-200 opacity-90">
              Virtual Customer Service
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-[#f9fcff]">
        <ChatBackground />
        <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
          <div className="text-center text-xs text-gray-400 my-4">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-(--primary) text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1 text-right ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe">
        <form onSubmit={onSendMessage} className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={onInputChange}
              placeholder="Type your message"
              className="w-full border border-gray-300 rounded-full px-4 py-3 pr-10 outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-11 h-11 bg-(--primary) text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileBot;
