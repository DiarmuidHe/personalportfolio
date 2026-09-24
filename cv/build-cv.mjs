// Builds the CV PDF from src/data/profile.js + cv/cv-data.mjs.
//
//   npm run cv
//
// Output: cv/out/cv.html (for previewing in a browser) and
//         public/Diarmuid-Hession-CV.pdf (what /cv serves).
//
// The layout copies the original Word CV. Every number in the CSS below was
// measured out of cv/archive/2025-DiarmuidHession-LinkedIn-CV.pdf, an A4 page
// of 595.32 x 841.92 pt:
//
//   banner        -6.1 766.22 605.25 75.55 re   -> full bleed, 75.55pt tall
//   lighter wedge (75.25,766.92) (94.137,842.47) (540.1,842.47) (521.21,766.92)
//   contact box   128.15 749.87 338.75 23.1 re  -> 338.75 x 23.1pt, hanging
//                                                  16.35pt below the banner
//   text margins  72pt both sides, bullets at 90pt, bullet text at 108pt
//   type          body 11.04pt, job + project titles 12pt, section headings 12.96pt
//   first heading  baseline 141.4pt down the page, i.e. 54pt below the banner
//
// The PDF is printed by headless Edge/Chrome, so there are no extra npm
// dependencies. Set EDGE_PATH if your browser lives somewhere unusual.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const outDir = path.join(here, "out");
const htmlPath = path.join(outDir, "cv.html");
const pdfPath = path.join(root, "public", "Diarmuid-Hession-CV.pdf");

const warnings = [];
const warn = (msg) => warnings.push(msg);

// ---------- load profile.js ----------
// profile.js is CRA/ESM source that imports JSON, which plain Node cannot do,
// so inline the JSON and import the result as a module.
async function loadProfile() {
  const src = fs.readFileSync(path.join(root, "src", "data", "profile.js"), "utf8");
  const json = fs.readFileSync(path.join(root, "src", "JsonFolders", "portfolio.json"), "utf8");
  const shimmed = src.replace(
    /import\s+portfolio\s+from\s+["'][^"']+["'];?/,
    `const portfolio = ${json};`
  );
  if (shimmed === src) throw new Error("Could not inline portfolio.json into profile.js");
  fs.mkdirSync(outDir, { recursive: true });
  const shimPath = path.join(outDir, "profile.gen.mjs");
  fs.writeFileSync(shimPath, shimmed);
  return import(`${pathToFileURL(shimPath).href}?v=${Date.now()}`);
}

// ---------- helpers ----------
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const yearsLabel = (job) => {
  const start = job.start.slice(0, 4);
  const end = job.end ? job.end.slice(0, 4) : "Present";
  return start === end ? `(${start})` : `(${start} - ${end})`;
};

function icon(name, icons) {
  const i = icons[name];
  if (!i) return "";
  const paths = i.paths.map((d) => `<path d="${d}"/>`).join("");
  return `<svg class="ico" viewBox="${i.viewBox}" aria-hidden="true">${paths}</svg>`;
}

function projectLink(p, bySiteTitle, PROFILE) {
  if (!p.siteTitle) return null;
  const site = bySiteTitle[p.siteTitle];
  if (!site) {
    warn(`Project "${p.siteTitle}" is no longer in portfolio.json - link dropped.`);
    return null;
  }
  return site.slug ? `${PROFILE.links.portfolio}/projects/${site.slug}` : null;
}

function projectTitle(p, bySiteTitle, PROFILE) {
  const href = projectLink(p, bySiteTitle, PROFILE);
  return href
    ? `<a class="proj" href="${esc(href)}">${esc(p.title)}</a>`
    : `<span class="proj">${esc(p.title)}</span>`;
}

