"use client";
import { Element } from "react-scroll";
import { useRef } from "react";


import {
  motion,
  useInView
  
} from "framer-motion";


const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });


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
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="col-6 col-md-4 col-lg-3 mb-4">
                     <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="card"
                        style={{ width: "100%" }}
                      >
                      <img src="https://i.scdn.co/image/ab6765630000ba8a49f81331af04ec3614a5a741" className="card-img-top" alt={`Project ${item}`} />
                      <div className="card-body">
                        <h5 className="card-title">Card {item}</h5>
                        <p className="card-text">
                          Some quick example text to build on the card title and make up the bulk of the card’s content.
                        </p>
                      </div>
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


