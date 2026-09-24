// CV-only content.
//
// Everything that also lives on the site (name, links, education,
// job titles, companies, dates, project links) is pulled from
// src/data/profile.js by build-cv.mjs, so the CV and the site cannot drift.
// This file holds CV wording, a focused selection of existing skills,
// project summaries and print-only extras.
//
// Overriding `role` or `company` here is allowed, but the build prints a
// warning when the override disagrees with profile.js, so drift stays visible.

export const CV = {
  address: "Churchtown, Ballinea, Mullingar, Co. Westmeath",

  // Selected technical modules; grades and degree details come from profile.js.
  education: {
    gradesYearLabel: "Selected Year 3 modules",
    modules: ["Open Stack Development", "Database Programming", "Mobile Application Development", "Project 300"],
  },

  // Curated from PROFILE.skills and the documented work and project stacks.
  skills: {
    Languages: ["C#", "Python", "Java", "JavaScript", "TypeScript", "SQL"],
    "Frameworks & Databases": [".NET", "Angular", "React", "Node.js", "FastAPI", "PostgreSQL"],
    "Cloud & DevOps": ["AWS", "Azure", "Docker", "Linux", "CI/CD with GitHub Actions"],
    "Development & Testing": ["Git", "Azure DevOps", "pull requests", "unit testing", "Agile"],
    "AI & Computer Vision": ["PyTorch", "TensorFlow", "YOLO", "OpenCV"],
  },

  // Roles in CV order, keyed by the ids in EXPERIENCE (src/data/profile.js).
  // Year labels are derived from the profile dates.
  experience: [
    {
      id: "dsp",
      bullets: [
        "Started as a software engineering intern and continued as a Software Engineer after three months.",
        "Built and tested MyWelfare features in a C#/.NET MVC application using Angular and SQL.",
        "Resolved more than 20 tickets covering feature changes, defect fixes and system testing. Also contributed to business analysis.",
        "Used Git branches and took part in pull request reviews through Azure DevOps. Joined daily stand-ups and led some of them.",
      ],
    },
    {
      id: "qtp",
      bullets: [
        "Wrote Python scripts to automate three recurring tasks, saving at least 10 hours a week.",
        "Completed 12 or more tickets per sprint and took part in sprint planning and daily scrums.",
        "Helped roll out two-factor authentication for more than 1,000 customer accounts. Reduced IT ticket resolution time to under 24 hours.",
      ],
    },
    {
      id: "coderdojo",
      role: "Volunteer Coding Mentor",
      company: "CoderDojo Mullingar",
      bullets: [
        "Taught coding to groups of 10 to 15 students, adapting explanations to their needs.",
        "Planned coding sessions with five fellow mentors.",
      ],
    },
    {
      id: "doj",
      bullets: [
        "Counted and tallied votes with the count team and assisted voters as Poll Clerk, following electoral procedures.",
      ],
    },
    {
      id: "mcdonalds",
      company: "McDonald’s Mullingar",
      bullets: [
        "Worked with the crew to serve more than 300 customers a day during busy shifts.",
      ],
    },
  ],

  // `siteTitle` links the entry to a project in portfolio.json, which supplies
  // the case-study link. Omit it for projects that are not on the site.
  projects: [
    {
      title: "AABCI: AI Automated Ballot Counter Ireland",
      siteTitle: "AABCI - AI Automated Ballot Counter Ireland",
      tech: "Python, PyTorch, YOLO, TensorFlow, OpenCV, AWS, Docker, PostgreSQL",
      bullets: [
        "Developed ballot recognition software with an electoral commission consultant. It uses YOLO to detect official stamps, OpenCV checks to verify them and TensorFlow to read handwritten preferences. Uncertain results are flagged for human review.",
        "Connected AWS S3 processing with PostgreSQL storage and audit records. DynamoDB locks and database constraints prevent duplicate counting.",
      ],
    },
    {
      title: "Aithne Fish Detection",
      siteTitle: "Aithne Fish Detection",
      tech: "Python, VIAME, FastAPI, PostgreSQL, React, TypeScript, Docker",
      bullets: [
        "Built a full stack application that detects, tracks and counts fish passages in uploaded video and across 17 live underwater cameras. It can also identify species through the Fishial AI API.",
        "Connected VIAME processing to a FastAPI backend and React dashboard. PostgreSQL row locks coordinate video jobs; the application also supports human review and CSV exports, with the API and workers running as Docker services.",
      ],
    },
    {
      title: "AI Portfolio Chat Bot",
      siteTitle: "Chat Bot",
      tech: "React, Node.js, OpenAI API, Netlify",
      bullets: [
        "Connected a React chat interface to a Node.js serverless function to answer portfolio questions using shared profile data. Added input validation, response caching and request limits to manage API usage.",
      ],
    },
    {
      title: "Game Platform",
      siteTitle: "C# Game Platform",
      tech: "C#, .NET, WPF, SQL, LINQ, IGDB API",
      bullets: [
        "Created a desktop application for login, game browsing, purchases and library management. It uses the IGDB API for a catalogue of more than 428,000 games, alongside a local SQL database, LINQ queries and unit tests.",
      ],
    },
  ],

  // One line each, under an OTHER PROJECTS heading, linked to their case study
  // on the site: they repeat skills the projects above already demonstrate.
  otherProjects: [
    {
      title: "Personal Portfolio",
      siteTitle: "My Portfolio",
      tech: "React, Node.js, AWS S3, Netlify",
    },
    {
      title: "Weather App",
      siteTitle: "Weather Pulse",
      tech: "React, JavaScript, OpenWeather API, local storage",
    },
    {
      title: "Angular Game Platform",
      siteTitle: "Angular Game Platform",
      tech: "Angular, TypeScript, REST APIs",
    },
  ],

  // The site phrases these in the third person; the CV keeps its own wording.
  workingPractices: [
    {
      name: "Teamwork",
      text: "Worked with a UX designer to improve website navigation and user flow.",
    },
    {
      name: "Communication",
      text: "Wrote reports from internal and external meetings, recording key points and next actions.",
    },
  ],

};
