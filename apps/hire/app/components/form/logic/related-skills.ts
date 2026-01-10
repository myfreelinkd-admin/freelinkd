export interface Skill {
  id: number;
  name: string;
  category: string;
  relatedSkills?: string[];
}

export const Skills: Skill[] = [
  // Design
  {
    id: 1,
    name: "UI/UX Design",
    category: "Design",
    relatedSkills: ["Design Wireframe", "Graphic Design", "Figma", "Adobe XD", "Sketch"],
  },
  {
    id: 2,
    name: "Design Wireframe",
    category: "Design",
    relatedSkills: ["UI/UX Design", "Figma", "Adobe XD"],
  },
  {
    id: 3,
    name: "Graphic Design",
    category: "Design",
    relatedSkills: ["Logo Design", "Illustration", "Adobe Illustrator", "Photoshop"],
  },
  {
    id: 4,
    name: "Logo Design",
    category: "Design",
    relatedSkills: ["Graphic Design", "Brand Identity Design", "Adobe Illustrator"],
  },
  {
    id: 5,
    name: "Illustration",
    category: "Design",
    relatedSkills: ["Graphic Design", "Digital Art", "Adobe Illustrator"],
  },
  {
    id: 6,
    name: "Motion Graphics",
    category: "Design",
    relatedSkills: ["Video Editing", "After Effects", "Animation"],
  },
  {
    id: 7,
    name: "Brand Identity Design",
    category: "Design",
    relatedSkills: ["Logo Design", "Graphic Design"],
  },
  {
    id: 8,
    name: "Icon Design",
    category: "Design",
    relatedSkills: ["UI/UX Design", "Graphic Design"],
  },
  {
    id: 9,
    name: "Infographic Design",
    category: "Design",
    relatedSkills: ["Graphic Design", "Data Visualization"],
  },
  {
    id: 10,
    name: "Packaging Design",
    category: "Design",
    relatedSkills: ["Graphic Design", "Product Design"],
  },
  {
    id: 11,
    name: "Figma",
    category: "Design",
    relatedSkills: ["UI/UX Design", "Design Wireframe"],
  },
  {
    id: 12,
    name: "Adobe XD",
    category: "Design",
    relatedSkills: ["UI/UX Design", "Design Wireframe"],
  },

  // Web Development
  {
    id: 20,
    name: "Web Landing Page",
    category: "Web Development",
    relatedSkills: ["Frontend Development", "HTML", "CSS", "JavaScript"],
  },
  {
    id: 21,
    name: "Frontend Development",
    category: "Web Development",
    relatedSkills: ["React Development", "Vue.js Development", "HTML", "CSS", "JavaScript", "Web Dev"],
  },
  {
    id: 22,
    name: "Backend Development",
    category: "Web Development",
    relatedSkills: ["API Development", "Node.js", "Python", "Database", "Web Dev"],
  },
  {
    id: 23,
    name: "Full Stack Development",
    category: "Web Development",
    relatedSkills: ["Frontend Development", "Backend Development", "Web Dev"],
  },
  {
    id: 24,
    name: "WordPress Development",
    category: "Web Development",
    relatedSkills: ["PHP", "Web Dev", "CMS"],
  },
  {
    id: 25,
    name: "E-commerce Website",
    category: "Web Development",
    relatedSkills: ["WordPress Development", "Shopify", "Web Dev"],
  },
  {
    id: 26,
    name: "React Development",
    category: "Web Development",
    relatedSkills: ["Frontend Development", "JavaScript", "Next.js Development"],
  },
  {
    id: 27,
    name: "Next.js Development",
    category: "Web Development",
    relatedSkills: ["React Development", "Frontend Development", "Full Stack Development"],
  },
  {
    id: 28,
    name: "Vue.js Development",
    category: "Web Development",
    relatedSkills: ["Frontend Development", "JavaScript"],
  },
  {
    id: 29,
    name: "API Development",
    category: "Web Development",
    relatedSkills: ["Backend Development", "REST API", "GraphQL"],
  },
  {
    id: 30,
    name: "Web Dev",
    category: "Web Development",
    relatedSkills: ["Frontend Development", "Backend Development", "Full Stack Development"],
  },
  {
    id: 31,
    name: "HTML",
    category: "Web Development",
    relatedSkills: ["CSS", "JavaScript", "Frontend Development"],
  },
  {
    id: 32,
    name: "CSS",
    category: "Web Development",
    relatedSkills: ["HTML", "JavaScript", "Frontend Development"],
  },
  {
    id: 33,
    name: "JavaScript",
    category: "Web Development",
    relatedSkills: ["TypeScript", "React Development", "Frontend Development"],
  },
  {
    id: 34,
    name: "TypeScript",
    category: "Web Development",
    relatedSkills: ["JavaScript", "React Development", "Next.js Development"],
  },

  // Mobile Development
  {
    id: 40,
    name: "Mobile App Development",
    category: "Mobile Development",
    relatedSkills: ["Android Development", "iOS Development", "React Native Development", "Flutter Development"],
  },
  {
    id: 41,
    name: "Android Development",
    category: "Mobile Development",
    relatedSkills: ["Kotlin", "Java", "Mobile App Development"],
  },
  {
    id: 42,
    name: "iOS Development",
    category: "Mobile Development",
    relatedSkills: ["Swift", "Mobile App Development"],
  },
  {
    id: 43,
    name: "React Native Development",
    category: "Mobile Development",
    relatedSkills: ["React Development", "Mobile App Development", "JavaScript"],
  },
  {
    id: 44,
    name: "Flutter Development",
    category: "Mobile Development",
    relatedSkills: ["Dart", "Mobile App Development"],
  },
  {
    id: 45,
    name: "Kotlin",
    category: "Mobile Development",
    relatedSkills: ["Android Development"],
  },
  {
    id: 46,
    name: "Swift",
    category: "Mobile Development",
    relatedSkills: ["iOS Development"],
  },

  // Data & AI
  {
    id: 50,
    name: "Data Analysis",
    category: "Data & AI",
    relatedSkills: ["Data Visualization", "Python", "SQL", "Excel"],
  },
  {
    id: 51,
    name: "Machine Learning",
    category: "Data & AI",
    relatedSkills: ["AI Development", "Python", "Data Science"],
  },
  {
    id: 52,
    name: "Data Visualization",
    category: "Data & AI",
    relatedSkills: ["Data Analysis", "Tableau", "Power BI"],
  },
  {
    id: 53,
    name: "Data Entry",
    category: "Data & AI",
    relatedSkills: ["Excel", "Data Analysis"],
  },
  {
    id: 54,
    name: "AI Development",
    category: "Data & AI",
    relatedSkills: ["Machine Learning", "Python", "Deep Learning"],
  },
  {
    id: 55,
    name: "Python",
    category: "Data & AI",
    relatedSkills: ["Data Analysis", "Machine Learning", "AI Development", "Backend Development"],
  },
  {
    id: 56,
    name: "SQL",
    category: "Data & AI",
    relatedSkills: ["Data Analysis", "Database", "Backend Development"],
  },

  // Marketing
  {
    id: 60,
    name: "Social Media Marketing",
    category: "Marketing",
    relatedSkills: ["Content Marketing", "Instagram Marketing", "Facebook Ads"],
  },
  {
    id: 61,
    name: "SEO Optimization",
    category: "Marketing",
    relatedSkills: ["Digital Marketing", "Content Marketing", "Google Ads"],
  },
  {
    id: 62,
    name: "Content Marketing",
    category: "Marketing",
    relatedSkills: ["Copywriting", "Social Media Marketing", "Blog Writing"],
  },
  {
    id: 63,
    name: "Digital Marketing",
    category: "Marketing",
    relatedSkills: ["SEO Optimization", "Google Ads", "Social Media Marketing"],
  },
  {
    id: 64,
    name: "Email Marketing",
    category: "Marketing",
    relatedSkills: ["Digital Marketing", "Copywriting"],
  },
  {
    id: 65,
    name: "Google Ads",
    category: "Marketing",
    relatedSkills: ["Digital Marketing", "SEO Optimization", "PPC"],
  },
  {
    id: 66,
    name: "Facebook Ads",
    category: "Marketing",
    relatedSkills: ["Social Media Marketing", "Digital Marketing", "Instagram Marketing"],
  },
  {
    id: 67,
    name: "Instagram Marketing",
    category: "Marketing",
    relatedSkills: ["Social Media Marketing", "Content Marketing"],
  },

  // Writing & Content
  {
    id: 70,
    name: "Copywriting",
    category: "Writing & Content",
    relatedSkills: ["Content Writing", "Marketing", "SEO Optimization"],
  },
  {
    id: 71,
    name: "Content Writing",
    category: "Writing & Content",
    relatedSkills: ["Blog Writing", "Copywriting", "SEO Optimization"],
  },
  {
    id: 72,
    name: "Technical Writing",
    category: "Writing & Content",
    relatedSkills: ["Documentation", "Content Writing"],
  },
  {
    id: 73,
    name: "Blog Writing",
    category: "Writing & Content",
    relatedSkills: ["Content Writing", "SEO Optimization"],
  },
  {
    id: 74,
    name: "Translation",
    category: "Writing & Content",
    relatedSkills: ["Proofreading", "Localization"],
  },
  {
    id: 75,
    name: "Proofreading",
    category: "Writing & Content",
    relatedSkills: ["Content Writing", "Translation"],
  },
  {
    id: 76,
    name: "Scriptwriting",
    category: "Writing & Content",
    relatedSkills: ["Video Production", "Copywriting"],
  },

  // Video & Animation
  {
    id: 80,
    name: "Video Editing",
    category: "Video & Animation",
    relatedSkills: ["Video Production", "After Effects", "Premiere Pro"],
  },
  {
    id: 81,
    name: "Animation",
    category: "Video & Animation",
    relatedSkills: ["2D Animation", "3D Animation", "Motion Graphics"],
  },
  {
    id: 82,
    name: "3D Animation",
    category: "Video & Animation",
    relatedSkills: ["Blender", "Maya", "Animation"],
  },
  {
    id: 83,
    name: "2D Animation",
    category: "Video & Animation",
    relatedSkills: ["Animation", "After Effects", "Illustration"],
  },
  {
    id: 84,
    name: "Video Production",
    category: "Video & Animation",
    relatedSkills: ["Video Editing", "Cinematography"],
  },
  {
    id: 85,
    name: "Explainer Video",
    category: "Video & Animation",
    relatedSkills: ["Animation", "Video Production"],
  },

  // Audio & Music
  {
    id: 90,
    name: "Music Production",
    category: "Audio & Music",
    relatedSkills: ["Audio Mixing", "Sound Design"],
  },
  {
    id: 91,
    name: "Voice Over",
    category: "Audio & Music",
    relatedSkills: ["Audio Mixing"],
  },
  {
    id: 92,
    name: "Podcast Editing",
    category: "Audio & Music",
    relatedSkills: ["Audio Mixing", "Voice Over"],
  },
  {
    id: 93,
    name: "Sound Design",
    category: "Audio & Music",
    relatedSkills: ["Music Production", "Audio Mixing"],
  },
  {
    id: 94,
    name: "Audio Mixing",
    category: "Audio & Music",
    relatedSkills: ["Music Production", "Sound Design"],
  },

  // Business & Consulting
  {
    id: 100,
    name: "Business Consulting",
    category: "Business & Consulting",
    relatedSkills: ["Project Management", "Financial Consulting"],
  },
  {
    id: 101,
    name: "Financial Consulting",
    category: "Business & Consulting",
    relatedSkills: ["Business Consulting", "Accounting"],
  },
  {
    id: 102,
    name: "Virtual Assistant",
    category: "Business & Consulting",
    relatedSkills: ["Data Entry", "Administrative"],
  },
  {
    id: 103,
    name: "Project Management",
    category: "Business & Consulting",
    relatedSkills: ["Business Consulting"],
  },
  {
    id: 104,
    name: "Business Plan Writing",
    category: "Business & Consulting",
    relatedSkills: ["Business Consulting", "Content Writing"],
  },

  // Photography
  {
    id: 110,
    name: "Product Photography",
    category: "Photography",
    relatedSkills: ["Photo Editing", "E-commerce"],
  },
  {
    id: 111,
    name: "Photo Editing",
    category: "Photography",
    relatedSkills: ["Photoshop", "Lightroom"],
  },
  {
    id: 112,
    name: "Portrait Photography",
    category: "Photography",
    relatedSkills: ["Photo Editing"],
  },
  {
    id: 113,
    name: "Event Photography",
    category: "Photography",
    relatedSkills: ["Photo Editing", "Video Production"],
  },
];

