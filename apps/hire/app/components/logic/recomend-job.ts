import Fuse from "fuse.js";

// Daftar skill/job yang tersedia untuk rekomendasi
export const Skills = [
  // Design
  { id: 1, name: "UI/UX Design", category: "Design" },
  { id: 2, name: "Design Wireframe", category: "Design" },
  { id: 3, name: "Graphic Design", category: "Design" },
  { id: 4, name: "Logo Design", category: "Design" },
  { id: 5, name: "Illustration", category: "Design" },
  { id: 6, name: "Motion Graphics", category: "Design" },
  { id: 7, name: "Brand Identity Design", category: "Design" },
  { id: 8, name: "Icon Design", category: "Design" },
  { id: 9, name: "Infographic Design", category: "Design" },
  { id: 10, name: "Packaging Design", category: "Design" },

  // Web Development
  { id: 11, name: "Web Landing Page", category: "Web Development" },
  { id: 12, name: "Frontend Development", category: "Web Development" },
  { id: 13, name: "Backend Development", category: "Web Development" },
  { id: 14, name: "Full Stack Development", category: "Web Development" },
  { id: 15, name: "WordPress Development", category: "Web Development" },
  { id: 16, name: "E-commerce Website", category: "Web Development" },
  { id: 17, name: "React Development", category: "Web Development" },
  { id: 18, name: "Next.js Development", category: "Web Development" },
  { id: 19, name: "Vue.js Development", category: "Web Development" },
  { id: 20, name: "API Development", category: "Web Development" },

  // Mobile Development
  { id: 21, name: "Mobile App Development", category: "Mobile Development" },
  { id: 22, name: "Android Development", category: "Mobile Development" },
  { id: 23, name: "iOS Development", category: "Mobile Development" },
  { id: 24, name: "React Native Development", category: "Mobile Development" },
  { id: 25, name: "Flutter Development", category: "Mobile Development" },

  // Data & AI
  { id: 26, name: "Data Analysis", category: "Data & AI" },
  { id: 27, name: "Machine Learning", category: "Data & AI" },
  { id: 28, name: "Data Visualization", category: "Data & AI" },
  { id: 29, name: "Data Entry", category: "Data & AI" },
  { id: 30, name: "AI Development", category: "Data & AI" },

  // Marketing
  { id: 31, name: "Social Media Marketing", category: "Marketing" },
  { id: 32, name: "SEO Optimization", category: "Marketing" },
  { id: 33, name: "Content Marketing", category: "Marketing" },
  { id: 34, name: "Digital Marketing", category: "Marketing" },
  { id: 35, name: "Email Marketing", category: "Marketing" },
  { id: 36, name: "Google Ads", category: "Marketing" },
  { id: 37, name: "Facebook Ads", category: "Marketing" },
  { id: 38, name: "Instagram Marketing", category: "Marketing" },

  // Writing & Content
  { id: 39, name: "Copywriting", category: "Writing & Content" },
  { id: 40, name: "Content Writing", category: "Writing & Content" },
  { id: 41, name: "Technical Writing", category: "Writing & Content" },
  { id: 42, name: "Blog Writing", category: "Writing & Content" },
  { id: 43, name: "Translation", category: "Writing & Content" },
  { id: 44, name: "Proofreading", category: "Writing & Content" },
  { id: 45, name: "Scriptwriting", category: "Writing & Content" },

  // Video & Animation
  { id: 46, name: "Video Editing", category: "Video & Animation" },
  { id: 47, name: "Animation", category: "Video & Animation" },
  { id: 48, name: "3D Animation", category: "Video & Animation" },
  { id: 49, name: "2D Animation", category: "Video & Animation" },
  { id: 50, name: "Video Production", category: "Video & Animation" },
  { id: 51, name: "Explainer Video", category: "Video & Animation" },

  // Audio & Music
  { id: 52, name: "Music Production", category: "Audio & Music" },
  { id: 53, name: "Voice Over", category: "Audio & Music" },
  { id: 54, name: "Podcast Editing", category: "Audio & Music" },
  { id: 55, name: "Sound Design", category: "Audio & Music" },
  { id: 56, name: "Audio Mixing", category: "Audio & Music" },

  // Business & Consulting
  { id: 57, name: "Business Consulting", category: "Business & Consulting" },
  { id: 58, name: "Financial Consulting", category: "Business & Consulting" },
  { id: 59, name: "Virtual Assistant", category: "Business & Consulting" },
  { id: 60, name: "Project Management", category: "Business & Consulting" },
  { id: 61, name: "Business Plan Writing", category: "Business & Consulting" },

  // Photography
  { id: 62, name: "Product Photography", category: "Photography" },
  { id: 63, name: "Photo Editing", category: "Photography" },
  { id: 64, name: "Portrait Photography", category: "Photography" },
  { id: 65, name: "Event Photography", category: "Photography" },
];

