// Instant, free answers for the most common questions.
// Anything answered here never reaches the OpenAI API, which keeps running costs near zero
// for the suggestion chips and simple one-word questions.
import { PROFILE, EXPERIENCE, PROJECTS, dateRange, durationLabel, formatMonth, isCurrent } from "../../data/profile";

export const QUICK_PROMPTS = {
  experience: "What's his work experience?",
  current: "What is he working on now?",
  projects: "Show me his projects",
  skills: "What are his skills?",
  education: "What is he studying?",
  contact: "How can I contact him?",
  cv: "Can I see his CV?",
  hobbies: "What does he do for fun?",
};

export const WELCOME_PROMPTS = ["experience", "projects", "skills", "contact"].map((k) => QUICK_PROMPTS[k]);

const FOLLOW_UPS = {
  experience: ["current", "skills", "cv"],
  current: ["experience", "projects", "contact"],
  projects: ["skills", "experience", "contact"],
  skills: ["projects", "experience", "education"],
  education: ["experience", "projects", "skills"],
  contact: ["cv", "experience", "projects"],
  cv: ["experience", "contact", "projects"],
  hobbies: ["projects", "experience", "contact"],
  greeting: ["experience", "projects", "skills"],
  thanks: ["contact", "cv", "projects"],
  offTopic: ["experience", "projects", "contact"],
  site: ["projects", "skills", "contact"],
};

export function followUpsFor(intent, alreadyAsked = []) {
  const keys = FOLLOW_UPS[intent] || FOLLOW_UPS.greeting;
  const asked = new Set(alreadyAsked.map(normalize));
  const pool = [...keys, ...Object.keys(QUICK_PROMPTS)];
  const out = [];
  for (const k of pool) {
    const q = QUICK_PROMPTS[k];
    if (q && !asked.has(normalize(q)) && !out.includes(q)) out.push(q);
    if (out.length === 3) break;
  }
  return out;
}

export function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9#+. ]/g, " ").replace(/\s+/g, " ").trim();
}

// ---------- Answers ----------

function currentAnswer() {
  const job = EXPERIENCE.find((j) => isCurrent(j));
  const edu = PROFILE.education;
  if (!job) {
    return `Diarmuid is currently focused on his ${edu.degree.split(",")[0]} at ${edu.school}. ${edu.status}\n\nSee his previous roles on the [experience timeline](/#experience).`;
  }
  const path = job.stages
    ? `He joined as a **${job.stages[0].title}** in ${formatMonth(job.stages[0].start)} and stayed on as a **${job.stages[job.stages.length - 1].title}**.`
    : `He started in ${formatMonth(job.start)}.`;
  const ending = job.end
    ? ` He finishes up there in **${formatMonth(job.end)}** to return to ${edu.school} for his 4th year.`
    : "";
  return `Diarmuid is currently a **${job.role}** at the **${job.company}**, working ${job.workplace.toLowerCase()} in ${job.location}. ${path}${ending}\n\nThe work centres on ${job.skills.join(" and ").toLowerCase()}.`;
}

const ANSWERS = {
  experience: () =>
    `Here's where Diarmuid has worked, newest first:\n\n${EXPERIENCE.map(
      (j) => `- **${j.role}**, ${j.company} (${dateRange(j)}, ${durationLabel(j.start, j.end)})`
    ).join("\n")}\n\nHis tech roles cover software engineering, IT administration and teaching code. You can see the details on the [experience timeline](/#experience).`,

  current: currentAnswer,

  projects: () =>
    `Some of the things Diarmuid has built:\n\n${PROJECTS.map(
      (p) => `- **${p.slug ? `[${p.title}](/projects/${p.slug})` : p.title}**: ${firstSentence(p.description)}`
    ).join("\n")}\n\nPick one to open its write-up.There's more on his [GitHub](${PROFILE.links.github}).`,

  skills: () =>
    `${Object.entries(PROFILE.skills)
      .map(([group, list]) => `- **${group}**: ${list.join(", ")}`)
      .join("\n")}\n\nHe's strongest in C#, TypeScript/JavaScript, Python and React.`,

  education: () =>
    `Diarmuid is studying for a **${PROFILE.education.degree}** at **${PROFILE.education.school}**. ${PROFILE.education.status} ${PROFILE.education.note}\n\nHe started coding with Scratch for his Junior Cert and got into Python for his Leaving Cert.`,

  contact: () =>
    `The best ways to reach Diarmuid:\n\n- **Email**: ${PROFILE.email}\n- **Contact form**: [on this site](/#contact)\n- **LinkedIn**: [linkedin.com/in/d-hession](${PROFILE.links.linkedin})\n- **GitHub**: [DiarmuidHe](${PROFILE.links.github})`,

  cv: () =>
    `You can [view Diarmuid's CV here](/cv). It covers his experience, projects, technical skills and education at ${PROFILE.education.school}.`,

  hobbies: () =>
    `When he's not coding, Diarmuid enjoys **traveling**, **reading** and **gaming**. He also codes for fun, which is how a lot of the projects on this site started.`,

  site: () =>
    `Diarmuid built this site himself with **React**, **Bootstrap** and **Framer Motion**. It's hosted on **Netlify**, with images on **AWS S3**. I'm part of it too: a chat assistant running on a Netlify serverless function.`,

  greeting: () =>
    `Hi, I'm the assistant on Diarmuid's site. Ask me about his experience, projects, skills, education or how to get in touch.`,

  thanks: () => `You're welcome! Anything else you'd like to know about Diarmuid?`,

  offTopic: () =>
    `I'm Diarmuid's portfolio assistant, so I can only help with questions about **him**: his experience, projects, skills, education, or how to get in touch.`,
};

