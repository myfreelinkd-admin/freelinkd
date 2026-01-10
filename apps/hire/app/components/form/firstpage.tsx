"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { FormData } from "../../form/page";
import { sanitizeInput } from "../../utils/sanitize";
import { searchJobs, Skill } from "../logic/recomend-job";

interface FirstPageProps {
  onNext?: () => void;
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
}

export default function FirstPage({
  onNext,
  formData,
  updateFormData,
}: FirstPageProps) {
  // State untuk skill search
  const [skillInput, setSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<Skill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const skillInputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Parse existing skills from formData on mount
  useEffect(() => {
    if (formData.skills) {
      const existingSkills = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      setSelectedSkills(existingSkills);
    }
  }, []);

  // Update formData when selectedSkills changes
  useEffect(() => {
    updateFormData({ skills: selectedSkills.join(", ") });
  }, [selectedSkills]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: sanitizeInput(value) });
  };

  // Handle skill input change dengan fuzzy search
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInput(value);
    setHighlightedIndex(-1);

    if (value.trim().length > 0) {
      const results = searchJobs(value, 8);
      // Filter out already selected skills
      const filteredResults = results.filter(
        (skill) => !selectedSkills.includes(skill.name)
      );
      setSkillSuggestions(filteredResults);
      setShowSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a skill from suggestions
  const handleSelectSkill = (skill: Skill) => {
    if (!selectedSkills.includes(skill.name)) {
      setSelectedSkills([...selectedSkills, skill.name]);
    }
    setSkillInput("");
    setSkillSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    skillInputRef.current?.focus();
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || skillSuggestions.length === 0) {
      if (e.key === "Enter" && skillInput.trim()) {
        e.preventDefault();
        if (!selectedSkills.includes(skillInput.trim())) {
          setSelectedSkills([...selectedSkills, skillInput.trim()]);
        }
        setSkillInput("");
        setShowSuggestions(false);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < skillSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectSkill(skillSuggestions[highlightedIndex]);
        } else if (skillInput.trim()) {
          // Add custom skill
          if (!selectedSkills.includes(skillInput.trim())) {
            setSelectedSkills([...selectedSkills, skillInput.trim()]);
          }
          setSkillInput("");
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4">
      {/* Header Text */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tell Us About Your Project
        </h2>
        <p className="text-gray-600">
          Help us understand your project requirements and business needs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Information Section */}
        <section>
          <h3 className="text-xl font-bold text-center mb-6">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Name or Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                placeholder="enter your full name or business name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Project Information Section */}
        <section>
          <h3 className="text-xl font-bold text-center mb-6">
            Project Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                placeholder="Enter Job Title (e.g. UI/UX Design)"
              />
            </div>

            {/* Skills Field with Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-bold mb-2">
                Skills <span className="text-red-500">*</span>
              </label>
              
              {/* Selected Skills Tags */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#081f5c] to-[#0a2a7a] text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                        aria-label={`Remove ${skill}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <input
                  ref={skillInputRef}
                  type="text"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (skillInput.trim().length > 0 && skillSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                  placeholder={
                    selectedSkills.length > 0
                      ? "Add more skills..."
                      : "Search skills (e.g. UI, React, Python)"
                  }
                />
                
                {/* Search Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && skillSuggestions.length > 0 && (
                <div
                  ref={suggestionRef}
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    animation: "slideDown 0.2s ease-out",
                  }}
                >
                  <div className="py-2 max-h-[280px] overflow-y-auto">
                    {skillSuggestions.map((skill, index) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSelectSkill(skill)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full px-6 py-3.5 text-left transition-all duration-150 flex items-center justify-between group ${
                          highlightedIndex === index
                            ? "bg-gradient-to-r from-[#081f5c]/10 to-[#081f5c]/5"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`font-semibold text-[15px] ${
                              highlightedIndex === index
                                ? "text-[#081f5c]"
                                : "text-gray-900"
                            }`}
                          >
                            {skill.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {skill.category}
                          </span>
                        </div>
                        <div
                          className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                            highlightedIndex === index ? "opacity-100" : ""
                          }`}
                        >
                          <svg
                            className="w-5 h-5 text-[#081f5c]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Footer hint */}
                  <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">
                        ↑↓
                      </kbd>
                      <span>to navigate</span>
                      <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">
                        Enter
                      </kbd>
                      <span>to select</span>
                      <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">
                        Esc
                      </kbd>
                      <span>to close</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden input for form validation */}
              <input
                type="hidden"
                name="skills"
                value={formData.skills}
                required
              />
              
              {/* Helper text */}
              {selectedSkills.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Start typing to see skill suggestions, or press Enter to add custom skills
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
                placeholder="Describe your project requirements, goals, timeline, and any specific needs..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Additional Requirements
              </label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
                placeholder="Any additional information or special requirements..."
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button className="bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 text-base font-semibold cursor-pointer">
            Continue to Review
          </Button>
        </div>
      </form>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
