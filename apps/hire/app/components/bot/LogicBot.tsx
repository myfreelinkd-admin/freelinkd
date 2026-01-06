"use client";

import { useState, useEffect, useRef } from "react";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const useChatbotLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear history from localStorage on initial mount (refresh)
  useEffect(() => {
    localStorage.removeItem("chatbot_history");
  }, []);

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatbot_history", JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our team will get back to you shortly.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return {
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
    setIsOpen,
  };
};
