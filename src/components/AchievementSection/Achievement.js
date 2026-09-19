"use client";

import { motion } from "framer-motion";
import { FaArrowRight, FaBriefcase, FaTimes } from "react-icons/fa";
import data from "../../JsonFolders/portfolio.json"
import { EXPERIENCE } from "../../data/profile";
import SectionHeading from "../SectionHeading/SectionHeading";

import './Achievement.css';

// Display groups for the tech in portfolio.json.
// Anything not listed lands in "Other", so adding a new logo to the JSON never makes it disappear.
const GROUPS = [
  ["Languages", ["Python", "JavaScript", "TypeScript", "C#", "SQL", "HTML5"]],
  ["Frontend", ["React", "Angular", "Bootstrap"]],
  ["Backend & Data", ["Node.js", ".NET", "FastAPI", "PostgreSQL"]],
  ["AI & Computer Vision", ["PyTorch", "TensorFlow", "Ultralytics YOLO", "OpenCV"]],
  ["Cloud & Tools", ["AWS", "Azure", "Docker", "GitHub"]],
];

const TECH = data.images.languages;
const PROJECTS = data.images.projects;

// How many projects list each technology in their stack
const COUNTS = Object.fromEntries(
  TECH.map((t) => [t.alt, PROJECTS.filter((p) => p.stack?.includes(t.alt)).length])
);

// Used in a job: listed in a role's stack or skills in profile.js
const WORK_TECH = new Set(EXPERIENCE.flatMap((job) => [...(job.stack ?? []), ...job.skills]));

const grouped = GROUPS.map(([title, names]) => [
  title,
  names.map((name) => TECH.find((t) => t.alt === name)).filter(Boolean),
]);
const listed = new Set(GROUPS.flatMap(([, names]) => names));
const other = TECH.filter((t) => !listed.has(t.alt));
if (other.length) grouped.push(["Other", other]);

const group = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

// Keys drop onto the plate slightly crooked, then settle square.
// The tilt comes from the name so it's the same on every visit.
const tiltOf = (name) => ((name.length * 7 + name.charCodeAt(0)) % 9) - 4;

const keyIn = {
  hidden: (tilt) => ({ opacity: 0, y: -22, rotate: tilt * 2 }),
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 420, damping: 16, mass: 0.7 },
  },
};

// Every technology at a glance. Picking one filters the projects below to the ones built with it;
// tech only used at work links to the Experience section instead.
const AchievementsSection = ({ techFilter, onTechFilter }) => {
  const pick = (name) => {
    const next = techFilter === name ? null : name;
    onTechFilter(next);
    if (next) document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toExperience = () =>
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="section tech" aria-labelledby="tech-title">
      <div className="container">
        <SectionHeading title="Tools & Technologies" id="tech-title" center />
        <p className="tech-intro">
          Pick a technology to see the projects I've built with it.
        </p>

        <div className="tech-groups">
          {grouped.map(([title, items], i) => (
            <motion.div
              key={title}
              className="kb-plate"
              variants={group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <h3 className="kb-plate-title">
                <span className="kb-plate-index">{String(i + 1).padStart(2, "0")}</span>
                {title}
              </h3>
              <ul className="kb-keys">
                {items.map((t) => {
                  const count = COUNTS[t.alt];
                  const work = WORK_TECH.has(t.alt);
                  const active = techFilter === t.alt;
                  const label = count > 0
                    ? `${t.alt}: show ${count} project${count === 1 ? "" : "s"}${work ? ", also used at work" : ""}`
                    : `${t.alt}: used at work, go to Experience`;

                  return (
                    <motion.li key={t.alt} variants={keyIn} custom={tiltOf(t.alt)}>
                      <button
                        type="button"
                        className={`kb-key ${active ? "is-active" : ""} ${count > 0 ? "" : "is-work-only"}`}
                        aria-pressed={count > 0 ? active : undefined}
                        aria-label={label}
                        title={work ? `${t.alt} · used at work` : undefined}
                        onClick={() => (count > 0 ? pick(t.alt) : toExperience())}
                      >
                        <span className="kb-key-face">
                          {count > 0 && <span className="kb-led" aria-hidden="true" />}
                          <span className="kb-key-logo">
                            <img src={t.src} alt="" loading="lazy" />
                          </span>
                          <span className="kb-key-name">{t.alt}</span>
                          <span className="kb-key-legends" aria-hidden="true">
                            {count > 0 ? (
                              <span className="kb-key-count">{count}</span>
                            ) : (
                              <FaArrowRight className="kb-key-jump" />
                            )}
                            {work && <FaBriefcase className="kb-key-work" />}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Explains the badges, or says what's picked once a filter is on */}
        <div className="tech-status" role="status">
          {techFilter ? (
            <>
              <span>
                Showing <strong>{COUNTS[techFilter]}</strong> project{COUNTS[techFilter] === 1 ? "" : "s"} built
                with <strong>{techFilter}</strong> below
              </span>
              <button type="button" className="tech-clear-btn" onClick={() => onTechFilter(null)}>
                <FaTimes aria-hidden="true" /> Clear filter
              </button>
            </>
          ) : (
            <>
              <span className="tech-key">
                <span className="kb-mini">#</span> projects built with it
              </span>
              <span className="tech-key">
                <span className="kb-mini"><FaBriefcase aria-hidden="true" /></span> used in a job
              </span>
              <span className="tech-key">
                <span className="kb-mini"><FaArrowRight aria-hidden="true" /></span> work only, jumps to Experience
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
