"use client";

import { useState } from "react";
import { CheckCircle, Shuffle, Star } from "lucide-react";

export interface Freelancer {
  id: string;
  name: string;
  skills: string;
  rank: string;
  projectsCompleted: number;
  matchPercentage: number;
  matchSkills: string;
  rating: number;
}

interface PickFreelancerProps {
  onSelect?: (freelancer: Freelancer) => void;
  selectedId?: string | null;
}

const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: "FL001",
    name: "Freelancer Name",
    skills: "Freelancer Skills",
    rank: "Clasic",
    projectsCompleted: 0,
    matchPercentage: 100,
    matchSkills: "UI/UX Design",
    rating: 0,
  },
  {
    id: "FL002",
    name: "Alex Rivera",
    skills: "React, Next.js, Tailwind",
    rank: "Gold",
    projectsCompleted: 12,
    matchPercentage: 95,
    matchSkills: "Frontend Development",
    rating: 4.8,
  },
];

export default function PickFreelancer({
  onSelect,
  selectedId: externalSelectedId,
}: PickFreelancerProps) {
  const [filter, setFilter] = useState<"match" | "random">("match");
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    null
  );

  const selectedId =
    externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;

  const handleSelect = (freelancer: Freelancer) => {
    if (onSelect) {
      onSelect(freelancer);
    } else {
      setInternalSelectedId(freelancer.id);
    }
  };

  const selectedFreelancer = MOCK_FREELANCERS.find((f) => f.id === selectedId);

  return (
    <div className="space-y-8 mt-12">
      <h3 className="text-2xl font-bold text-center">Choose Freelancer</h3>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("match")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              filter === "match"
                ? "bg-[#081f5c] text-white border-[#081f5c]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#081f5c]"
            }`}
          >
            <CheckCircle size={18} />
            <span className="font-semibold">Skill Match</span>
          </button>
          <button
            onClick={() => setFilter("random")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              filter === "random"
                ? "bg-[#081f5c] text-white border-[#081f5c]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#081f5c]"
            }`}
          >
            <Shuffle size={18} />
            <span className="font-semibold">Random</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 italic">
          {filter === "match"
            ? "Showing freelancers ranked by skill compatibility."
            : "Showing a curated selection of random freelancers."}
        </p>
      </div>

      {/* Freelancer List */}
      <div className="space-y-4 max-h-125 overflow-y-auto pr-2 overscroll-contain custom-scrollbar">
        {MOCK_FREELANCERS.map((freelancer) => (
          <div
            key={freelancer.id}
            className={`bg-white border-2 rounded-3xl p-6 flex flex-col md:flex-row gap-6 transition-all relative ${
              selectedId === freelancer.id
                ? "border-[#08CB00] shadow-md" 
                : "border-gray-200"
            }`}
          >
            {/* Profile Picture */}
            <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0 flex items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-300 rounded-full" />
            </div>

            {/* Info */}
            <div className="grow space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold">{freelancer.name}</h4>
                <span className="text-xs text-gray-400">({freelancer.id})</span>
              </div>
              <p className="text-sm font-medium">Skill : {freelancer.skills}</p>
              <p className="text-sm font-medium">Rank : {freelancer.rank}</p>
              <p className="text-sm font-medium">
                Project completed: {freelancer.projectsCompleted}
              </p>
              <p className="text-sm text-gray-600 pt-2">
                {freelancer.projectsCompleted === 0
                  ? "Experienced freelancer ready to collaborate"
                  : `${freelancer.projectsCompleted} projects completed.`}
              </p>
            </div>

            {/* Match & Rating */}
            <div className="flex flex-col items-end justify-between text-right gap-4">
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Match {freelancer.matchPercentage}%
                </p>
                <p className="text-xs text-gray-400">
                  {freelancer.matchSkills}
                </p>
              </div>
              <div className="flex flex-col items-end">
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
                className="text-sm font-bold text-[#081f5c] hover:underline cursor-pointer"
              >
                Tap to Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Freelancer Section */}
      {selectedFreelancer && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Selected Freelancer</h4>
          <div className="bg-[#081f5c] text-white rounded-3xl p-6 shadow-lg animate-fade-in-up">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="text-xl font-bold">{selectedFreelancer.name}</h5>
                <p className="text-xs opacity-70">({selectedFreelancer.id})</p>
                <p className="text-sm mt-2">
                  Skill : {selectedFreelancer.skills}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  Match {selectedFreelancer.matchPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
