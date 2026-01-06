"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface FormAssistData {
  name: string;
  address: string;
  phone: string;
  email: string;
  skills: string;
  professionalExperience: string;
  portfolioUrl: string;
}

export interface AssistMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  typing?: boolean;
}

interface ParsedData {
  success: boolean;
  data?: Partial<FormAssistData>;
  error?: string;
}

const ASSIST_STORAGE_KEY = "form_assist_history";

//  Parse user input in the format:

export const parseFormData = (input: string): ParsedData => {
  try {
    // Split by period followed by comma or just period at the end
    const parts = input
      .split(/\.\s*,\s*|\.\s*$/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length < 7) {
      return {
        success: false,
        error: `I need 7 pieces of information. You provided ${parts.length}. Please provide: Name., Address., Phone., Email., Skills., Experience., Portfolio URL`,
      };
    }

    const [name, address, phone, email, skills, experience, portfolio] = parts;

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const urlRegex = /^https?:\/\/.+/;

    if (!emailRegex.test(email)) {
      return {
        success: false,
        error:
          "Email format doesn't look right. Please provide a valid email address.",
      };
    }

    if (!phoneRegex.test(phone)) {
      return {
        success: false,
        error:
          "Phone number format doesn't look right. Please check and try again.",
      };
    }

    if (!urlRegex.test(portfolio)) {
      return {
        success: false,
        error: "Portfolio URL must start with http:// or https://",
      };
    }

    return {
      success: true,
      data: {
        name,
        address,
        phone,
        email,
        skills,
        professionalExperience: experience,
        portfolioUrl: portfolio,
      },
    };
  } catch {
    return {
      success: false,
      error:
        "I couldn't parse your data. Please follow the format: Name., Address., Phone., Email., Skills., Experience., Portfolio URL",
    };
  }
};

export const useBotAssist = (
  onFormFill?: (data: Partial<FormAssistData>) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AssistMessage[]>([
    {
      id: "help-1",
      text: "Hi! I'm your Form Assistant. I can help you fill out the registration form automatically!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "help-2",
      text: "Just provide your information in this format, separated by periods and commas:\n\nName., Address., Phone., Email., Skills., Experience., Portfolio URL",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "help-3",
      text: "Example:\nAlvin., Tebet Jakarta., 08123456789., alvin89@gmail.com., Figma & React., I work for tech companies., https://myportfolio.com/",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear history on mount (refresh)
  useEffect(() => {
    localStorage.removeItem(ASSIST_STORAGE_KEY);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const addBotMessage = useCallback((text: string, delay = 800) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        const botMessage: AssistMessage = {
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

      const userMessage: AssistMessage = {
        id: `user-${Date.now()}`,
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");

      // Parse the input
      const parseResult = parseFormData(inputValue);

      if (parseResult.success && parseResult.data) {
        // Success! Fill the form
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
      } else {
        // Error in parsing
        await addBotMessage(`Oops! ${parseResult.error}`, 800);
        await addBotMessage(
          "Try again following this format:\nName., Address., Phone., Email., Skills., Experience., Portfolio URL",
          1000
        );
      }
    },
    [inputValue, isTyping, addBotMessage, onFormFill]
  );

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
  };
};
