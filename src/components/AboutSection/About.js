"use client";
import React, { useRef } from "react";
import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import "./About.css"; 

export default function About() {
  // define the ref
  const ref = useRef(null);
  // hook to check if in view
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
     <Element name="about" id="about" style={{paddingTop: "70px"}}>
      <main className="pt-5 overflow-hidden">
        <div className="container position-relative">
          {/* Animated heading */}
          <motion.div
            ref={ref}
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="fw-bold page-title">About</h1>
          </motion.div>

          {/* About Section */}
          <section className="about-section text-center mx-auto py-5">

            <p className="about-text mb-4">
              Hi, I’m <span className="highlight">Diarmuid Hession</span>, a
              <span className="highlight"> Full Stack Developer</span> passionate about creating
              meaningful, user-focused solutions. I specialize in{" "}
              <span className="highlight">
                C#, TypeScript, JavaScript, Python, SQL, and Cloud Programming
              </span>{" "}
              and love turning ideas into smooth, functional experiences that make a difference.
            </p>

            <p className="about-text mb-5">
              My coding journey began with Scratch during my Junior Cert, and grew deeper
              when I explored Python for my Leaving Certificate. Since then, I’ve cultivated
              a passion for building across all areas of programming, experimenting with
              diverse tools and platforms to bring projects to life. Outside of coding, I
              enjoy <span className="personal-note">traveling, reading, and gaming</span>,
              which keep me curious and inspired.
            </p>

            {/* Slider Section */}

          </section>
          <div className="about-slider">
              <h3 className="slider-title fw-semibold">
                Tools & Technologies I Use
              </h3>
            </div>
        </div>
      </main>
    </Element>
  );
}