// Type untuk Skill
export interface Skill {
  id: number;
  name: string;
  category: string;
}

// Type untuk hasil pencarian Fuse.js
export interface SearchResult {
  item: Skill;
  refIndex: number;
  score?: number;
}

// Konfigurasi Fuse.js untuk fuzzy search
const fuseOptions = {
  // Kunci yang akan dicari
  keys: [
    {
      name: "name",
      weight: 0.7, // Prioritas tinggi untuk nama
    },
    {
      name: "category",
      weight: 0.3, // Prioritas lebih rendah untuk kategori
    },
  ],
  // Threshold: 0 = exact match, 1 = match anything
  // Nilai 0.4 memberikan keseimbangan antara akurasi dan fleksibilitas
  threshold: 0.4,
  // Mengabaikan lokasi karakter dalam string
  ignoreLocation: true,
  // Minimum karakter sebelum fuzzy search dimulai
  minMatchCharLength: 1,
  // Include score dalam hasil
  includeScore: true,
  // Sort berdasarkan score
  shouldSort: true,
  // Extended search untuk fitur pencarian lanjutan
  useExtendedSearch: false,
  // Find all matches
  findAllMatches: true,
};

// Inisialisasi Fuse dengan data skills
const fuse = new Fuse(Skills, fuseOptions);

/**
 * Mencari job/skill berdasarkan kata kunci menggunakan fuzzy search
 * @param query - Kata kunci pencarian
 * @param limit - Jumlah maksimal hasil yang dikembalikan (default: 10)
 * @returns Array hasil pencarian yang cocok
 */
export function searchJobs(query: string, limit: number = 10): Skill[] {
  // Jika query kosong, kembalikan array kosong
  if (!query || query.trim() === "") {
    return [];
  }

  // Lakukan pencarian fuzzy
  const results = fuse.search(query.trim(), { limit });

  // Kembalikan hanya item tanpa metadata Fuse
  return results.map((result) => result.item);
}

/**
 * Mencari job/skill dengan informasi score
 * @param query - Kata kunci pencarian
 * @param limit - Jumlah maksimal hasil yang dikembalikan (default: 10)
 * @returns Array hasil pencarian dengan score
 */
export function searchJobsWithScore(
  query: string,
  limit: number = 10
): SearchResult[] {
  if (!query || query.trim() === "") {
    return [];
  }

  return fuse.search(query.trim(), { limit });
}

/**
 * Mendapatkan job/skill berdasarkan kategori
 * @param category - Nama kategori
 * @returns Array skill dalam kategori tersebut
 */
export function getJobsByCategory(category: string): Skill[] {
  return Skills.filter(
    (skill) => skill.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Mendapatkan semua kategori unik
 * @returns Array nama kategori
 */
export function getAllCategories(): string[] {
  const categories = new Set(Skills.map((skill) => skill.category));
  return Array.from(categories);
}

/**
 * Mendapatkan skill berdasarkan ID
 * @param id - ID skill
 * @returns Skill atau undefined jika tidak ditemukan
 */
export function getSkillById(id: number): Skill | undefined {
  return Skills.find((skill) => skill.id === id);
}

/**
 * Mendapatkan rekomendasi job berdasarkan beberapa kata kunci
 * @param keywords - Array kata kunci
 * @param limit - Jumlah maksimal hasil per kata kunci
 * @returns Array skill yang direkomendasikan (tanpa duplikat)
 */
export function getRecommendedJobs(
  keywords: string[],
  limit: number = 5
): Skill[] {
  const resultMap = new Map<number, Skill>();

  keywords.forEach((keyword) => {
    const results = searchJobs(keyword, limit);
    results.forEach((skill) => {
      if (!resultMap.has(skill.id)) {
        resultMap.set(skill.id, skill);
      }
    });
  });

  return Array.from(resultMap.values());
}
