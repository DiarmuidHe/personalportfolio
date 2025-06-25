"use client";
import { Element } from "react-scroll";
import { useRef } from "react";
import { useInView } from "framer-motion";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll
  
} from "framer-motion";


const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });

  const { scrollXProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(scrollXProgress);

  return (
    <Element name="projects" id="projects">
      <main style={{ overflowX: "hidden" }}>
        <div style={{ height: "100vh", paddingTop: "70px", position: "relative" }}>
          <div className="container">
            
            <motion.div
              ref={ref}
              initial={{ x: -200, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="fw-bold page-title">Projects</h1>
            </motion.div>



            <motion.ul className="slider-list" ref={ref} style={{ maskImage }}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <li key={item}>
                  <div className="card" style={{ width: "18rem" }}>
                    <img src="https://via.placeholder.com/150" className="card-img-top" alt={`Project ${item}`} />
                    <div className="card-body">
                      <h5 className="card-title">Card {item}</h5>
                      <p className="card-text">
                        Some quick example text to build on the card title and make up the bulk of the card’s content.
                      </p>
                      {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                    </div>
                  </div>
                </li>
              ))}
            </motion.ul>


            <StyleSheet />
          </div>
        </div>
      </main>
    </Element>
  );
};

export default ProjectsSection;

const left = `0%`;
const right = `100%`;
const leftInset = `20%`;
const rightInset = `80%`;
const transparent = `#0000`;
const opaque = `#000`;

function useScrollOverflowMask(scrollXProgress) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
  );

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
      );
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      );
    }
  });

  return maskImage;
}

// Inline CSS (could be extracted to a CSS/SCSS module)
function StyleSheet() {
  return (
    <style>{`
      #projects {
        position: relative;
      }

      .container {
        max-width: 960px;
        margin: 0 auto;
      }

      #progress {
        position: absolute;
        top: -65px;
        left: -15px;
        transform: rotate(-90deg);
      }

      #progress .bg {
        stroke: #0b1011;
      }

      #progress circle {
        stroke-dashoffset: 0;
        stroke-width: 10%;
        fill: none;
      }



      .slider-list {
        display: flex;
        list-style: none;
        height: 300px;
        overflow-x: scroll;
        padding: 20px 0;
        margin: 0 auto;
        gap: 20px;
        flex: 0 0 600px;
      }

      .slider-list li {
        flex: 0 0 200px;
        background: var(--accent,rgb(59, 152, 219));
        border-radius: 12px;
      }

      #projects ::-webkit-scrollbar {
        height: 5px;
        background: #fff3;
      }

      #projects ::-webkit-scrollbar-thumb {
        background: var(--accent,rgb(59, 152, 219));
      }

      #projects ::-webkit-scrollbar-corner {
        background: #fff3;
      }
    `}</style>
  );
}
