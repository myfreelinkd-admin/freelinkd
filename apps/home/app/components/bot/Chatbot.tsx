"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChatbotLogic } from "./LogicBot";
import GreetingsBot from "./GreetingsBot";
import MobileBot from "./MobileBot";
import ChatBackground from "./ChatBackground";
import { Bot, X, Send } from "lucide-react";

const Chatbot = () => {
  const pathname = usePathname();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  const {
    isOpen,
    isHovered,
    inputValue,
    messages,
    messagesEndRef,
    toggleChat,
    handleMouseEnter,
    handleMouseLeave,
    handleInputChange,
    sendMessage,
  } = useChatbotLogic();

  // Detect scroll position to show/hide chatbot
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8;
      setIsScrolledPastHero(window.scrollY > heroHeight);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allowedPaths = ["/"];
  const isAllowed = allowedPaths.includes(pathname);

  if (!isAllowed) return null;

  return (
    <>
      {/* Mobile Full Screen View */}
      {isScrolledPastHero && (
        <MobileBot
          isOpen={isOpen}
          onClose={toggleChat}
          messages={messages}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSendMessage={sendMessage}
          messagesEndRef={messagesEndRef}
        />
      )}

      {/* Desktop Container */}
      <div
        className={`fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 font-sans transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isScrolledPastHero
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-20 scale-90 pointer-events-none"
        }`}
      >
        {/* Desktop Chat Window */}
        {isOpen && (
          <div className="hidden md:flex flex-col w-95 h-137.5 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up border border-gray-100 mb-2">
            {/* Header */}
            <div className="bg-(--primary) p-4 flex items-center justify-between text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Freelinkd AI
                  </h3>
                  <p className="text-xs text-gray-200 opacity-90">
                    Virtual Customer Service
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-[#f9fcff]">
              <ChatBackground />
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar z-10">
                <div className="text-center text-xs text-gray-400 my-2">
                  Today
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

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={sendMessage} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 bg-gray-50 rounded-full px-4 py-2.5 outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-(--primary) text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Floating Button & Greetings */}
        <div
          className="relative flex items-center justify-end"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <GreetingsBot isVisible={!isOpen && isHovered} />

          <button
            onClick={toggleChat}
            className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 z-50 cursor-pointer ${
              isOpen ? "bg-(--primary) rotate-90" : "bg-(--primary)"
            }`}
            aria-label="Toggle Chatbot"
          >
            {isOpen ? (
              <X size={32} color="white" />
            ) : (
              <Bot size={32} color="white" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
