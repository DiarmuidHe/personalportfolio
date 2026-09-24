"use client";
import { Element } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaArrowRight, FaChevronDown, FaChevronUp, FaLock, FaTimes } from "react-icons/fa";
import data from "../../JsonFolders/portfolio.json"
import { projectSlug } from "../../data/profile";
import SectionHeading from "../SectionHeading/SectionHeading";
import ProjectDetail from "./ProjectDetail";
import TechStack from "./TechStack";
import './Project.css'

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// A card that tilts slightly towards the pointer for a bit of depth.
// Clicking it opens the project's write-up at /projects/:slug.
function ProjectCard({ proj, hideMedia, onOpen, techFilter }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const isPrivate = Boolean(proj.linkNote);
  // The on-site chat project uses an icon rather than a screenshot, so don't crop it
  const isIcon = !isPrivate && (!proj.link || proj.link === "#");

  return (
    <motion.article
      className="project-card"
      variants={cardIn}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link
        to={`/projects/${proj.slug}`}
        className="project-link"
        onClick={() => {
          reset();
          onOpen(proj.slug);
        }}
      >
        {hideMedia ? (
          <div className="project-media" aria-hidden="true" />
        ) : (
          <motion.div layoutId={`project-media-${proj.slug}`} className="project-media">
            <img
              className={`project-image ${isIcon ? "project-image-icon" : ""}`}
              src={proj.src}
              alt={proj.alt}
              loading="lazy"
            />
            <span className="project-overlay" aria-hidden="true">
              <span className="project-overlay-pill">
                View project <FaArrowRight />
              </span>
            </span>
          </motion.div>
        )}

        <div className="project-body">
          <h3 className="project-title">{proj.title}</h3>
          {proj.highlight && <p className="project-highlight"><strong>{proj.highlight}</strong></p>}
          <p className="project-text">{proj.description}</p>
          <span className="project-footer">
            <span className="project-cta">
              Read more <FaArrowRight aria-hidden="true" />
            </span>
            {isPrivate && (
              <span className="project-cta-muted">
                <FaLock aria-hidden="true" /> {proj.linkNote}
              </span>
            )}
          </span>
          <TechStack stack={proj.stack} active={techFilter} />
        </div>
      </Link>
    </motion.article>
  );
}

const SITE_TITLE = "Diarmuid Hession | Developer Portfolio";
const PROJECTS = data.images.projects.map((p) => ({ ...p, slug: projectSlug(p.title) }));
const featured = PROJECTS.filter((p) => p.featured);
const more = PROJECTS.filter((p) => !p.featured);
// Featured first, the same order the cards appear in, for the dialog's previous/next
const ORDERED = [...featured, ...more];

const ProjectsSection = ({ techFilter, onTechFilter }) => {
  const navigate = useNavigate();
  const match = useMatch("/projects/:slug");
  const certificateMatch = useMatch("/certificates/:slug");
  const index = match ? ORDERED.findIndex((p) => p.slug === match.params.slug) : -1;
  const selected = index >= 0 ? ORDERED[index] : null;

  // The card the dialog was opened from; only that one's image morphs into the dialog.
  // Null when the page was opened on a /projects/... link or from the chat.
  const [origin, setOrigin] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const sectionRef = useRef(null);

  // Arriving on a project link (or asking the chat for one) that lives under "more":
  // expand it so the dialog closes back onto its card
  useEffect(() => {
    if (selected && !selected.featured) setShowMore(true);
  }, [selected]);

  // Landing directly on /projects/...: park the page on the projects section behind the dialog
  useEffect(() => {
    if (match) sectionRef.current?.scrollIntoView({ block: "start" });
    // Only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each write-up gets its own tab title, so shared links and history read properly
  useEffect(() => {
    if (!certificateMatch) document.title = selected ? `${selected.title} | Diarmuid Hession` : SITE_TITLE;
  }, [selected, certificateMatch]);

  // Unknown project slug: fall back to the home page
  useEffect(() => {
    if (match && !selected) navigate("/", { replace: true });
  }, [match, selected, navigate]);

  const close = () => {
    // Replace rather than push, so the browser's back button doesn't reopen the dialog
    navigate("/", { replace: true });
    // Let the card take its image back once the dialog has gone
    setTimeout(() => setOrigin(null), 400);
  };

  // With a technology picked, every matching project shows in one grid, featured or not
  const filtered = techFilter ? ORDERED.filter((p) => p.stack?.includes(techFilter)) : null;

  const card = (proj) => (
    <div key={proj.title} className="col-12 col-sm-6 col-lg-4 d-flex">
      <ProjectCard
        proj={proj}
        hideMedia={Boolean(selected) && origin === proj.slug}
        onOpen={setOrigin}
        techFilter={techFilter}
      />
    </div>
  );

  const toggle = () => {
    // When collapsing, bring the section back into view so the page doesn't jump past it
    if (showMore) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowMore((v) => !v);
  };

  return (
    <Element name="projects" id="projects">
      <section ref={sectionRef} className="section projects" aria-labelledby="projects-title">
        <div className="container">
          <SectionHeading title="Projects" id="projects-title" />

          {filtered ? (
            <>
              <div className="projects-filter" role="status">
                <span>
                  Showing <strong>{filtered.length}</strong> project{filtered.length === 1 ? "" : "s"} built with{" "}
                  <strong>{techFilter}</strong>
                </span>
                <button type="button" className="projects-filter-clear" onClick={() => onTechFilter(null)}>
                  <FaTimes aria-hidden="true" /> Show all projects
                </button>
              </div>

              <motion.div key={techFilter} className="row g-4" variants={grid} initial="hidden" animate="visible">
                {filtered.map(card)}
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className="row g-4"
                variants={grid}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {featured.map(card)}
              </motion.div>

              <AnimatePresence initial={false}>
                {showMore && (
                  <motion.div
                    id="more-projects"
                    className="row g-4 mt-0"
                    variants={grid}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    {more.map(card)}
                  </motion.div>
                )}
              </AnimatePresence>

              {more.length > 0 && (
                <div className="projects-more">
                  <button
                    type="button"
                    className="btn-brand-outline"
                    onClick={toggle}
                    aria-expanded={showMore}
                    aria-controls="more-projects"
                  >
                    {showMore ? "Show fewer projects" : `View more projects (${more.length})`}
                    {showMore ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <ProjectDetail
            key="project-detail"
            proj={selected}
            slug={selected.slug}
            prev={ORDERED[index - 1]}
            next={ORDERED[index + 1]}
            sharedMedia={origin === selected.slug}
            onClose={close}
            onGo={(slug) => navigate(`/projects/${slug}`, { replace: true })}
          />
        )}
      </AnimatePresence>
    </Element>
  );
};

export default ProjectsSection;
