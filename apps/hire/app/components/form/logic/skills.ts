import Fuse from "fuse.js";
import { 
  Skills, 
  SkillCategories, 
  SuperCategories,
  Skill 
} from "./related-skills";

export { Skills, SkillCategories, SuperCategories };
export type { Skill };

const fuseOptions = {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "category", weight: 0.2 },
    { name: "relatedSkills", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
  includeScore: true,
  shouldSort: true,
  findAllMatches: true,
};

const fuse = new Fuse(Skills, fuseOptions);

export function searchSkills(query: string, limit: number = 10): Skill[] {
  if (!query || query.trim() === "") {
    return [];
  }
  const results = fuse.search(query.trim(), { limit });
  return results.map((result) => result.item);
}

export function getSkillsByCategory(category: string): string[] {
  return SkillCategories[category] || [];
}

export function getSkillCategory(skillName: string): string | null {
  const skill = Skills.find(
    (s) => s.name.toLowerCase() === skillName.toLowerCase()
  );
  return skill?.category || null;
}

export function getRelatedSkills(skillName: string): string[] {
  const skill = Skills.find(
    (s) => s.name.toLowerCase() === skillName.toLowerCase()
  );
  
  if (!skill) return [];
  
  const related = new Set<string>();
  
  if (skill.relatedSkills) {
    skill.relatedSkills.forEach((s) => related.add(s));
  }
  
  const categorySkills = SkillCategories[skill.category];
  if (categorySkills) {
    categorySkills.forEach((s) => {
      if (s.toLowerCase() !== skillName.toLowerCase()) {
        related.add(s);
      }
    });
  }
  
  return Array.from(related);
}

export function getExpandedSkills(inputSkills: string[]): string[] {
  const expandedSkills = new Set<string>();
  
  inputSkills.forEach((skillName) => {
    expandedSkills.add(skillName);
    
    const related = getRelatedSkills(skillName);
    related.forEach((s) => expandedSkills.add(s));
    
    const fuzzyMatches = searchSkills(skillName, 5);
    fuzzyMatches.forEach((skill) => {
      expandedSkills.add(skill.name);
      if (skill.relatedSkills) {
        skill.relatedSkills.forEach((s) => expandedSkills.add(s));
      }
    });
  });
  
  return Array.from(expandedSkills);
}

function getSuperCategory(category: string): string | null {
  for (const [superCat, cats] of Object.entries(SuperCategories)) {
    if (cats.includes(category)) {
      return superCat;
    }
  }
  return null;
}

export type MatchType = "exact" | "intersecting" | "related" | "none";

