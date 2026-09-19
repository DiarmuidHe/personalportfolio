"use client";
import { Element } from "react-scroll";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaArrowRight, FaExternalLinkAlt, FaLock } from "react-icons/fa";
import data from "../../JsonFolders/portfolio.json"
import SectionHeading from "../SectionHeading/SectionHeading";
import './Project.css'

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// A card that tilts slightly towards the pointer for a bit of depth
function ProjectCard({ proj }) {
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

  // Private projects (linkNote) aren't clickable; others without an external URL point to the on-site chat page
  const isPrivate = Boolean(proj.linkNote);
  const isInternal = !isPrivate && (!proj.link || proj.link === "#");
  const Wrapper = isPrivate ? "div" : "a";
  const wrapperProps = isPrivate
    ? {}
    : { href: isInternal ? "/chat" : proj.link, ...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" }) };

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
      <Wrapper {...wrapperProps} className={`project-link ${isPrivate ? "project-link-private" : ""}`}>
        <div className="project-media">
          {/* The on-site chat project uses an icon rather than a screenshot, so don't crop it */}
          <img
            className={`project-image ${isInternal ? "project-image-icon" : ""}`}
            src={proj.src}
            alt={proj.alt}
            loading="lazy"
          />
          <span className="project-overlay" aria-hidden="true">
            <span className="project-overlay-pill">
              {isPrivate ? <><FaLock /> {proj.linkNote}</> : <>View project <FaExternalLinkAlt /></>}
            </span>
          </span>
        </div>

        <div className="project-body">
          <h3 className="project-title">{proj.title}</h3>
          {proj.highlight && <p className="project-highlight"><strong>{proj.highlight}</strong></p>}
          <p className="project-text">{proj.description}</p>
          {isPrivate ? (
            <span className="project-cta project-cta-muted">
              <FaLock aria-hidden="true" /> {proj.linkNote}
            </span>
          ) : (
            <span className="project-cta">
              {isInternal ? "Try it out" : "Learn more"} <FaArrowRight aria-hidden="true" />
            </span>
          )}
        </div>
      </Wrapper>
    </motion.article>
  );
}

const ProjectsSection = () => {
  const images = data.images;

  return (
    <Element name="projects" id="projects">
      <section className="section projects" aria-labelledby="projects-title">
        <div className="container">
          <SectionHeading title="Projects" id="projects-title" />

          <motion.div
            className="row g-4"
            variants={grid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {images.projects.map((proj) => (
              <div key={proj.title} className="col-12 col-sm-6 col-lg-4 d-flex">
                <ProjectCard proj={proj} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </Element>
  );
};

export default ProjectsSection;