function firstSentence(text) {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

// ---------- Intent matching ----------
// A message is only answered locally when *every* meaningful word belongs to one topic.
// "What are his skills?" -> local. "How did he use Python at QTP?" -> AI, for a proper answer.

const FILLER = new Set(
  ("a an and any about are as at be can could did do does for from get give got has have he her hey hi him his how i id " +
    "im in is it its just know like list look me more mr my of on or please quick s see share show so some tell tell " +
    "that the their them there these this to u us want was we what whats where which who whos why will with would you " +
    "your diarmuid hession diarmuids hessions briefly summary summarise summarize overview")
    .split(" ")
);

const PHRASES = [
  [/\bget in touch\b|\breach out\b|\be mail\b/g, " contact "],
  [/\bwork history\b|\bwork experience\b|\bworked at\b|\bworked\b/g, " experience "],
  [/\btech stack\b|\bprogramming languages?\b/g, " skills "],
  [/\bfree time\b|\bspare time\b|\bfor fun\b/g, " hobbies "],
  [/\bcurriculum vitae\b/g, " cv "],
  [/\bwho (built|made|created) (this|the) (site|website|page)\b|\bthis (site|website)\b/g, " site "],
  [/\b(right now|at the moment|these days|currently|current|now|present)\b/g, " current "],
  [/\bgood (morning|afternoon|evening)\b/g, " hello "],
  [/\bthank you\b/g, " thanks "],
];

const VOCAB = {
  greeting: { anchors: ["hello", "hiya", "howdy", "yo"], extra: ["there", "again"] },
  thanks: { anchors: ["thanks", "thank", "cheers", "ty", "thx"], extra: ["great", "cool", "nice", "awesome", "perfect", "much", "lot", "very", "ok", "okay"] },
  cv: { anchors: ["cv", "resume"], extra: ["copy", "download", "view", "read", "open"] },
  contact: { anchors: ["contact", "email", "reach", "hire", "linkedin"], extra: ["details", "info", "information", "address", "message", "best", "way", "ways", "profile"] },
  current: { anchors: ["current"], extra: ["job", "role", "working", "work", "doing", "employed", "employer", "position", "up", "internship", "company"] },
  experience: { anchors: ["experience", "jobs", "employment", "career", "timeline", "roles"], extra: ["job", "past", "previous", "professional", "background", "history"] },
  projects: { anchors: ["projects", "project", "portfolio", "github"], extra: ["built", "build", "made", "apps", "work", "best", "favourite", "favorite", "recent", "side"] },
  skills: { anchors: ["skills", "skill", "stack", "technologies", "tech", "languages", "tools"], extra: ["technology", "main", "technical", "top", "key", "core", "good", "best"] },
  education: { anchors: ["education", "study", "studying", "studies", "college", "university", "degree", "course", "qualifications"], extra: ["atu", "sligo", "student", "grades", "year"] },
  hobbies: { anchors: ["hobbies", "hobby", "interests"], extra: ["interest", "enjoy", "enjoys", "free", "outside", "coding", "fun", "work"] },
  site: { anchors: ["site", "website"], extra: ["built", "made", "created", "tech", "stack"] },
};

// When vocabularies overlap, the first intent in this list wins.
const PRIORITY = ["cv", "contact", "current", "education", "hobbies", "site", "experience", "projects", "skills", "thanks", "greeting"];

// Obvious general-purpose requests. Refused locally so they never cost a token.
// Only applied when the message doesn't mention Diarmuid at all.
const OFF_TOPIC = [
  /\b(write|generate|compose|create|make)\b.*\b(poem|essay|story|song|lyrics|code|script|function|program|letter)\b/,
  /\b(capital of|recipe|translate|homework|solve|equation|stock price|bitcoin|crypto|lottery|horoscope|weather (in|for|today|tomorrow))\b/,
  /\b(ignore|forget|disregard)\b.*\b(instructions|prompt|rules)\b/,
  /\b(system prompt|jailbreak|pretend (to be|you are)|act as|roleplay)\b/,
];

const ABOUT_HIM = /\b(diarmuid|hession|he|him|his)\b/;

export function matchIntent(text) {
  const n = normalize(text);
  if (!n) return null;

  const exact = Object.entries(QUICK_PROMPTS).find(([, q]) => normalize(q) === n);
  if (exact) return exact[0];

  if (!ABOUT_HIM.test(n) && OFF_TOPIC.some((re) => re.test(n))) return "offTopic";

  let t = ` ${n.replace(/[.#+]/g, " ")} `;
  for (const [re, rep] of PHRASES) t = t.replace(re, rep);
  const words = t.split(" ").filter((w) => w && !FILLER.has(w));
  if (!words.length) return /^(hi|hey|hello|hiya|howdy|yo)\b/.test(n) ? "greeting" : null;
  if (words.length > 5) return null;

  // An intent matches when at least one of its anchor words is present
  // and every remaining word is part of its vocabulary.
  for (const intent of PRIORITY) {
    const { anchors, extra } = VOCAB[intent];
    if (words.some((w) => anchors.includes(w)) && words.every((w) => anchors.includes(w) || extra.includes(w))) {
      return intent;
    }
  }
  return null;
}

export function localAnswer(intent) {
  return ANSWERS[intent]?.() ?? null;
}
