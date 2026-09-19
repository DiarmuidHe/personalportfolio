"use client";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import { FaAward, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import SectionHeading from "../SectionHeading/SectionHeading";
import { PROFILE } from "../../data/profile";
import { askChat } from "../ChatSection/chatEvents";
import "./Education.css";

const FIRST_CLASS = 70; // Irish honours boundary for a 1:1
const EASE = [0.22, 1, 0.36, 1];

export default function Education() {
  const edu = PROFILE.education;
  const y3 = edu.yearThree;
  const [degreeName, level] = edu.degree.split(", ");

  return (
    <Element name="education" id="education">
      <section className="section education" aria-labelledby="education-title">
        <div className="container">
          <SectionHeading title="Education" id="education-title" />

          <motion.article
            className="edu-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="edu-hero">
              <div className="edu-hero-text">
                <p className="edu-eyebrow">
                  <FaGraduationCap aria-hidden="true" /> {level}
                </p>
                <h3 className="edu-degree">{degreeName}</h3>
                <p className="edu-school">
                  <FaMapMarkerAlt aria-hidden="true" /> {edu.school}
                </p>
                <p className="edu-status">
                  Final year from October 2026 · Graduating {edu.graduation}
                </p>

                <div className="edu-credits" aria-label={`${y3.credits.earned} of ${y3.credits.total} credits earned`}>
                  <div className="edu-credits-bar">
                    <motion.span
                      className="edu-credits-fill"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: y3.credits.earned / y3.credits.total }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                    />
                  </div>
                  <span className="edu-credits-label">
                    {y3.credits.earned} / {y3.credits.total} credits
                  </span>
                </div>
              </div>

              <HonoursRing classification={y3.classification} />
            </div>

            <div className="edu-modules">
              <div className="edu-modules-head">
                <h4 className="edu-modules-title">3rd year highlights</h4>
                <span className="edu-legend">
                  <span className="edu-legend-mark" aria-hidden="true" /> 1:1 boundary ({FIRST_CLASS}%)
                </span>
              </div>

              <ul className="edu-bars">
                {y3.modules.map((m, i) => (
                  <ModuleBar key={m.title} module={m} index={i} />
                ))}
              </ul>

              <div className="edu-footer">
                <button
                  type="button"
                  className="xp-text-link"
                  onClick={() => askChat("What is Diarmuid studying and how are his grades?")}
                >
                  Ask the chat assistant about my studies
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </Element>
  );
}

// Gold ring that draws itself around the 1:1 when scrolled into view
function HonoursRing({ classification }) {
  const r = 52;
  const circ = 2 * Math.PI * r;

  return (
    <div className="edu-score">
      <div className="edu-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="edu-ring-track" cx="60" cy="60" r={r} />
          <motion.circle
            className="edu-ring-fill"
            cx="60"
            cy="60"
            r={r}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </svg>
        <div className="edu-ring-value">
          <span className="edu-ring-number">1:1</span>
          <span className="edu-ring-caption">3rd year</span>
        </div>
      </div>
      <p className="edu-badge">
        <FaAward aria-hidden="true" /> {classification.replace(" (1:1)", "")}
      </p>
    </div>
  );
}

function ModuleBar({ module, index }) {
  return (
    <li className="edu-bar">
      <div className="edu-bar-label">
        <span className="edu-bar-title">{module.title}</span>
        <span className="edu-bar-grade">{module.grade}%</span>
      </div>
      <div className="edu-bar-track" aria-hidden="true">
        <motion.span
          className="edu-bar-fill"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: module.grade / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 + index * 0.08 }}
        />
        <span className="edu-bar-mark" style={{ left: `${FIRST_CLASS}%` }} />
      </div>
    </li>
  );
}
