export const portfolioData = {
  meta: {
    title: "Shiraz Ali | Web Developer • Agentic AI Developer",
    description: "Portfolio website showcasing web development and Agentic AI work and skills in Next.js, React, TypeScript, sanity(CMS), modern web technologies, openai-agent-sdk, crewai, langchain and LLM applications"
  },
  personal: {
    name: "Shiraz Ali",
    title: "Web Developer • Agentic AI Developer",
    location: "Karachi, Sindh, Pakistan",
    avatar: "/profile.jpg",
    email: "shirazkk8@gmail.com",
    phone: "+92 327 3599802",
    availableForWork: true,
    badges: ["Next.js", "sanity(CMS)", "TypeScript", "Openai-agent-sdk", "Crewai"],
    social: [
      { platform: "GitHub", url: "https://github.com/shirazkk", icon: "Github" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/shirazali8", icon: "Linkedin" },
      { platform: "Twitter", url: "https://x.com/KkShiraz", icon: "Twitter" },
      { platform: "Instagram", url: "#", icon: "Instagram" }
    ]
  },
  about: {
    bio: "As a passionate frontend developer, I specialize in building dynamic and user-friendly web applications using Next.js, React, sanity(CMS) and Tailwind CSS. With proficiency in TypeScript, JavaScript, and Python, I have a strong foundation in both frontend development and backend programming. Currently, I am expanding my expertise by exploring Agentic AI and its potential in shaping future technologies.",
    focus: [
      "Building responsive, high-performance web applications with Next.js and React",
      "Implementing modern UI/UX designs with Tailwind CSS and TypeScript",
      "Exploring Agentic AI and its integration with web technologies",
      "Creating scalable e-commerce solutions with CMS integration"
    ],
    languages: [
      { name: "English", proficiency: "Intermediate", level: 70, flag: "🇺🇸" },
      { name: "Urdu", proficiency: "Native", level: 100, flag: "🇵🇰" }
    ],
    interests: [
      "Agentic AI",
      "LLM applications",
      "E-commerce Development",
      "UI/UX Design",
      "AI-Powered Web Development"
    ]
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Credentials", href: "#credentials" }
  ],
  experience: [
    {
      title: "Frontend Development Intern",
      company: "DevelopersHub Corporation©",
      period: "March 2025 - July 2025",
      description: "Completed a comprehensive 6-week internship focusing on frontend development in a remote setting. Worked on multiple projects including e-commerce platforms and networking applications, gaining hands-on experience with modern web technologies.",
      achievements: [
        "Developed a responsive e-commerce website with pixel-perfect accuracy from Figma designs",
        "Created user-friendly interfaces for a networking platform with dashboard and chatbot integration",
        "Enhanced user engagement through optimized UI/UX implementations",
        "Successfully delivered projects using Next.js, Tailwind CSS, Typescript, and Shadcn"
      ],
      technologies: ["Next.js", "Tailwind CSS", "Typescript", "React", "Figma", "UI/UX Design"]
    }
  ],
  projects: [
    {
      title: "Ziybex",
      description: "Cutting-edge creative marketing agency platform specializing in web design, branding, and SEO solutions.",
      techStack: ["Next.js", "Sanity CMS", "Tailwind CSS", "Framer Motion", "Radix UI", "TypeScript"],
      category: "Web App",
      githubUrl: "https://github.com/shirazkk/Ziybex",
      liveUrl: "https://ziybex.com",
      featured: true
    },
    {
      title: "Jarvis Guardian AI",
      description: "Always-on AI guardian assistant for Windows using voice and face recognition, and continuous system monitoring.",
      techStack: ["Python", "Resemblyzer", "Google Speech-to-Text", "ElevenLabs", "Twilio", "Pillow"],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/Jarvis-Guardian-AI",
      liveUrl: null,
      featured: true
    },
    {
      title: "Personal AI Employee",
      description: "A local-first, file-based AI assistant powered by Claude Code CLI, Obsidian, and Gmail polling.",
      techStack: ["Python", "Claude Code CLI", "Gmail API", "Watchdog"],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/Personal-AI-Employee",
      liveUrl: null,
      featured: false
    },
    {
      title: "Ustad.ai",
      description: "Culturally-rooted, multi-agent AI tutoring platform for Pakistani students in Hinglish with board-specific syllabi.",
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Google Gemini"],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/Ustad.ai",
      liveUrl: null,
      featured: true
    },
    {
      title: "DarkVault",
      description: "Secure, anonymous, and PWA-ready file-sharing application with a minimalist hacker-themed interface.",
      techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
      category: "Web App",
      githubUrl: "https://github.com/shirazkk/Temporary-File-Sharing-Vault",
      liveUrl: "https://temporary-file-sharing-vault.vercel.app",
      featured: false
    },
    {
      title: "AI Todo Hackathon",
      description: "Production-ready todo application with AI-powered features, built with spec-driven development.",
      techStack: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Qdrant", "Google Generative AI"],
      category: "Full Stack",
      githubUrl: "https://github.com/shirazkk/Physicial_Ai_Book_Hackathon_1",
      liveUrl: null,
      featured: false
    }
  ],
  credentials: {
    certifications: [
      { name: "Fundamental AI Concepts", issuer: "UniAthena", date: "2025", logo: "/uniathena.jpeg" },
      { name: "React.js Certification", issuer: "HackerRank", date: "2024", logo: "/hackerrank.jpeg" },
      { name: "Introduction to TypeScript", issuer: "Great Learning", date: "2024", logo: "/great_learning.jpeg" },
      { name: "Fundamental Ai Concept", issuer: "Great Learning", date: "2024", logo: "/microsoft.jpeg" },
      { name: "AI Python", issuer: "DeepLearning.AI", date: "2024", logo: "/deeplearningai.jpeg" }
    ],
    education: [
      { degree: "Intermediate in Engineering", institution: "NCR-CET COLLEGE", year: "2021-2023", logo: "/ncr.png" },
      { degree: "Bachelor's in Artificial Intelligence", institution: "Sindh Madressatul Islam University", year: "2023-Present", logo: "/smiu.jpeg" },
      { degree: "Cloud Native Agentic AI Engineering", institution: "PIAIC", year: "2024-Present", logo: "/piaic.jpeg" }
    ],
    skills: [
      "Web Development", "Next.js", "React", "TypeScript", "Tailwind CSS",
      "UI/UX Design", "Clerk", "E-commerce Development", "OpenAI Agent SDK",
      "CrewAI", "LangChain", "Agentic AI", "Python", "FastAPI", "RAG",
      "API Integration", "LLM Applications", "Git", "Vercel", "Sanity CMS",
      "Stripe", "Figma", "Claude Code CLI", "Gmail API", "Watchdog",
      "Radix UI", "Framer Motion", "Qdrant", "PostgreSQL"
    ]
  },
  technicalSkills: {
    "Web Stack": ["Next.js", "React", "TypeScript", "Sanity CMS", "Tailwind CSS", "Node.js", "Clerk", "Radix UI", "Framer Motion"],
    "AI Stack": ["Python", "OpenAI-agent-sdk", "crewai", "langchain", "FastApi", "Qdrant", "Google Generative AI"],
    "tools": ["Git", "Vercel", "Stripe", "Figma", "Claude Code CLI", "Gmail API", "Watchdog", "Supabase"],
    "specializations": [
      "E-commerce Development",
      "CMS Integration", 
      "Web Performance Optimization",
      "OpenAI-agent-sdk",
      "RAG"
    ]
  }
}

export default portfolioData;
