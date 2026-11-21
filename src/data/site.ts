export const identity = {
  name: "Sankar Balaje",

  role: "Full-Stack Developer / AI Product Builder",

  tagline: "Engineering Ideas. Coding Possibilities. Building Intelligence.",

  university: "Puducherry Technological University",

  degree: "B.Tech — Mechanical Engineering",

  years: "2022–2026",

  cgpa: "7.4 / 10",

  github: "https://github.com/sankarbalaje2005-bit",

  // Add these once you have verified links.
  linkedin: null as string | null,
  email: null as string | null,
  resume: null as string | null,
};

export type Project = {
  slug: string;
  title: string;
  label: string;
  description: string;
  github?: string;
  live?: string;
  stack?: string[];
};

export const projects: Project[] = [
  {
    slug: "ai-mystery-room",
    title: "AI Mystery Room",
    label: "01 / Investigation",

    description:
      "An AI-powered mystery investigation platform where visitors explore cases, find clues, and solve mysteries.",

    github: "https://github.com/sankarbalaje2005-bit/ai-mystery-room",

    live: "https://ai-mystery-room-lime.vercel.app",
  },

  {
    slug: "macrosnap",
    title: "MacroSnap",
    label: "02 / Nutrition",

    description:
      "An AI-assisted nutrition tracking application for understanding food intake and nutritional information.",
  },

  {
    slug: "one-day-travel-itinerary-builder",
    title: "One-Day Travel Itinerary Builder",
    label: "03 / Travel",

    description:
      "A planning application for one-day travel itineraries, destinations, activities, and timelines.",
  },

  {
    slug: "restaurant-picker",
    title: "Restaurant Picker",
    label: "04 / Discovery",

    description:
      "An interactive React application designed to help users explore and choose restaurants.",
  },

  {
    slug: "playlist-duel",
    title: "Playlist Duel",
    label: "05 / Music",

    description: "An interactive music playlist comparison application.",
  },
];

export const skills = [
  {
    category: "Frontend",
    entries: ["HTML", "CSS", "JavaScript", "React.js", "Tailwind CSS"],
  },

  {
    category: "Backend",
    entries: ["Node.js", "Express.js", "REST APIs"],
  },

  {
    category: "Intelligence",
    entries: ["Python", "Gemini API", "Prompt Engineering", "AI Integration"],
  },

  {
    category: "Systems",
    entries: ["MongoDB", "Git", "GitHub", "Postman", "Vercel"],
  },
];