export const SkillCategories: Record<string, string[]> = {
  "Design": [
    "UI/UX Design", "Design Wireframe", "Graphic Design", "Logo Design",
    "Illustration", "Motion Graphics", "Brand Identity Design", "Icon Design",
    "Infographic Design", "Packaging Design", "Figma", "Adobe XD", "Sketch"
  ],
  "Web Development": [
    "Web Dev", "Frontend Development", "Backend Development", "Full Stack Development",
    "WordPress Development", "E-commerce Website", "React Development", "Next.js Development",
    "Vue.js Development", "API Development", "Web Landing Page", "HTML", "CSS", "JavaScript", "TypeScript"
  ],
  "Mobile Development": [
    "Mobile App Development", "Android Development", "iOS Development",
    "React Native Development", "Flutter Development", "Kotlin", "Swift"
  ],
  "Data & AI": [
    "Data Analysis", "Machine Learning", "Data Visualization", "Data Entry",
    "AI Development", "Python", "SQL"
  ],
  "Marketing": [
    "Social Media Marketing", "SEO Optimization", "Content Marketing", "Digital Marketing",
    "Email Marketing", "Google Ads", "Facebook Ads", "Instagram Marketing"
  ],
  "Writing & Content": [
    "Copywriting", "Content Writing", "Technical Writing", "Blog Writing",
    "Translation", "Proofreading", "Scriptwriting"
  ],
  "Video & Animation": [
    "Video Editing", "Animation", "3D Animation", "2D Animation",
    "Video Production", "Explainer Video", "Motion Graphics"
  ],
  "Audio & Music": [
    "Music Production", "Voice Over", "Podcast Editing", "Sound Design", "Audio Mixing"
  ],
  "Business & Consulting": [
    "Business Consulting", "Financial Consulting", "Virtual Assistant",
    "Project Management", "Business Plan Writing"
  ],
  "Photography": [
    "Product Photography", "Photo Editing", "Portrait Photography", "Event Photography"
  ],
};

export const SuperCategories: Record<string, string[]> = {
  "Developer": ["Web Development", "Mobile Development", "Data & AI"],
  "Business & Finance": ["Marketing", "Business & Consulting"],
  "Creative & Design": ["Design", "Video & Animation", "Photography", "Audio & Music", "Writing & Content"],
};