export function matchSkills(
  freelancerSkills: string[] | string | undefined | null,
  requiredSkills: string[] | string | undefined | null,
  minMatchPercentage: number = 30
): { isMatch: boolean; matchScore: number; matchedSkills: string[]; matchType: MatchType } {

  let normalizedFreelancerArr: string[] = [];
  if (Array.isArray(freelancerSkills)) {
    normalizedFreelancerArr = freelancerSkills.filter((s) => typeof s === "string" && s.trim());
  } else if (typeof freelancerSkills === "string" && freelancerSkills.trim()) {
    normalizedFreelancerArr = freelancerSkills.split(",").map((s) => s.trim()).filter(Boolean);
  }

  let normalizedRequiredArr: string[] = [];
  if (Array.isArray(requiredSkills)) {
    normalizedRequiredArr = requiredSkills.filter((s) => typeof s === "string" && s.trim());
  } else if (typeof requiredSkills === "string" && requiredSkills.trim()) {
    normalizedRequiredArr = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
  }

  if (normalizedFreelancerArr.length === 0) {
    return { isMatch: false, matchScore: 0, matchedSkills: [], matchType: "none" };
  }
  if (normalizedRequiredArr.length === 0) {
    return { isMatch: true, matchScore: 50, matchedSkills: [], matchType: "none" };
  }
  
  const requiredSkillsLower = new Set(normalizedRequiredArr.map(s => s.toLowerCase().trim()));
  
  const requiredCategories = new Set<string>();
  const requiredSuperCategories = new Set<string>();
  const requiredRelatedSkills = new Set<string>();
  
  for (const reqSkill of normalizedRequiredArr) {
    const reqLower = reqSkill.toLowerCase().trim();
    const skillData = Skills.find(s => s.name.toLowerCase() === reqLower);
    
    if (skillData) {
      requiredCategories.add(skillData.category);
      const superCat = getSuperCategory(skillData.category);
      if (superCat) requiredSuperCategories.add(superCat);
      
      if (skillData.relatedSkills) {
        skillData.relatedSkills.forEach(rs => requiredRelatedSkills.add(rs.toLowerCase()));
      }
    } else {
      const fuzzyResult = fuse.search(reqSkill, { limit: 1 });
      if (fuzzyResult.length > 0 && fuzzyResult[0].score !== undefined && fuzzyResult[0].score < 0.3) {
        const foundSkill = fuzzyResult[0].item;
        requiredCategories.add(foundSkill.category);
        requiredSkillsLower.add(foundSkill.name.toLowerCase());
        const superCat = getSuperCategory(foundSkill.category);
        if (superCat) requiredSuperCategories.add(superCat);
        if (foundSkill.relatedSkills) {
          foundSkill.relatedSkills.forEach(rs => requiredRelatedSkills.add(rs.toLowerCase()));
        }
      }
    }
  }
  
  let exactCount = 0;
  let intersectingCount = 0;
  let relatedCount = 0;
  const matchedSkills: string[] = [];
  const processedSkills = new Set<string>();
  
  for (const freelancerSkill of normalizedFreelancerArr) {
    const freelancerLower = freelancerSkill.toLowerCase().trim();
    
    if (processedSkills.has(freelancerLower)) continue;
    processedSkills.add(freelancerLower);
    
    if (requiredSkillsLower.has(freelancerLower)) {
      exactCount++;
      matchedSkills.push(freelancerSkill);
      continue;
    }
    
    let freelancerSkillData = Skills.find(s => s.name.toLowerCase() === freelancerLower);
    
    if (!freelancerSkillData) {
      const fuzzyResult = fuse.search(freelancerSkill, { limit: 1 });
      if (fuzzyResult.length > 0 && fuzzyResult[0].score !== undefined && fuzzyResult[0].score < 0.25) {
        freelancerSkillData = fuzzyResult[0].item;
        if (requiredSkillsLower.has(freelancerSkillData.name.toLowerCase())) {
          exactCount++;
          matchedSkills.push(freelancerSkill);
          continue;
        }
      }
    }
    
    if (!freelancerSkillData) continue;
    
    if (requiredRelatedSkills.has(freelancerLower)) {
      intersectingCount++;
      matchedSkills.push(freelancerSkill);
      continue;
    }
    
    if (freelancerSkillData.relatedSkills) {
      const hasIntersection = freelancerSkillData.relatedSkills.some(
        rs => requiredSkillsLower.has(rs.toLowerCase()) || requiredRelatedSkills.has(rs.toLowerCase())
      );
      if (hasIntersection) {
        intersectingCount++;
        matchedSkills.push(freelancerSkill);
        continue;
      }
    }
    
    if (requiredCategories.has(freelancerSkillData.category)) {
      relatedCount++;
      matchedSkills.push(freelancerSkill);
      continue;
    }
    
    const freelancerSuperCat = getSuperCategory(freelancerSkillData.category);
    if (freelancerSuperCat && requiredSuperCategories.has(freelancerSuperCat)) {
      relatedCount++;
      matchedSkills.push(freelancerSkill);
      continue;
    }
  }
  
  const totalRequired = normalizedRequiredArr.length;
  let matchScore = 0;
  let matchType: MatchType = "none";
  
  if (exactCount > 0) {
    const exactRatio = Math.min(exactCount / totalRequired, 1);
    matchScore = exactRatio * 100;
    matchType = "exact";
  } else if (intersectingCount > 0) {
    const intersectRatio = Math.min(intersectingCount / totalRequired, 1);
    matchScore = intersectRatio * 90;
    matchType = "intersecting";
  } else if (relatedCount > 0) {
    const relatedRatio = Math.min(relatedCount / totalRequired, 1);
    matchScore = relatedRatio * 80;
    matchType = "related";
  }

  if (matchedSkills.length === 0) {
    return { isMatch: false, matchScore: 0, matchedSkills: [], matchType: "none" };
  }
  
  matchScore = Math.min(Math.round(matchScore), 100);
  
  const isMatch = matchScore >= minMatchPercentage;
  
  return {
    isMatch,
    matchScore,
    matchedSkills,
    matchType,
  };
}
