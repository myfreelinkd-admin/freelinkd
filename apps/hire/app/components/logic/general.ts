import Fuse from "fuse.js";
import { Skills, Skill } from "./recomend-job";

export type JobStatus = "general" | "assigned" | "pending" | "completed";

export interface GeneralJob {
  id?: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  skills: string[];
  projectDescription: string;
  additionalRequirements?: string;
  dueTime: string;
  deadlineDate: string;
  budgetFrom: number;
  budgetTo: number;
  status: JobStatus;
  createdAt?: string;
  updatedAt?: string;
  assignedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  } | null;
}

export interface GeneralJobPayload {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  skills: string;
  projectDescription: string;
  additionalRequirements: string;
  dueTime: string;
  deadlineDate: string;
  budgetFrom: string;
  budgetTo: string;
  status: JobStatus;
  selectedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  } | null;
}

const fuseOptions = {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "category", weight: 0.3 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
  includeScore: true,
  shouldSort: true,
  findAllMatches: true,
};

const fuse = new Fuse(Skills, fuseOptions);

export function getRelatedSkillsForJob(jobSkills: string[]): string[] {
  const relatedSkills = new Set<string>();
  
  jobSkills.forEach((skill) => {
    relatedSkills.add(skill);
    
    const results = fuse.search(skill.trim(), { limit: 5 });
    results.forEach((result) => {
      relatedSkills.add(result.item.name);
      
      const categorySkills = Skills.filter(
        (s) => s.category === result.item.category
      );
      categorySkills.forEach((s) => relatedSkills.add(s.name));
    });
  });
  
  return Array.from(relatedSkills);
}

export function checkFreelancerEligibility(
  freelancerSkills: string[],
  jobSkills: string[]
): { eligible: boolean; matchScore: number; matchedSkills: string[] } {
  if (!jobSkills || jobSkills.length === 0) {
    return { eligible: true, matchScore: 100, matchedSkills: freelancerSkills };
  }
  
  if (!freelancerSkills || freelancerSkills.length === 0) {
    return { eligible: false, matchScore: 0, matchedSkills: [] };
  }

  const expandedJobSkills = getRelatedSkillsForJob(jobSkills);
  const normalizedFreelancerSkills = freelancerSkills.map((s) => s.toLowerCase().trim());
  const normalizedJobSkills = expandedJobSkills.map((s) => s.toLowerCase().trim());
  
  const matchedSkills: string[] = [];
  
  normalizedFreelancerSkills.forEach((skill, idx) => {
    if (normalizedJobSkills.includes(skill)) {
      matchedSkills.push(freelancerSkills[idx]);
    }
  });
  
  const matchScore = (matchedSkills.length / jobSkills.length) * 100;
  const eligible = matchedSkills.length > 0;
  
  return {
    eligible,
    matchScore: Math.round(matchScore * 100) / 100,
    matchedSkills,
  };
}

export function createGeneralJobPayload(
  formData: GeneralJobPayload
): GeneralJob {
  const skillsArray = formData.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    jobTitle: formData.jobTitle,
    skills: skillsArray,
    projectDescription: formData.projectDescription,
    additionalRequirements: formData.additionalRequirements || "",
    dueTime: formData.dueTime,
    deadlineDate: formData.deadlineDate,
    budgetFrom: parseInt(formData.budgetFrom) || 0,
    budgetTo: parseInt(formData.budgetTo) || 0,
    status: formData.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedFreelancer: formData.selectedFreelancer || null,
  };
}

export function determineJobStatus(
  selectionMode: "match" | "random",
  selectedFreelancer?: { id: string } | null
): JobStatus {
  if (selectionMode === "random" || !selectedFreelancer) {
    return "general";
  }
  return "assigned";
}

export async function submitGeneralJob(
  job: GeneralJob
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      throw new Error("Failed to submit job");
    }

    const data = await response.json();
    return { success: true, jobId: data.jobId };
  } catch (error) {
    console.error("Error submitting job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function getJobStatusLabel(status: JobStatus): string {
  switch (status) {
    case "general":
      return "Open to All Freelancers";
    case "assigned":
      return "Assigned to Freelancer";
    case "pending":
      return "Pending Review";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
}

export function getJobStatusColor(status: JobStatus): string {
  switch (status) {
    case "general":
      return "bg-blue-100 text-blue-700";
    case "assigned":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}
