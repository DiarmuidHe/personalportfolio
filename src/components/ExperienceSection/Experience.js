"use client";
import { useMemo, useRef, useState } from "react";
import { Element } from "react-scroll";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import SectionHeading from "../SectionHeading/SectionHeading";
import { EXPERIENCE, dateRange, durationLabel, formatMonth, isCurrent } from "../../data/profile";
import { askChat } from "../ChatSection/chatEvents";
import "./Experience.css";

const FILTERS = [
  { id: "all", label: "All roles" },
  { id: "tech", label: "Tech" },
  { id: "other", label: "Other" },
];

export default function Experience() {
  const [filter, setFilter] = useState("all");
  const listRef = useRef(null);

  // The timeline rail fills in as the visitor scrolls through the section
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const railFill = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  const jobs = useMemo(
    () => (filter === "all" ? EXPERIENCE : EXPERIENCE.filter((j) => j.type === filter)),
    [filter]
  );

  const counts = useMemo(
    () => ({
      all: EXPERIENCE.length,
      tech: EXPERIENCE.filter((j) => j.type === "tech").length,
      other: EXPERIENCE.filter((j) => j.type === "other").length,
    }),
    []
  );

  return (
    <Element name="experience" id="experience">
      <section className="section experience" aria-labelledby="experience-title">
        <div className="container">
          <SectionHeading title="Experience" id="experience-title" />

          <div className="xp-toolbar">
            <div className="xp-filters" role="group" aria-label="Filter roles">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={`xp-filter ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label} ({counts[f.id]})
                    {active && (
                      <motion.span
                        layoutId="xp-filter-underline"
                        className="xp-filter-underline"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="xp-text-link"
              onClick={() => askChat("Summarise Diarmuid's work experience")}
            >
              Ask the chat assistant about my experience
            </button>
          </div>

          <div className="xp-timeline" ref={listRef}>
            <span className="xp-rail" aria-hidden="true">
              <motion.span className="xp-rail-fill" style={{ scaleY: railFill }} />
            </span>

            <ol className="xp-list">
              <AnimatePresence initial={false} mode="popLayout">
                {jobs.map((job, i) => (
                  <TimelineItem key={job.id} job={job} side={i % 2 === 0 ? "left" : "right"} />
                ))}
              </AnimatePresence>
            </ol>
          </div>
        </div>
      </section>
    </Element>
  );
}

function TimelineItem({ job, side }) {
  const current = isCurrent(job);

  return (
    <motion.li
      layout
      className={`xp-item xp-${side}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={`xp-node ${current ? "is-current" : ""}`} aria-hidden="true" />

      <article className="xp-card" aria-labelledby={`xp-${job.id}-title`}>
        <p className="xp-meta">
          <time dateTime={job.start}>{dateRange(job)}</time>
          <span className="xp-sep" aria-hidden="true">·</span>
          <span>{durationLabel(job.start, job.end)}</span>
          {current && (
            <>
              <span className="xp-sep" aria-hidden="true">·</span>
              <span className="xp-current">
                {job.end ? `Current, until ${formatMonth(job.end)}` : "Current"}
              </span>
            </>
          )}
        </p>

        <h3 className="xp-role" id={`xp-${job.id}-title`}>
          {job.role}
        </h3>
        <p className="xp-company">
          {job.company}
          {job.employmentType && `, ${job.employmentType}`}
        </p>
        <p className="xp-location">
          <FaMapMarkerAlt aria-hidden="true" /> {job.location} ({job.workplace})
        </p>

        {job.stages && (
          <ol className="xp-stages" aria-label="Role progression">
            {job.stages.map((st) => (
              <li key={st.title}>
                <span className="xp-stage-title">{st.title}</span>, {formatMonth(st.start)} – {formatMonth(st.end)}
              </li>
            ))}
          </ol>
        )}

        <ul className="xp-highlights">
          {job.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <p className="xp-skills">
          <span className="xp-skills-label">Skills:</span> {job.skills.join(", ")}
        </p>

        <button
          type="button"
          className="xp-text-link"
          onClick={() => askChat(`Tell me about Diarmuid's role as ${job.role} at ${job.company}`)}
          aria-label={`Ask the chat assistant about the ${job.role} role at ${job.company}`}
        >
          Ask about this role
        </button>
      </article>
    </motion.li>
  );
}
