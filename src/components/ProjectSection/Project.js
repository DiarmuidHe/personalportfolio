"use client";
import { Element } from "react-scroll";
import { useRef } from "react";
import data from "../../JsonFolders/portfolio.json"
import './Project.css'
import {
  motion,
  useInView
  
} from "framer-motion";


const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });
  const images = data.images;

  return (
    <Element name="projects" id="projects">
      <main style={{ overflowX: "hidden" }}>
        <div style={{ minHeight: "100vh", paddingTop: "70px", position: "relative" }}>
          <div className="container">
            
            <motion.div
              ref={ref}
              initial={{ x: -200, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="fw-bold page-title">Projects</h1>
            </motion.div>



            <div className="container">
              <div className="row">
                {images.projects.map((proj, item) => (
                  <div key={item} className="col-6 col-md-4 col-lg-3 mb-4">
                     <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="card"
                        style={{ width: "100%" }}
                      >
                      
                      <a href={proj.link} target="_blank" rel="noopener noreferrer">
                          <img className="project-image" src={proj.src} alt={proj.alt}/>
                     
                      <div className="card-body">
                        <h5 className="card-title">{proj.title}</h5>
                        <p className="card-text">
                          {proj.description}
                        </p>
                      </div>
                       </a>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </Element>
  );
};

export default ProjectsSection;


