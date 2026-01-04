"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  className = "",
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-6 py-4 text-left bg-gray-50 border border-gray-200 rounded-2xl
          focus:outline-none focus:ring-4 focus:ring-[#081f5c]/10 focus:border-[#081f5c]
          transition-all duration-300 ease-in-out
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed opacity-60"
              : "hover:bg-white hover:border-[#081f5c] cursor-pointer"
          }
          ${isOpen ? "bg-white ring-4 ring-[#081f5c]/10 border-[#081f5c]" : ""}
          flex items-center justify-between
        `}
      >
        <span
          className={`block truncate ${
            selectedDate ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-80 min-w-[320px] mt-2 bg-white border border-[#081f5c] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-[#081f5c]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-[#081f5c]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-0 px-2 py-2 bg-gray-50/50">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 p-3">
            {days.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => date && handleDateSelect(date)}
                disabled={!date}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-xl transition-all
                  ${date ? "cursor-pointer hover:bg-gray-100" : "cursor-default"}
                  ${
                    selectedDate &&
                    date &&
                    selectedDate.toDateString() === date.toDateString()
                      ? "bg-[#081f5c] text-white font-bold shadow-md hover:bg-[#061643]"
                      : "text-gray-700"
                  }
                  ${
                    date &&
                    date.toDateString() === new Date().toDateString() &&
                    !(
                      selectedDate &&
                      selectedDate.toDateString() === date.toDateString()
                    )
                      ? "text-[#ff6f00] font-bold bg-[#fff4ed]"
                      : ""
                  }
                `}
              >
                {date ? date.getDate() : ""}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <button
              type="button"
              onClick={goToToday}
              className="w-full py-3 px-4 bg-white border border-gray-200 hover:border-[#081f5c] hover:text-[#081f5c] text-gray-600 rounded-xl transition-all text-sm font-bold shadow-sm"
            >
              Hari Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
