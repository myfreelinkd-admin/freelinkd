import { getExpandedSkills, matchSkills, MatchType } from "./skills";

export interface Freelancer {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  skills: string[] | string;
  experience?: string;
  portfolio?: string;
  profileImage?: string;
  rating?: number;
  completedProjects?: number;
  hourlyRate?: number;
  availability?: string;
  location?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatchedFreelancer extends Freelancer {
  matchScore: number;
  matchedSkills: string[];
  matchType?: MatchType;
}

export interface FreelancerResponse {
  success: boolean;
  data: MatchedFreelancer[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  error?: string;
}

export function buildSkillsFilter(inputSkills: string[]): Record<string, unknown> {
  if (!inputSkills || inputSkills.length === 0) {
    return {};
  }

  const expandedSkills = getExpandedSkills(inputSkills);

  const skillPatterns = expandedSkills.map((skill) => ({
    skills: {
      $elemMatch: {
        $regex: new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      },
    },
  }));

  return {
    $or: skillPatterns,
  };
}

export function buildSimpleSkillsFilter(inputSkills: string[]): Record<string, unknown> {
  if (!inputSkills || inputSkills.length === 0) {
    return {};
  }

  const expandedSkills = getExpandedSkills(inputSkills);

  return {};
}

export function filterAndRankFreelancers(
  freelancers: Freelancer[],
  requiredSkills: string[],
  minMatchPercentage: number = 0
): MatchedFreelancer[] {
  if (!freelancers || !Array.isArray(freelancers)) {
    return [];
  }

  // If no required skills, return all with base score
  if (!requiredSkills || requiredSkills.length === 0) {
    return freelancers.map((f) => {
      const skillsArr = Array.isArray(f.skills)
        ? f.skills
        : typeof f.skills === "string"
        ? f.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      
      return {
        ...f,
        skills: skillsArr,
        matchScore: 50, // Base score when no required skills
        matchedSkills: [],
      };
    });
  }

  const matchedFreelancers: MatchedFreelancer[] = [];

  freelancers.forEach((freelancer) => {
    try {
      const freelancerSkills = Array.isArray(freelancer.skills)
        ? freelancer.skills
        : typeof freelancer.skills === "string"
        ? freelancer.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const { isMatch, matchScore, matchedSkills, matchType } = matchSkills(
        freelancerSkills,
        requiredSkills,
        minMatchPercentage
      );

      // Only include freelancers with score > 0 (has some relation)
      // Score 0 means no relation at all - skip them
      if (matchScore > 0) {
        matchedFreelancers.push({
          ...freelancer,
          skills: freelancerSkills,
          matchScore,
          matchedSkills,
          matchType,
        });
      }
    } catch (err) {
      console.error("Error matching freelancer:", freelancer.name, err);
      // Don't include freelancers that error - they have no valid match
    }
  });

  matchedFreelancers.sort((a, b) => b.matchScore - a.matchScore);

  return matchedFreelancers;
}

export async function fetchFreelancersBySkills(
  skills: string[],
  page: number = 1,
  limit: number = 10
): Promise<FreelancerResponse> {
  try {
    const params = new URLSearchParams();
    if (skills && skills.length > 0) {
      params.set("skills", skills.join(","));
    }
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const response = await fetch(`/api/freelancers/match?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch freelancers: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching freelancers by skills:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
export function getRecommendedFreelancers(
  inputSkills: string[],
  allFreelancers: Freelancer[],
  maxResults: number = 20
): MatchedFreelancer[] {
  const matched = filterAndRankFreelancers(allFreelancers, inputSkills, 0);
  return matched.slice(0, maxResults);
}

export function calculateSkillCompatibility(
  skills1: string[],
  skills2: string[]
): number {
  if (!skills1.length || !skills2.length) return 0;

  const expandedSkills1 = getExpandedSkills(skills1);
  const normalized1 = expandedSkills1.map((s) => s.toLowerCase().trim());
  const normalized2 = skills2.map((s) => s.toLowerCase().trim());

  let matchCount = 0;
  normalized2.forEach((skill) => {
    if (normalized1.includes(skill)) {
      matchCount++;
    }
  });

  return Math.round((matchCount / skills1.length) * 100);
}
