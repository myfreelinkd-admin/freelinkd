"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onSelect?: (option: DropdownOption) => void;
  className?: string;
  leftIcon?: React.ReactNode;
  buttonClassName?: string;
  menuPosition?: "top" | "bottom";
}

export const Dropdown = ({
  options,
  placeholder = "Choose One",
  value,
  onSelect,
  className = "",
  leftIcon,
  buttonClassName,
  menuPosition = "bottom",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with value prop if provided
  useEffect(() => {
    if (typeof value !== "undefined") {
      const option = options.find((opt) => opt.value === value) || null;
      setSelectedOption(option);
    }
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName
            ? buttonClassName
            : `w-full flex items-center justify-between text-left transition-all duration-200 outline-none cursor-pointer
          ${
            isOpen
              ? "bg-white border-[#ff6f00] ring-1 ring-[#ff6f00]/20"
              : "bg-[#efefef]/30 border-transparent hover:bg-[#efefef]/50"
          } border rounded-xl px-4 py-3`
        }
      >
        <div className="flex items-center gap-3">
          {leftIcon && (
            <div
              className={`transition-colors duration-200 ${isOpen ? "text-[#ff6f00]" : "text-gray-400"}`}
            >
              {leftIcon}
            </div>
          )}
          <span
            className={`text-sm font-medium ${selectedOption ? "text-[#081f5c]" : "text-gray-400"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#ff6f00]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden ${
            menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2.5 text-left hover:bg-[#ff6f00]/5 hover:text-[#ff6f00] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span
                className={`text-sm font-medium ${selectedOption?.value === option.value ? "text-[#ff6f00]" : "text-gray-600"}`}
              >
                {option.label}
              </span>
              {selectedOption?.value === option.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff6f00]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
