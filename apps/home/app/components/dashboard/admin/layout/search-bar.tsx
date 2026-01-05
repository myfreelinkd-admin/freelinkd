"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
  placeholder = "Search for projects, freelancers, or tasks...",
}: {
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative w-full max-w-md transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}
    >
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-(--secondary)" : "text-gray-400"}`}
      >
        <Search className="w-4 h-4" />
      </div>
      <input
        value={q}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 outline-none border ${
          isFocused
            ? "bg-white border-(--secondary) shadow-lg shadow-(--secondary)/5 text-(--primary)"
            : "bg-white/50 border-gray-100 hover:border-gray-200 text-gray-600"
        }`}
        aria-label="Search"
      />
      {q && (
        <button
          onClick={() => setQ("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-(--primary) text-xs font-medium px-2 py-1"
        >
          Clear
        </button>
      )}
    </div>
  );
}
