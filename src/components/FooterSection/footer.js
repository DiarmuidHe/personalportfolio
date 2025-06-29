import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import './footer.css'
const Footer = () => {
  return (
    <footer className="footer text-light py-4 mt-5">
      <motion.div
        className="container text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h5 className="fw-bold mb-3">Diarmuid Hession</h5>
        
        <div className="mb-3">
          <a
            href="https://github.com/DiarmuidHe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-3"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/d-hession"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-3"
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href="mailto:code@diarmuid.dev"
            className="text-light mx-3"
          >
            <FaEnvelope size={22} />
          </a>
        </div>

        <p className="mb-0" style={{ fontSize: "0.9rem" }}>
          © {new Date().getFullYear()} Diarmuid Hession. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