// ---------- sections ----------
function skillsSection(CV, PROFILE) {
  const seen = new Set();
  const rows = Object.entries(CV.skills || PROFILE.skills)
    .map(([group, items]) => {
      const kept = items.filter((s) => {
        const k = s.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (!kept.length) return "";
      return `<li><strong>${esc(group)}:</strong> ${esc(kept.join(", "))}</li>`;
    })
    .join("");
  return `<section><h2>TECHNICAL SKILLS</h2><ul class="bullets">${rows}</ul></section>`;
}

function experienceSection(entries, EXPERIENCE, heading) {
  const byId = Object.fromEntries(EXPERIENCE.map((j) => [j.id, j]));
  const blocks = entries.map((entry) => {
    const job = byId[entry.id];
    if (!job) {
      warn(`No role with id "${entry.id}" in profile.js EXPERIENCE - skipped.`);
      return "";
    }
    const role = entry.role || job.role;
    const company = entry.company || job.company;
    if (entry.role && entry.role !== job.role)
      warn(`"${entry.id}": CV role "${entry.role}" differs from profile.js "${job.role}".`);
    if (entry.company && entry.company !== job.company)
      warn(`"${entry.id}": CV company "${entry.company}" differs from profile.js "${job.company}".`);
    const bullets = entry.bullets || job.highlights;
    return `<div class="entry">
      <p class="entry-head"><span class="role">${esc(role)}</span> | ${esc(company)} <span class="years">${esc(yearsLabel(job))}</span></p>
      <ul class="bullets">${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>`;
  });
  return `<section><h2>${esc(heading)}</h2>${blocks.join("")}</section>`;
}

function projectsSection(CV, PROJECTS, PROFILE) {
  const bySiteTitle = Object.fromEntries(PROJECTS.map((p) => [p.title, p]));
  const blocks = CV.projects.map(
    (p) => `<div class="entry">
      <p class="entry-head">${projectTitle(p, bySiteTitle, PROFILE)} | <span class="tech">${esc(p.tech)}</span></p>
      <ul class="bullets">${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>`
  );
  return `<section class="projects"><h2>PROJECTS</h2>${blocks.join("")}</section>`;
}

// One line each, linked to their case study on the site, for the projects that
// would otherwise repeat skills the bigger projects already show.
function otherProjectsSection(CV, PROJECTS, PROFILE) {
  if (!CV.otherProjects?.length) return "";
  const bySiteTitle = Object.fromEntries(PROJECTS.map((p) => [p.title, p]));
  const items = CV.otherProjects
    .map(
      (p) =>
        `<li class="entry-head">${projectTitle(p, bySiteTitle, PROFILE)} | <span class="tech">${esc(p.tech)}</span></li>`
    )
    .join("");
  return `<section class="projects"><h2>OTHER PROJECTS</h2><ul class="bullets tight">${items}</ul></section>`;
}

function educationSection(CV, PROFILE) {
  const { education } = PROFILE;
  const modules = (education.yearThree?.modules || []).filter((m) =>
    CV.education.modules.includes(m.title)
  );
  const rows = modules
    .map((m) => `<tr><td>${esc(m.title)}</td><td class="grade">${esc(m.grade)}%</td></tr>`)
    .join("");
  const classification = education.yearThree?.classification || "";
  return `<section class="education"><h2>EDUCATION</h2>
    <p class="edu-line"><strong>${esc(education.degree)}</strong> | <em>${esc(education.school)}</em></p>
    <p class="edu-line">Expected graduation: ${esc(education.graduation)}</p>
    <p class="edu-line"><strong>Year 3 result: ${esc(classification)}</strong></p>
    <table class="grades">
      <caption>${esc(CV.education.gradesYearLabel)}</caption>
      <thead><tr><th>Module</th><th>Grade</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

function workingPracticesSection(CV) {
  const items = CV.workingPractices
    .map((s) => `<li><strong>${esc(s.name)}:</strong> ${esc(s.text)}</li>`)
    .join("");
  return `<section><h2>TEAMWORK & COMMUNICATION</h2><ul class="bullets">${items}</ul></section>`;
}

// ---------- page ----------
function render({ PROFILE, EXPERIENCE, PROJECTS, CERTIFICATES }, CV, icons, logo) {
  const links = [
    ["email", `mailto:${PROFILE.email}`, PROFILE.email],
    ["portfolio", PROFILE.links.portfolio, "Portfolio"],
    ["linkedin", PROFILE.links.linkedin, "LinkedIn"],
    ["github", PROFILE.links.github, "GitHub"],
  ]
    .map(([key, href, label]) => {
      const mark =
        key === "portfolio" ? `<img class="ico logo" src="${logo}" alt="">` : icon(key, icons);
      return `<a href="${esc(href)}">${mark}<span>${esc(label)}</span></a>`;
    })
    .join('<span class="sep">|</span>');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(PROFILE.name)} - CV</title>
<style>
  /* Side margins are 0 so the banner reaches the paper edge; the 72pt text
     margin comes from .sheet instead. */
  @page { size: A4; margin: 72pt 0; }
  @page :first { margin-top: 0; }

  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    font-family: Calibri, "Segoe UI", Carlito, sans-serif;
    font-size: 11.04pt;
    line-height: 1.25;
    color: #17202a;
  }
  .sheet { padding: 0 72pt; }
  a { color: #467886; }

  /* ---- banner ---- */
  .banner {
    position: relative;
    height: 75.55pt;
    margin-bottom: 54pt;
    background: #2C3E50;
    color: #fff;
    text-align: center;
    box-shadow: 0 1.5pt 3pt rgba(0, 0, 0, .3);
  }
  /* The lighter slanted band across the middle of the banner. */
  .banner::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #34495E;
    clip-path: polygon(15.81% 0, 90.73% 0, 87.55% 100%, 12.64% 100%);
  }
  .banner h1, .banner .address { position: relative; }
  .banner h1 {
    margin: 0;
    padding-top: 6pt;
    font-size: 28pt;
    font-weight: 700;
    line-height: 1.05;
  }
  .banner .address { margin: 1pt 0 0; font-size: 11.04pt; }

  .contact {
    position: absolute;
    left: 50%;
    top: 68.95pt;
    transform: translateX(-50%);
    width: 338.75pt;
    height: 23.1pt;
    line-height: 21.6pt;
    background: #fff;
    border: 0.75pt solid #042433;
    box-shadow: 0 1pt 2pt rgba(0, 0, 0, .35);
    font-size: 12pt;
    white-space: nowrap;
  }
  .contact a {
    color: #467886;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
  }
  .contact .sep { color: #153D63; margin: 0 3.5pt; }
  .ico { width: 10pt; height: 10pt; fill: #17202a; vertical-align: -1pt; margin-right: 2.5pt; }
  .ico.logo { border-radius: 50%; }

  /* ---- sections ---- */
  h2 {
    margin: 12pt 0 3pt;
    padding-bottom: 1pt;
    border-bottom: 1.5pt solid #153D63;
    color: #153D63;
    font-size: 12.96pt;
    font-weight: 700;
    break-after: avoid;
  }
  .entry { break-inside: avoid; }
  .entry-head { margin: 5pt 0 1pt; font-size: 12pt; color: #34495E; }
  .entry-head .role { font-weight: 700; font-style: italic; }
  .entry-head .years, .entry-head .tech { font-style: italic; }
  .entry-head .proj {
    font-weight: 700;
    font-style: italic;
    color: #467886;
    text-decoration: underline;
  }

  ul.bullets { margin: 0; padding-left: 36pt; list-style: none; }
  ul.bullets li { position: relative; margin: 0 0 2.4pt; }
  ul.bullets li::before { content: "\\2022"; position: absolute; left: -18pt; }
  ul.tight li { margin: 0; }

  .edu-line { margin: 0; }
  table.grades {
    border-collapse: collapse;
    margin: 4pt auto 0;
    width: 235pt;
  }
  table.grades caption { font-weight: 700; padding-bottom: 2pt; }
  table.grades th, table.grades td { border: 0.75pt solid #34495E; padding: 1pt 5pt; }
  table.grades thead th { background: #34495E; color: #fff; text-align: center; }
  table.grades td.grade { text-align: center; width: 70pt; }
  .training { margin: 0; }
</style>
</head>
<body>
  <header class="banner">
    <h1>${esc(PROFILE.name)}</h1>
    <p class="address">${esc(CV.address)}</p>
    <div class="contact">${links}</div>
  </header>

  <main class="sheet">
    ${skillsSection(CV, PROFILE)}
    ${experienceSection(CV.experience.filter((entry) => ["dsp", "qtp"].includes(entry.id)), EXPERIENCE, "SOFTWARE & IT EXPERIENCE")}
    ${projectsSection(CV, PROJECTS, PROFILE)}
    ${otherProjectsSection(CV, PROJECTS, PROFILE)}
    ${educationSection(CV, PROFILE)}
    ${experienceSection(CV.experience.filter((entry) => !["dsp", "qtp"].includes(entry.id)), EXPERIENCE, "ADDITIONAL EXPERIENCE")}
    ${workingPracticesSection(CV)}
    <section><h2>PROFESSIONAL DEVELOPMENT</h2><p class="training">${CERTIFICATES.map((certificate) => `<a href="${esc(PROFILE.links.portfolio)}/certificates/${esc(certificate.slug)}">${esc(certificate.shortTitle)}</a>`).join(" · ")} (2026).</p></section>
  </main>
</body>
</html>`;
}

// ---------- print ----------
function findBrowser() {
  const candidates = [
    process.env.EDGE_PATH,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error("No Edge/Chrome found for printing. Set EDGE_PATH to your browser.");
  return found;
}

// The browser can exit a beat before the PDF lands on disk.
function waitForPdf(before) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const stat = fs.existsSync(pdfPath) && fs.statSync(pdfPath);
    if (stat && stat.size > 0 && stat.mtimeMs >= before) return;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
  }
  throw new Error("The browser did not produce a PDF.");
}

function printPdf(browser) {
  const startedAt = Date.now() - 1000;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-print-"));
  try {
    execFileSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        `--user-data-dir=${userDataDir}`,
        "--no-pdf-header-footer",
        `--print-to-pdf=${pdfPath}`,
        pathToFileURL(htmlPath).href,
      ],
      { stdio: "ignore", timeout: 120000 }
    );
  } finally {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
  waitForPdf(startedAt);
}

// ---------- run ----------
const profile = await loadProfile();
const { CV } = await import(`${pathToFileURL(path.join(here, "cv-data.mjs")).href}?v=${Date.now()}`);
const icons = JSON.parse(fs.readFileSync(path.join(here, "icons.json"), "utf8"));
const logo = `data:image/png;base64,${fs.readFileSync(path.join(here, "logo-icon.png")).toString("base64")}`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(htmlPath, render(profile, CV, icons, logo), "utf8");

printPdf(findBrowser());

for (const w of warnings) console.warn(`! ${w}`);
console.log(`HTML  ${path.relative(root, htmlPath)}`);
console.log(`PDF   ${path.relative(root, pdfPath)} (${(fs.statSync(pdfPath).size / 1024).toFixed(0)} KB)`);
