import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from "react-icons/fa";
import { PALETTE_OPEN_EVENT } from "../CommandPalette/CommandPalette";
import './footer.css'

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const SOCIALS = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/DiarmuidHe" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/d-hession" },
  { icon: FaEnvelope, label: "Email", href: "mailto:code@diarmuid.dev" },
];

const LINKS = [
  { to: "about", label: "About" },
  { to: "projects", label: "Projects" },
  { to: "contact", label: "Contact" },
];

const Footer = () => {
  return (
    <footer className="footer text-light">
      <motion.div
        className="container footer-inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-brand">
          <h2 className="footer-name">Diarmuid Hession</h2>
          <p className="footer-role">Full Stack Developer</p>
        </div>

        <nav aria-label="Footer">
          <ul className="footer-links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} href={`#${l.to}`} smooth={true} duration={500}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li><a href="/cv">CV</a></li>
          </ul>
        </nav>

        <div className="footer-socials">
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
      </motion.div>

      <div className="footer-bottom">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="mb-0">
            © {new Date().getFullYear()} Diarmuid Hession. All rights reserved.
          </p>
          <div className="d-flex align-items-center gap-4">
            <button
              type="button"
              className="footer-jump"
              onClick={() => window.dispatchEvent(new Event(PALETTE_OPEN_EVENT))}
            >
              Quick jump <kbd className="footer-kbd">{IS_MAC ? "⌘" : "Ctrl"} K</kbd>
            </button>
            <Link to="Home" href="#Home" smooth={true} duration={600} className="back-to-top">
              Back to top <FaArrowUp aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
