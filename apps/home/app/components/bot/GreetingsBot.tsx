"use client";

import React from "react";

interface GreetingsBotProps {
  isVisible: boolean;
}

const GreetingsBot: React.FC<GreetingsBotProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-2 right-20 mr-2 whitespace-nowrap transition-opacity duration-300 ease-in-out animate-slide-in-right">
      <div className="bg-(--secondary) text-white px-5 py-2.5 rounded-full shadow-lg relative flex items-center">
        <span className="font-medium text-sm">Need Help?</span>
        {/* Triangle/Tail pointing right */}
        <div
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 
          border-t-8 border-t-transparent
          border-l-10 border-l-(--secondary)
          border-b-8 border-b-transparent"
        ></div>
      </div>
    </div>
  );
};

export default GreetingsBot;
