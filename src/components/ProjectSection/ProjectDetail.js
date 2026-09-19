import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaGithub, FaLock, FaTimes } from "react-icons/fa";
import { PROFILE } from "../../data/profile";
import { askChat } from "../ChatSection/chatEvents";

// The longer project notes in profile.js are written for the chat assistant.
// Drop the lines that only make sense there (availability notes, one-line recaps, aliases).
function caseStudyNotes(title) {
  return (PROFILE.projectDetails[title] || [])
    .filter((d) => !/available upon request|^In one sentence/i.test(d))
    .map((d) => d.replace(/^Also called [^.]+\.\s*/, ""));
}

// "Stage 1, image preparation: auto-rotates..." -> bold lead-in, then the text
function Note({ text }) {
  const m = text.match(/^([^:.]{3,45}):\s+(.*)$/);
  if (!m) return <p>{text}</p>;
  return (
    <p>
      <strong>{m[1]}.</strong> {m[2].charAt(0).toUpperCase() + m[2].slice(1)}
    </p>
  );
}

function PrimaryAction({ proj, isPrivate, isInternal, onClose }) {
  if (isPrivate) {
    return (
      <a href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(proj.title)}`} className="btn-brand">
        <FaLock aria-hidden="true" /> Request access
      </a>
    );
  }
  if (isInternal) {
    return (
      <button
        type="button"
        className="btn-brand"
        onClick={() => {
          onClose();
          askChat();
        }}
      >
        Try the assistant <FaArrowRight aria-hidden="true" />
      </button>
    );
  }
  const onGithub = /github\.com/i.test(proj.link);
  return (
    <a href={proj.link} className="btn-brand" target="_blank" rel="noopener noreferrer">
      {onGithub ? <><FaGithub aria-hidden="true" /> View the code</> : <>Open the live site <FaExternalLinkAlt aria-hidden="true" /></>}
    </a>
  );
}

// sharedMedia: the image morphs out of the card that was clicked. Only that card, so
// paging to another project inside the dialog doesn't send images flying around behind it.
export default function ProjectDetail({ proj, slug, prev, next, sharedMedia, onClose, onGo }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const isPrivate = Boolean(proj.linkNote);
  const isInternal = !isPrivate && (!proj.link || proj.link === "#");
  const notes = caseStudyNotes(proj.title);

  // Lock page scroll behind the dialog and hand focus back to whatever opened it
  useEffect(() => {
    const opener = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // Moving between projects starts the new one from the top
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [slug]);

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    } else if (e.key === "ArrowRight" && next && e.target.tagName !== "INPUT") {
      onGo(next.slug);
    } else if (e.key === "ArrowLeft" && prev && e.target.tagName !== "INPUT") {
      onGo(prev.slug);
    } else if (e.key === "Tab") {
      // Keep keyboard focus inside the dialog
      const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <motion.div
      className="pd-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        className="pd-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pd-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          key={slug}
          layoutId={sharedMedia ? `project-media-${slug}` : undefined}
          className="pd-media project-media"
          initial={sharedMedia ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            className={`project-image ${isInternal ? "project-image-icon" : ""}`}
            src={proj.src}
            alt={proj.alt}
          />
        </motion.div>

        <button ref={closeRef} type="button" className="pd-close" onClick={onClose} aria-label="Close project details">
          <FaTimes aria-hidden="true" />
        </button>

        <div className="pd-body">
          <h2 id="pd-title" className="pd-title">{proj.title}</h2>
          {proj.highlight && <p className="pd-highlight">{proj.highlight}</p>}
          <p className="pd-summary">{proj.description}</p>

          <div className="pd-actions">
            <PrimaryAction proj={proj} isPrivate={isPrivate} isInternal={isInternal} onClose={onClose} />
            {!isInternal && (
              <button
                type="button"
                className="xp-text-link"
                onClick={() => {
                  onClose();
                  askChat(`Tell me about the ${proj.title} project`);
                }}
              >
                Ask the chat assistant about it
              </button>
            )}
          </div>

          {notes.length > 0 && (
            <section className="pd-notes" aria-labelledby="pd-notes-title">
              <h3 id="pd-notes-title" className="pd-notes-title">How it works</h3>
              {notes.map((n) => (
                <Note key={n} text={n} />
              ))}
            </section>
          )}
        </div>

        <nav className="pd-pager" aria-label="Other projects">
          {prev ? (
            <button type="button" className="pd-pager-btn" onClick={() => onGo(prev.slug)}>
              <FaArrowLeft aria-hidden="true" />
              <span>
                <span className="pd-pager-label">Previous</span>
                <span className="pd-pager-name">{prev.title}</span>
              </span>
            </button>
          ) : <span />}
          {next && (
            <button type="button" className="pd-pager-btn pd-pager-next" onClick={() => onGo(next.slug)}>
              <span>
                <span className="pd-pager-label">Next</span>
                <span className="pd-pager-name">{next.title}</span>
              </span>
              <FaArrowRight aria-hidden="true" />
            </button>
          )}
        </nav>
      </motion.div>
    </motion.div>
  );
}
