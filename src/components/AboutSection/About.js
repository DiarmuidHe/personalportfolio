"use client";
import React from "react";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import { FaCode, FaCloud, FaLaptopCode, FaPlane, FaBook, FaGamepad } from "react-icons/fa";
import SectionHeading from "../SectionHeading/SectionHeading";
import "./About.css";

const SKILLS = ["C#", "TypeScript", "JavaScript", "Python", "SQL", "React", "Angular", ".NET", "Node.js", "AWS"];

const FOCUS = [
  { icon: FaLaptopCode, title: "Full Stack", text: "End-to-end apps, from database to polished UI." },
  { icon: FaCloud, title: "Cloud", text: "Deploying and hosting with AWS and Netlify." },
  { icon: FaCode, title: "Clean Code", text: "Readable, maintainable, user-focused solutions." },
];

const HOBBIES = [
  { icon: FaPlane, label: "Traveling" },
  { icon: FaBook, label: "Reading" },
  { icon: FaGamepad, label: "Gaming" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function About() {
  return (
    <Element name="about" id="about">
      <section className="section about" aria-labelledby="about-title">
        <div className="container">
          <SectionHeading title="About" id="about-title" />

          <div className="row g-4 g-lg-5 align-items-stretch">
            {/* Bio */}
            <motion.div
              className="col-lg-7"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="about-card h-100">
                <p className="about-text">
                  Hi, I’m <span className="highlight">Diarmuid Hession</span>, a
                  <span className="highlight"> Full Stack Developer</span> passionate about creating
                  meaningful, user-focused solutions. I specialize in{" "}
                  <span className="highlight">
                    C#, TypeScript, JavaScript, Python, SQL, and Cloud Programming
                  </span>{" "}
                  and love turning ideas into smooth, functional experiences that make a difference.
                </p>

                <p className="about-text">
                  My coding journey began with Scratch during my Junior Cert, and grew deeper
                  when I explored Python for my Leaving Certificate. Since then, I’ve cultivated
                  a passion for building across all areas of programming, experimenting with
                  diverse tools and platforms to bring projects to life. Outside of coding, I
                  enjoy <span className="personal-note">traveling, reading, and gaming</span>,
                  which keep me curious and inspired.
                </p>

                <h3 className="about-subheading">Core skills</h3>
                <p className="skill-list">{SKILLS.join(", ")}</p>
              </div>
            </motion.div>

            {/* Focus areas + hobbies */}
            <motion.div
              className="col-lg-5 d-flex flex-column gap-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {FOCUS.map(({ icon: Icon, title, text }) => (
                <motion.div
                  key={title}
                  className="focus-card"
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="focus-icon" aria-hidden="true"><Icon /></span>
                  <div>
                    <h3 className="focus-title">{title}</h3>
                    <p className="focus-text">{text}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div className="hobbies" variants={fadeUp}>
                <span className="hobbies-label">When I'm not coding</span>
                <div className="hobbies-list">
                  {HOBBIES.map(({ icon: Icon, label }) => (
                    <span key={label} className="hobby">
                      <Icon aria-hidden="true" /> {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </Element>
  );
}
