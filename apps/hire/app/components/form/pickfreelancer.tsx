"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Shuffle,
  Star,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";

export interface Freelancer {
  id: string;
  name: string;
  skills: string;
  rank: string;
  projectsCompleted: number;
  matchPercentage: number;
  matchSkills: string;
  rating: number;
  profileImage?: string;
  bio?: string;
}

interface FreelancerAPIResponse {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  skills: string[];
  experience?: string;
  portfolio?: string;
  profileImage?: string;
  rating?: number;
  completedProjects?: number;
  hourlyRate?: number;
  availability?: string;
  location?: string;
  bio?: string;
  matchScore?: number;
  matchedSkills?: string[];
}

interface PickFreelancerProps {
  onSelect?: (freelancer: Freelancer) => void;
  onModeChange?: (mode: "match" | "random") => void;
  selectedId?: string | null;
  requiredSkills?: string; // Skills from form (comma-separated)
}

// Determine rank based on projects completed
function getRank(projectsCompleted: number): string {
  if (projectsCompleted >= 50) return "Diamond";
  if (projectsCompleted >= 30) return "Platinum";
  if (projectsCompleted >= 15) return "Gold";
  if (projectsCompleted >= 5) return "Silver";
  return "Classic";
}

export default function PickFreelancer({
  onSelect,
  onModeChange,
  selectedId: externalSelectedId,
  requiredSkills = "",
}: PickFreelancerProps) {
  const [filter, setFilter] = useState<"match" | "random">("match");
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    null
  );
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedId =
    externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;

  // Fetch freelancers from API
  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Parse skills from comma-separated string
      const skillsArray = requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Build query params
      const params = new URLSearchParams();
      if (skillsArray.length > 0 && filter === "match") {
        params.set("skills", skillsArray.join(","));
      }
      params.set("page", "1");
      params.set("limit", "20");

      const response = await fetch(
        `/api/freelancers/match?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch freelancers");
      }

      const data = await response.json();

      if (data.success) {
        // Transform API response to Freelancer format
        const transformedFreelancers: Freelancer[] = data.data.map(
          (f: FreelancerAPIResponse) => ({
            id: f.id || f._id || "",
            name: f.name || "Unknown",
            skills: Array.isArray(f.skills)
              ? f.skills.join(", ")
              : f.skills || "",
            rank: getRank(f.completedProjects || 0),
            projectsCompleted: f.completedProjects || 0,
            matchPercentage: Math.round(f.matchScore || 0),
            matchSkills: Array.isArray(f.matchedSkills)
              ? f.matchedSkills.slice(0, 3).join(", ")
              : "",
            rating: f.rating || 0,
            profileImage: f.profileImage || "",
            bio: f.bio || "",
          })
        );

        // If random filter, shuffle the results
        if (filter === "random") {
          transformedFreelancers.sort(() => Math.random() - 0.5);
        }

        setFreelancers(transformedFreelancers);
      } else {
        throw new Error(data.error || "Failed to fetch freelancers");
      }
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [requiredSkills, filter]);

  // Fetch freelancers on mount and when filter/skills change
  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  // Notify parent when mode changes
  useEffect(() => {
    if (onModeChange) {
      onModeChange(filter);
    }
  }, [filter, onModeChange]);

  const handleModeChange = (mode: "match" | "random") => {
    setFilter(mode);
    // When switching to random, clear selected freelancer
    if (mode === "random") {
      setInternalSelectedId(null);
    }
  };

  const handleSelect = (freelancer: Freelancer) => {
    if (onSelect) {
      onSelect(freelancer);
    } else {
      setInternalSelectedId(freelancer.id);
    }
  };

  const selectedFreelancer = freelancers.find((f) => f.id === selectedId);

  return (
    <div className="space-y-6 md:space-y-8 mt-8 md:mt-12">
      <h3 className="text-xl md:text-2xl font-bold text-center">
        Choose Freelancer
      </h3>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => handleModeChange("match")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl border transition-all cursor-pointer text-sm md:text-base ${
              filter === "match"
                ? "bg-[#081f5c] text-white border-[#081f5c]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#081f5c]"
            }`}
          >
            <CheckCircle size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="font-semibold">Skill Match</span>
          </button>
          <button
            onClick={() => handleModeChange("random")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl border transition-all cursor-pointer text-sm md:text-base ${
              filter === "random"
                ? "bg-[#081f5c] text-white border-[#081f5c]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#081f5c]"
            }`}
          >
            <Shuffle size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="font-semibold">Open to All</span>
          </button>
        </div>
        <p className="text-xs md:text-sm text-gray-600 italic text-center md:text-left">
          {filter === "match"
            ? "Select a freelancer based on skill compatibility."
            : "Job will be open to all freelancers (status: general)."}
        </p>
      </div>

      {/* Content based on mode */}
      {filter === "random" ? (
        /* Open to All Mode - Show info banner instead of freelancer list */
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl md:rounded-3xl p-6 md:p-8 mt-4">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Shuffle className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-gray-900">
              Open to All Freelancers
            </h4>
            <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
              Your job will be posted as a{" "}
              <span className="font-semibold text-blue-600">
                general listing
              </span>{" "}
              and will be visible to all freelancers with matching skills.
            </p>
            <div className="bg-white/70 rounded-xl md:rounded-2xl p-3 md:p-4 inline-block">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                Required Skills
              </p>
              <p className="font-semibold text-gray-900 text-sm md:text-base">
                {requiredSkills || "Any skills"}
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl">
                <CheckCircle size={18} className="md:w-5 md:h-5" />
                <span className="font-semibold text-sm md:text-base">
                  Status: GENERAL
                </span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 italic pt-2">
              Freelancers with matching skills will be able to apply for this
              job.
            </p>
          </div>
        </div>
      ) : (
        /* Skill Match Mode - Show freelancer list */
        <>
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-[#081f5c]" />
              <p className="mt-4 text-sm text-gray-500">
                Loading freelancers...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
              <p className="mt-4 text-sm text-red-500">{error}</p>
              <button
                onClick={fetchFreelancers}
                className="mt-4 px-6 py-2 bg-[#081f5c] text-white rounded-xl text-sm font-bold hover:bg-[#081f5c]/90 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && freelancers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <User className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
              <p className="mt-4 text-sm text-gray-500">
                No freelancers found. Try adjusting your skills or filters.
              </p>
            </div>
          )}

          {/* Freelancer List */}
          {!loading && !error && freelancers.length > 0 && (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 overscroll-contain custom-scrollbar">
              {freelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className={`bg-white border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 transition-all relative ${
                    selectedId === freelancer.id
                      ? "border-[#08CB00] shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Profile Picture */}
                  <div className="flex items-center sm:items-start gap-4 sm:block">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                      {freelancer.profileImage ? (
                        <img
                          src={freelancer.profileImage}
                          alt={freelancer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {/* Mobile Only Name shows here for better layout */}
                    <div className="sm:hidden flex-1">
                      <h4 className="text-lg font-bold">{freelancer.name}</h4>
                      <p className="text-xs text-gray-400">
                        ({freelancer.id.slice(0, 8)}...)
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(freelancer.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grow space-y-1">
                    <div className="hidden sm:flex items-center gap-2">
                      <h4 className="text-lg md:text-xl font-bold">
                        {freelancer.name}
                      </h4>
                      <span className="text-xs text-gray-400">
                        ({freelancer.id.slice(0, 8)}...)
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-medium">
                      <span className="text-gray-500">Skill :</span>{" "}
                      {freelancer.skills || "Not specified"}
                    </p>
                    <p className="text-xs md:text-sm font-medium">
                      <span className="text-gray-500">Rank :</span>{" "}
                      <span
                        className={`font-bold ${
                          freelancer.rank === "Diamond"
                            ? "text-blue-500"
                            : freelancer.rank === "Platinum"
                              ? "text-purple-500"
                              : freelancer.rank === "Gold"
                                ? "text-yellow-600"
                                : freelancer.rank === "Silver"
                                  ? "text-gray-500"
                                  : "text-gray-700"
                        }`}
                      >
                        {freelancer.rank}
                      </span>
                    </p>
                    <p className="text-xs md:text-sm font-medium">
                      <span className="text-gray-500">Project completed:</span>{" "}
                      {freelancer.projectsCompleted}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 pt-2 line-clamp-2">
                      {freelancer.bio ||
                        (freelancer.projectsCompleted === 0
                          ? "Experienced freelancer ready to collaborate"
                          : `${freelancer.projectsCompleted} projects completed.`)}
                    </p>
                  </div>

                  {/* Match & Rating - Desktop/Table */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between sm:text-right gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div>
                      <p className="text-xs md:text-sm font-bold text-gray-500">
                        Match {freelancer.matchPercentage}%
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {freelancer.matchSkills || "General match"}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(freelancer.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Rating {freelancer.rating.toFixed(1)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelect(freelancer)}
                      className={`text-sm font-bold cursor-pointer transition-all px-4 py-2 rounded-lg sm:px-0 sm:py-0 sm:bg-transparent ${
                        selectedId === freelancer.id
                          ? "bg-[#08CB00]/10 text-[#08CB00] sm:bg-transparent"
                          : "bg-[#081f5c] text-white sm:text-[#081f5c] sm:bg-transparent hover:underline"
                      }`}
                    >
                      {selectedId === freelancer.id
                        ? "✓ Selected"
                        : "Tap to Select"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Freelancer Section */}
          {selectedFreelancer && (
            <div className="space-y-4">
              <h4 className="text-base md:text-lg font-bold">
                Selected Freelancer
              </h4>
              <div className="bg-[#081f5c] text-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg animate-fade-in-up">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-lg md:text-xl font-bold">
                      {selectedFreelancer.name}
                    </h5>
                    <p className="text-xs opacity-70">
                      ({selectedFreelancer.id.slice(0, 8)}...)
                    </p>
                    <p className="text-xs md:text-sm mt-2">
                      Skill : {selectedFreelancer.skills}
                    </p>
                    <p className="text-xs md:text-sm mt-1">
                      Rank : {selectedFreelancer.rank}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm font-bold">
                      Match {selectedFreelancer.matchPercentage}%
                    </p>
                    <div className="flex gap-0.5 mt-2 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.floor(selectedFreelancer.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/30"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
