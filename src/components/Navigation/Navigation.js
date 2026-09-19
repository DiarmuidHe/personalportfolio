import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";
import './Navigation.css'

const NAV_ITEMS = [
  { id: "Home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Navigation = ({ activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Reading-progress bar along the bottom edge of the navbar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-nav sticky-top ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="navbar navbar-expand-lg navbar-dark" aria-label="Main navigation">
        <div className="container">
          <Link
            to="Home"
            href="#Home"
            smooth={true}
            duration={400}
            className="navbar-brand d-flex align-items-center gap-2"
            onClick={closeMenu}
          >
            <motion.img
              src="/Logo.png"
              alt="Diarmuid Hession home"
              className="navLogo"
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="brand-name d-none d-sm-inline">Diarmuid Hession</span>
          </Link>

          <button
            className={`navbar-toggler nav-toggler ${menuOpen ? "open" : ""}`}
            type="button"
            aria-controls="navbarNav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="toggler-bar" />
            <span className="toggler-bar" />
            <span className="toggler-bar" />
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.id;
                return (
                  <li className="nav-item" key={item.id} style={{ "--i": i }}>
                    <Link
                      to={item.id}
                      href={`#${item.id}`}
                      smooth={true}
                      duration={400}
                      className={`nav-link ${isActive ? "active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeMenu}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="nav-indicator"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
              <li className="nav-item ms-lg-3" style={{ "--i": NAV_ITEMS.length }}>
                <a href="/cv" className="nav-cv" onClick={closeMenu}>
                  <FaFileAlt aria-hidden="true" /> CV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
    </header>
  );
};

export default Navigation;
