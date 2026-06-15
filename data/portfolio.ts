export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  heroLabel: string;
  tags: string[];
  body: {
    heading: string;
    paragraphs: string[];
  }[];
};

export const portfolioData = {
  meta: {
    title: "Shiraz Ali | Full Stack Developer & Agentic AI Engineer",
    description:
      "Shiraz Ali, Full Stack Developer & Agentic AI Engineer. Building high-performance Next.js apps, cinematic 3D experiences, and autonomous AI systems.",
  },
  personal: {
    name: "Shiraz Ali",
    title: "Full Stack Developer | Agentic AI Developer",
    location: "Karachi, Sindh, Pakistan",
    avatar: "/profile.png",
    email: "shirazkk8@gmail.com",
    phone: "+92 327 3599802",
    availableForWork: true,
    heroStatement:
      "I design cinematic web experiences and build autonomous AI systems that turn product ideas into working software.",
    badges: [
      "Next.js",
      "Sanity CMS",
      "TypeScript",
      "OpenAI Agent SDK",
      "CrewAI",
    ],
    social: [
      {
        platform: "GitHub",
        url: "https://github.com/shirazkk",
        icon: "Github",
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/shirazali8",
        icon: "Linkedin",
      },
      { platform: "Twitter", url: "https://x.com/KkShiraz", icon: "Twitter" },
      { platform: "Instagram", url: "#", icon: "Instagram" },
    ],
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
  stats: [
    { value: "20+", label: "Projects shipped" },
    { value: "10+", label: "AI agents built" },
    { value: "2+", label: "Years building" },
  ],
  about: {
    bio: "I'm a Full Stack Web Developer and Agentic AI Developer based in Karachi. I build high-performance web applications using Next.js, React, TypeScript, and Sanity CMS. I also design intelligent AI systems powered by OpenAI Agent SDK, CrewAI, LangChain, and FastAPI. I work across the full spectrum of modern product development—from crafting pixel-perfect interfaces to architecting multi-agent AI pipelines. My goal is to build software that is both intelligent and highly performant.",
    focus: [
      "Building full-stack web applications with Next.js, React, TypeScript, and Sanity CMS",
      "Designing and deploying Agentic AI systems using OpenAI Agent SDK, CrewAI, and LangChain",
      "Developing AI-powered products from idea to launch with real-world impact",
      "Creating scalable backend APIs with FastAPI, PostgreSQL, and RAG pipelines",
      "Integrating AI into web platforms for smarter, autonomous user experiences",
    ],
    languages: [
      { name: "English", proficiency: "Intermediate", level: 70, flag: "US" },
      { name: "Urdu", proficiency: "Native", level: 100, flag: "PK" },
    ],
    interests: [
      "Agentic AI",
      "LLM applications",
      "AI-powered products",
      "E-commerce development",
      "UI/UX design",
      "Prompt engineering",
    ],
  },
  experience: [
    {
      title: "Lead Developer",
      company: "Ziybex - Creative Marketing & Web Agency",
      period: "Present",
      location: "Karachi Division, Sindh, Pakistan",
      description:
        "Working as Lead Developer at Ziybex, a creative marketing and web agency, delivering full-stack web solutions and AI-integrated tools for clients including luxury event companies and real estate venues.",
      achievements: [
        "Delivering full-stack web solutions for clients including luxury event companies and real estate venues",
        "Building AI-integrated marketing tools, transactional email systems, and high-converting landing pages",
        "Managing end-to-end engineering pipelines: architectural design → development → deployment",
        "Leading technical direction and ensuring scalable, production-grade code across all client projects",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "FastAPI",
        "Python",
        "Agentic AI",
        "Docker",
        "Vercel",
      ],
    },
    {
      title: "Founder",
      company: "CodePulse Innovations - Self-employed",
      period: "Jun 2025 - Present",
      location: "Karachi Division, Sindh, Pakistan",
      description:
        "Founded and developed FolioGenerator.com, an AI-driven platform that enables users to instantly create professional portfolio websites from their resumes.",
      achievements: [
        "Built and launched FolioGenerator.com end-to-end using modern web technologies with fast performance and scalability",
        "Implemented responsive and intuitive UI/UX for seamless access across all devices",
        "Integrated cloud hosting and scalable backend solutions to deliver a smooth global user experience",
        "Designed and deployed Agentic AI pipelines to automate portfolio generation from resume input",
        "Led product vision, branding, and growth strategy from idea to launch",
      ],
      technologies: [
        "Next.js",
        "FastAPI",
        "Agentic AI",
        "Prompt Engineering",
        "CSS",
        "Front-End Engineering",
      ],
    },
    {
      title: "Frontend Development Intern",
      company: "DevelopersHub Corporation",
      period: "March 2025 - July 2025",
      location: "Remote",
      description:
        "Completed a comprehensive 6-week internship focusing on frontend development in a remote setting. Worked on multiple projects including e-commerce platforms and networking applications, gaining hands-on experience with modern web technologies.",
      achievements: [
        "Developed a responsive e-commerce website with pixel-perfect accuracy from Figma designs",
        "Created user-friendly interfaces for a networking platform with dashboard and chatbot integration",
        "Enhanced user engagement through optimized UI/UX implementations",
        "Successfully delivered projects using Next.js, Tailwind CSS, TypeScript, and Shadcn",
      ],
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "TypeScript",
        "React",
        "Figma",
        "UI/UX Design",
      ],
    },
  ],
  projects: [
    {
      title: "Ziybex",
      description:
        "Cutting-edge creative marketing agency platform specializing in web design, branding, and SEO solutions.",
      techStack: [
        "Next.js",
        "Sanity CMS",
        "Tailwind CSS",
        "Framer Motion",
        "Radix UI",
        "TypeScript",
      ],
      category: "Web App",
      liveUrl: "https://ziybex.com",
      featured: true,
    },
    {
      title: "Jarvis Guardian AI",
      description:
        "Always-on AI guardian assistant for Windows using voice and face recognition, and continuous system monitoring.",
      techStack: [
        "Python",
        "Resemblyzer",
        "Google Speech-to-Text",
        "ElevenLabs",
        "Twilio",
        "computer-tools",
      ],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/Jarvis-Guardian-AI",
      liveUrl: null,
      featured: true,
    },
    {
      title: "AI Lead Generator",
      description:
        "Autonomous, end-to-end AI system that identifies businesses with weak online presence, scores their opportunity value, and generates hyper-personalized cold outreach emails — with a real-time Next.js dashboard and one-click email delivery via Resend.",
      techStack: [
        "Next.js",
        "FastAPI",
        "Google Gemini",
        "OpenRouter",
        "Firecrawl",
        "Supabase",
        "Resend",
        "Framer Motion",
        "TypeScript",
      ],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/ai-lead-generator",
      liveUrl: null,
      featured: true,
    },
    {
      title: "PaisaLog",
      description:
        "Collaborative household finance tracker with real-time expense syncing, transaction categorization, and multi-member household management — built on Supabase with Row Level Security.",
      techStack: [
        "Next.js",
        "TypeScript",
        "Supabase",
        "Tailwind CSS",
        "PostgreSQL",
        "Supabase Auth",
      ],
      category: "Web App",
      githubUrl: "https://github.com/shirazkk/paisalog",
      liveUrl: null,
      featured: false,
    },
    {
      title: "Personal AI Employee",
      description:
        "A local-first, file-based AI assistant powered by Claude Code CLI, Obsidian, and Gmail polling.",
      techStack: [
        "Python",
        "Claude Code CLI",
        "MCP Servers",
        "Watchdog",
        "Obsidian Vault",
      ],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/Personal-AI-Employee",
      liveUrl: null,
      featured: false,
    },
    {
      title: "Ustad.ai",
      description:
        "Culturally-rooted, multi-agent AI tutoring platform for Pakistani students in Hinglish with board-specific syllabus.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Google Gemini",
        "Vercel AI SDK",
        "Cloud Run",
      ],
      category: "AI/Agentic",
      githubUrl: "https://github.com/shirazkk/Ustad.ai",
      liveUrl: "https://ustad-ai-service-373424250185.us-central1.run.app/",
      featured: true,
    },
    {
      title: "Physical AI Book - Hackathon",
      description:
        "AI-powered book built with Docusaurus, Qdrant vector search, and Google Gen-AI. Developed using Spec-Driven Development.",
      techStack: [
        "Docusaurus",
        "FastAPI",
        "Qdrant",
        "Google Generative AI",
        "RAG",
        "Claude Code",
        "Python",
        "Spec-Driven Development",
      ],
      category: "Full Stack",
      githubUrl: "https://github.com/shirazkk/Physicial_Ai_Book_Hackathon_1",
      liveUrl: "https://shirazkk.github.io/Physicial_Ai_Book_Hackathon_1",
      featured: true,
    },
  ],
  blogPosts: [
    {
      slug: "agentic-ai-product-systems",
      title: "How I Think About Agentic AI Product Systems",
      excerpt:
        "A practical framework for moving from single prompts to reliable multi-step AI systems that can plan, act, and recover.",
      date: "2026-06-01",
      readTime: "5 min read",
      category: "Agentic AI",
      heroLabel: "Systems that execute",
      tags: ["Agents", "LLMs", "Product Engineering"],
      body: [
        {
          heading: "Start with the job, not the model",
          paragraphs: [
            "The strongest AI products begin with a clear operational job. The model is only one part of that system. The surrounding workflow, memory, tools, evaluation, and recovery paths decide whether the experience feels useful or fragile.",
            "For client work, I map the user's goal into repeatable states: input, planning, tool use, review, and final output. That structure makes the agent easier to test and easier to improve.",
          ],
        },
        {
          heading: "Design agents around constraints",
          paragraphs: [
            "Good agents need boundaries. They should know what tools are available, when to ask for more context, and when to stop. Without those constraints, an agent can look impressive in demos but fail in production.",
            "I prefer smaller agents with focused responsibilities over a single broad assistant. The result is easier debugging, clearer prompts, and better ownership of each step.",
          ],
        },
        {
          heading: "Make reliability visible",
          paragraphs: [
            "A useful agentic interface should show progress, decisions, and recoverable errors. Users trust a system more when they can understand what is happening and correct it when needed.",
            "The product layer matters as much as the AI layer. Clear UI, fast feedback, and honest limitations turn complex automation into something people can actually use.",
          ],
        },
      ],
    },
    {
      slug: "portfolio-automation-from-resumes",
      title: "Building Portfolio Automation From Resume Inputs",
      excerpt:
        "What I learned turning resumes into structured portfolio websites with AI-assisted extraction, design rules, and generation workflows.",
      date: "2026-05-18",
      readTime: "4 min read",
      category: "AI Products",
      heroLabel: "Resume to website",
      tags: ["Automation", "Portfolio", "Next.js"],
      body: [
        {
          heading: "The resume is raw material",
          paragraphs: [
            "A resume has experience, skills, education, and projects, but it is not automatically a good website. The first challenge is transforming that document into a clear story.",
            "The extraction layer should identify what matters most: strongest projects, proof of skills, recent work, contact details, and the audience the portfolio should target.",
          ],
        },
        {
          heading: "Generation needs design rules",
          paragraphs: [
            "AI can write copy and produce structure, but a professional portfolio needs consistent visual rules. Spacing, hierarchy, image handling, CTA placement, and responsive behavior need defined constraints.",
            "That is why I treat generation as a product workflow rather than a single prompt. Each step narrows the output until it is usable and editable.",
          ],
        },
        {
          heading: "The real value is speed with control",
          paragraphs: [
            "The goal is not to remove the person from the portfolio. The goal is to get them from a blank page to a strong first version quickly.",
            "A good automation system should produce something polished enough to share, but structured enough that the owner can refine it as their career changes.",
          ],
        },
      ],
    },
    {
      slug: "full-stack-ai-products",
      title: "What Full-Stack AI Products Need Beyond a Chat Box",
      excerpt:
        "Modern AI applications need product thinking, backend systems, evaluation, and interface design, not just a conversational surface.",
      date: "2026-04-30",
      readTime: "6 min read",
      category: "Full Stack",
      heroLabel: "Beyond chat UI",
      tags: ["Full Stack", "RAG", "UX"],
      body: [
        {
          heading: "AI features still need product architecture",
          paragraphs: [
            "A chat box is often the fastest interface to prototype, but it is rarely the full product. Real users need saved state, permissions, clear outputs, revision flows, and predictable performance.",
            "The backend has to support that experience with structured data, retrieval, queueing, logging, and guardrails.",
          ],
        },
        {
          heading: "Interfaces should reduce uncertainty",
          paragraphs: [
            "When an AI system is doing complex work, the UI should make each step legible. Inputs should be specific, output formats should be clear, and users should always know what action to take next.",
            "The best AI interfaces often combine forms, previews, editors, and status panels. Conversation is just one interaction pattern.",
          ],
        },
        {
          heading: "Shipping means measuring behavior",
          paragraphs: [
            "After launch, the question becomes whether the system performs reliably for real users. That requires logging failures, reviewing outputs, and improving prompts or tools based on evidence.",
            "Full-stack AI work is strongest when product, frontend, backend, and evaluation are treated as one system.",
          ],
        },
      ],
    },
  ] satisfies BlogPost[],
  credentials: {
    certifications: [
      {
        name: "Prompt Design in Vertex AI Skill Badge",
        issuer: "Google",
        date: "2026",
        logo: "/google.png",
      },
      {
        name: "Build a Website on Google Cloud Skill Badge",
        issuer: "Google",
        date: "2026",
        logo: "/google.png",
      },
      {
        name: "Claude Code in Action",
        issuer: "Anthropic",
        date: "2026",
        logo: "/anthropic.png",
      },
      {
        name: "OpenClaw Mastery for Everyone",
        issuer: "LevelUp Labs",
        date: "2026",
        logo: "/leveluplabs.png",
      },
      {
        name: "Claude Code 101",
        issuer: "Anthropic",
        date: "2026",
        logo: "/anthropic.png",
      },
      {
        name: "Agentic AI Professional Level 2 Developer",
        issuer: "PIAIC",
        date: "2026",
        logo: "/piaic.jpeg",
      },
      {
        name: "Agentic AI Level 1 Developer",
        issuer: "PIAIC",
        date: "2026",
        logo: "/piaic.jpeg",
      },
      {
        name: "Docker Fundamentals | Crash Course",
        issuer: "Udemy",
        date: "2025",
        logo: "/udemy.png",
      },
      {
        name: "Introduction to Model Context Protocol",
        issuer: "Anthropic",
        date: "2025",
        logo: "/anthropic.png",
      },
      {
        name: "Fundamental AI Concepts",
        issuer: "UniAthena",
        date: "2025",
        logo: "/uniathena.jpeg",
      },
      {
        name: "Basic of Python",
        issuer: "UniAthena",
        date: "2025",
        logo: "/uniathena.jpeg",
      },
      {
        name: "React Js",
        issuer: "HackerRank",
        date: "2024",
        logo: "/hackerrank.jpeg",
      },
      {
        name: "Introduction To TypeScript",
        issuer: "Great Learning",
        date: "2024",
        logo: "/great_learning.jpeg",
      },
      {
        name: "Fundamental AI Concept",
        issuer: "Microsoft",
        date: "2024",
        logo: "/microsoft.jpeg",
      },
      {
        name: "AI Python",
        issuer: "DeepLearning.AI",
        date: "2024",
        logo: "/deeplearningai.jpeg",
      },
    ],
    education: [
      {
        degree: "Intermediate in Engineering",
        institution: "NCR-CET COLLEGE",
        year: "2021-2023",
        logo: "/ncr.png",
      },
      {
        degree: "Bachelor's in Artificial Intelligence",
        institution: "Sindh Madressatul Islam University",
        year: "2023-Present",
        logo: "/smiu.jpeg",
      },
      {
        degree: "Cloud Native Agentic AI Engineering",
        institution: "PIAIC",
        year: "2024-Present",
        logo: "/piaic.jpeg",
      },
    ],
    skills: [
      {
        category: "Web Development",
        items: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "UI/UX Design",
          "Clerk",
          "Sanity CMS",
          "Radix UI",
          "Framer Motion",
        ],
      },
      {
        category: "Agentic AI",
        items: [
          "OpenAI Agent SDK",
          "CrewAI",
          "LangChain",
          "RAG",
          "Agentic AI",
          "Claude Code CLI",
          "Qdrant",
          "Prompt Engineering",
          "MCP",
        ],
      },
      {
        category: "Backend & Data",
        items: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Git",
          "Vercel",
          "Stripe",
          "API",
          "Supabase",
          "Docker",
          "Google Cloud",
        ],
      },
    ],
  },
  technicalSkills: {
    "Web Stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Sanity CMS",
      "Tailwind CSS",
      "Node.js",
      "Clerk",
      "Radix UI",
      "Framer Motion",
    ],
    "AI Stack": [
      "Python",
      "OpenAI Agent SDK",
      "CrewAI",
      "LangChain",
      "FastAPI",
      "Qdrant",
      "Google Generative AI",
      "Prompt Engineering",
      "MCP",
    ],
    tools: [
      "Git",
      "Vercel",
      "Stripe",
      "Figma",
      "Claude Code CLI",
      "Gmail API",
      "Supabase",
      "Docker",
      "Google Cloud",
    ],
    specializations: [
      "Agentic AI Product Development",
      "E-commerce Development",
      "CMS Integration",
      "Web Performance Optimization",
      "RAG Pipelines",
    ],
  },
};

export default portfolioData;
