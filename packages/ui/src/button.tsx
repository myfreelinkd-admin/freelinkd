"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({
  children,
  className = "",
  appName,
  onClick,
  disabled = false,
}: ButtonProps) => {
  const defaultStyles =
    "bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-[10px_20px_10px_20px] text-xl transition-colors duration-200";

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else if (appName) {
      alert(`Hello from your ${appName} app!`);
    }
  };

  return (
    <button 
      className={`${defaultStyles} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} 
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
