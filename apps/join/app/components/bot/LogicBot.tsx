"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { parseFormData } from "./assistant/BotAssist";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface FormAssistData {
  name: string;
  address: string;
  phone: string;
  email: string;
  skills: string;
  professionalExperience: string;
  portfolioUrl: string;
}

const STORAGE_KEY = "chatbot_history";

export const useChatbotLogic = (
  onFormFill?: (data: Partial<FormAssistData>) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear history from localStorage on initial mount (which happens on refresh/first visit)
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chatbot history:", error);
    }
  }, [messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addBotMessage = useCallback((text: string, delay = 800) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        resolve();
      }, delay);
    });
  }, []);

  const sendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!inputValue.trim() || isTyping) return;

      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      const userInput = inputValue;
      setInputValue("");

      // Check if user is asking for form filling help
      const formHelpKeywords = [
        "help me to fill a form",
        "help me fill a form",
        "fill a form",
        "fill the form",
        "form help",
        "assist with form",
      ];

      const isAskingFormHelp = formHelpKeywords.some((keyword) =>
        userInput.toLowerCase().includes(keyword)
      );

      if (isAskingFormHelp) {
        // User is asking for form filling help
        await addBotMessage(
          "I can help you fill out forms automatically. Just provide your information in this format:",
          600
        );
        await addBotMessage(
          "Name., Address., Phone., Email., Skills., Experience., Portfolio URL",
          800
        );
        await addBotMessage(
          "Example:\nAlvin., Tebet Jakarta., 08123456789., alvin89@gmail.com., Figma & React., I work for tech companies., https://myportfolio.com/",
          1000
        );
        return;
      }

      // Check if input looks like form data (contains multiple periods and commas)
      const hasFormDataPattern =
        (userInput.match(/\./g) || []).length >= 5 &&
        (userInput.match(/,/g) || []).length >= 4;

      if (hasFormDataPattern) {
        const parseResult = parseFormData(userInput);

        if (parseResult.success && parseResult.data) {
          // Form data detected
          await addBotMessage("Perfect! Let me parse that for you...", 600);
          await addBotMessage(
            `Successfully extracted:\n\n` +
              `Name: ${parseResult.data.name}\n` +
              `Address: ${parseResult.data.address}\n` +
              `Phone: ${parseResult.data.phone}\n` +
              `Email: ${parseResult.data.email}\n` +
              `Skills: ${parseResult.data.skills}\n` +
              `Experience: ${parseResult.data.professionalExperience}\n` +
              `Portfolio: ${parseResult.data.portfolioUrl}`,
            1000
          );

          await addBotMessage(
            "Great! I'm filling out the form for you now...",
            1200
          );

          // Fill the form
          if (onFormFill) {
            onFormFill(parseResult.data);
          }

          await addBotMessage(
            "Done! All fields have been filled. You can now review and submit your application!",
            1400
          );
        } else if (parseResult.error) {
          // Form data detected but with errors
          await addBotMessage(`Oops! ${parseResult.error}`, 800);
          await addBotMessage(
            "Try again following this format:\nName., Address., Phone., Email., Skills., Experience., Portfolio URL",
            1000
          );
        }
      } else {
        // Regular chat message - not form data
        await addBotMessage(
          "Thanks for your message! Our team will get back to you shortly.",
          1000
        );
      }
    },
    [inputValue, isTyping, addBotMessage, onFormFill]
  );

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
    isTyping,
    toggleChat,
    handleMouseEnter,
    handleMouseLeave,
    handleInputChange,
    sendMessage,
    setIsOpen,
  };
};
