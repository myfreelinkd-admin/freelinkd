import React from "react";
import {
  Bot,
  BotMessageSquare,
  BotIcon,
  MessageCircle,
  MessageCircleCode,
} from "lucide-react";

const icons = [
  Bot,
  BotMessageSquare,
  BotIcon,
  MessageCircle,
  MessageCircleCode,
];

const ChatBackground = () => {
  // Create a pattern that covers enough space
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="flex flex-wrap content-start justify-center gap-3 p-4 w-[200%] h-[200%] -ml-[50%] -mt-[50%] transform -rotate-12 opacity-[0.05]">
        {Array.from({ length: 400 }).map((_, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="flex items-center justify-center w-10 h-10">
              <Icon size={18} className="text-var(--primary)" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBackground;
