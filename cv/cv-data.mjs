// CV-only content.
//
// Everything that also lives on the site (name, links, education, skills,
// job titles, companies, dates, project links) is pulled from
// src/data/profile.js by build-cv.mjs, so the CV and the site cannot drift.
// This file holds only what the CV says differently: the tighter, metric-led
// bullets, the short project blurbs and the print-only extras.
//
// Overriding `role` or `company` here is allowed, but the build prints a
// warning when the override disagrees with profile.js, so drift stays visible.

export const CV = {
  address: "Churchtown, Ballinea, Mullingar, Co. Westmeath",

  // ATU Sligo line under the EDUCATION heading. `yearLabel` names the year the
  // grades table shows; the grades themselves come from profile.js.
  education: {
    status: "ATU Sligo Year 4 Student",
    gradesYearLabel: "Year 3",
  },

  // Roles in CV order, keyed by the ids in EXPERIENCE (src/data/profile.js).
  // Year labels are derived from the profile dates.
  experience: [
    {
      id: "dsp",
      bullets: [
        "Joined as a Software Engineer Intern and was retained as a Software Engineer.",
        "Served as a Developer, System Tester and Business Analyst across the SDLC.",
        "Dealt with and resolved 20+ tickets across features, defect fixes and system testing.",
        "Built features in C#, SQL and Angular on a Model-View-Controller architecture, working in Azure DevOps with Git branching and peer-reviewed pull requests.",
        "Attended and hosted daily stand-up meetings, delivering to Agile methodologies.",
      ],
    },
    {
      id: "qtp",
      // The site lists this as "IT Administrator" at "Quality Tractor Parts Ltd."
      role: "I.T. Administrator Intern",
      company: "QTP",
      bullets: [
        "Automated 3+ repetitive tasks with Python scripts, saving 10+ hours/week.",
        "Contributed to daily Agile sprints, completing 12+ tickets per sprint.",
        "Assisted in rollout of 2FA system, securing 1,000+ customer accounts.",
        "Reduced IT ticket resolution time to under 24 hours.",
      ],
    },
    {
      id: "coderdojo",
      role: "Volunteer Coding Mentor",
      company: "CoderDojo Mullingar",
      bullets: [
        "Taught coding basics to groups of 10–15 students, adapting to diverse learning styles.",
        "Collaborated with 5+ mentors to design engaging sessions, increasing retention.",
      ],
    },
    {
      id: "doj",
      bullets: [
        "Counted and tallied votes as part of the count team, and assisted voters as Poll Clerk in line with electoral procedures.",
      ],
    },
    {
      id: "mcdonalds",
      company: "McDonald’s Mullingar",
      bullets: [
        "Delivered efficient service in a high-pressure environment, serving 300+ customers daily.",
      ],
    },
  ],

  // `siteTitle` links the entry to a project in portfolio.json, which supplies
  // the case-study link. Omit it for projects that are not on the site.
  projects: [
    {
      title: "AABCI – AI Automated Ballot Counter Ireland",
      siteTitle: "AABCI - AI Automated Ballot Counter Ireland",
      tech: "Python, PyTorch, YOLO, TensorFlow, OpenCV, AWS, Docker, PostgreSQL",
      blurb:
        "Built in collaboration with an electoral commission consultant. Verifies a ballot’s official stamp with a YOLO model, reads the handwritten preferences with a TensorFlow network and flags anything uncertain for a person, keeping a full audit trail.",
    },
    {
      title: "Aithne Fish Detection",
      siteTitle: "Aithne Fish Detection",
      tech: "Python, VIAME, FastAPI, PostgreSQL, React, TypeScript, Docker",
      blurb:
        "An AI system that detects, tracks, counts and identifies fish in underwater video and on 17 live ocean cameras, with a human review queue and CSV exports.",
    },
    {
      title: "AI Portfolio Chat Bot",
      siteTitle: "Chat Bot",
      tech: "Open AI, React, JSON",
      blurb:
        "An interactive portfolio chat bot designed to provide information about projects, skills, and background, offering visitors an engaging way to explore the portfolio.",
    },
    {
      title: "Game Platform",
      siteTitle: "C# Game Platform",
      tech: "C#, Classes, .Net, Unit testing, IGDB API, LINQ, Local SQL Database, WPF",
      blurb:
        "Developed a platform supporting login, browsing, and purchases for 428,000+ games from the IGDB API.",
    },
  ],

  // One line each, under an OTHER PROJECTS heading, linked to their case study
  // on the site: they repeat skills the projects above already demonstrate.
  otherProjects: [
    {
      title: "Personal Portfolio",
      siteTitle: "My Portfolio",
      tech: "React, Node, S3, Netlify, Google SEO, Bootstrap, Twilio",
    },
    {
      title: "Weather App",
      siteTitle: "Weather Pulse",
      tech: "React, CSS, JavaScript, Bootstrap, OpenWeather API, local storage",
    },
    {
      title: "Angular Game Platform",
      siteTitle: "Angular Game Platform",
      tech: "Angular, TypeScript, Swiper.js, REST APIs",
    },
    {
      title: "WearMore",
      siteTitle: "WearMore",
      tech: "JavaScript, Bootstrap, authentication, GitHub Pages",
    },
  ],

  // The site phrases these in the third person; the CV keeps its own wording.
  softSkills: [
    {
      name: "Problem Solving",
      text: "Quickly adapted to new tools and frameworks, troubleshooting integration issues to keep projects on track.",
    },
    {
      name: "Teamwork",
      text: "Partnered with a UX designer on website updates that refined navigation and user flow.",
    },
    {
      name: "Communication",
      text: "Documented key points from internal and external meetings in concise reports, ensuring team members had clear references for follow-up actions.",
    },
    {
      name: "Adaptability",
      text: "Balanced academic work with part-time shifts at McDonald’s and volunteer mentoring at CoderDojo, thriving in high-pressure environments.",
    },
  ],

  references: "References available upon request.",
};
