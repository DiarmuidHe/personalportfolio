import { useEffect, useRef, useState } from "react";
import { Element, Link } from "react-scroll";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaArrowDown, FaGithub, FaLinkedin } from "react-icons/fa";
import data from "../../JsonFolders/portfolio.json"
import './Home.css'

const ROLES = ["Full Stack Developer", "C# & .NET", "React & TypeScript", "Python", "Cloud & AWS"];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const HomeSection = () => {
  const images = data.images;
  const ref = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Subtle parallax: content drifts up and fades as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <Element name="Home" id="Home">
      <section
        ref={ref}
        className="hero"
        aria-labelledby="hero-title"
        style={{ backgroundImage: "url('/HomeBackground.png')" }}
      >
        <motion.div
          className="hero-content container"
          style={{ y: contentY, opacity: contentOpacity }}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-avatar-wrap" variants={item}>
            <span className="hero-avatar-ring" aria-hidden="true" />
            <motion.img
              src={images.profile}
              alt="Portrait of Diarmuid Hession"
              className="hero-avatar"
              width="200"
              height="200"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.p className="hero-greeting" variants={item}>
            Hi, I'm
          </motion.p>

          <motion.h1 id="hero-title" className="hero-title" variants={item}>
            Diarmuid Hession
          </motion.h1>

          <motion.div className="hero-role" variants={item} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROLES[roleIndex]}
                className="hero-role-text"
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.35 }}
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p className="hero-tagline" variants={item}>
            Welcome to my portfolio — I build clean, user-focused experiences across the full stack.
          </motion.p>

          <motion.div className="hero-actions" variants={item}>
            <Link to="projects" href="#projects" smooth={true} duration={500}>
              <motion.span
                className="btn-brand"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                View my work <FaArrowDown aria-hidden="true" />
              </motion.span>
            </Link>
            <Link to="contact" href="#contact" smooth={true} duration={600}>
              <motion.span
                className="btn-brand-outline"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                Get in touch
              </motion.span>
            </Link>
          </motion.div>

          <motion.div className="hero-socials" variants={item}>
            <a href="https://github.com/DiarmuidHe" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/d-hession" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <FaLinkedin />
            </a>
          </motion.div>
        </motion.div>

        <Link
          to="about"
          href="#about"
          smooth={true}
          duration={500}
          className="scroll-cue"
          aria-label="Scroll to About section"
        >
          <span className="scroll-cue-mouse">
            <span className="scroll-cue-wheel" />
          </span>
        </Link>
      </section>
    </Element>
  );
};

export default HomeSection;
