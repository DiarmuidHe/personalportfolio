import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-scroll";
import './Home.css'

const HomeSection = ({ activeSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });

  console.log("Is in view:", isInView); // Debug line

  return (
    <Element name="Home" id="Home">
    <main   className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <motion.div
        ref={ref}
        initial={{ x: -200, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
        transition={{ duration: 0.8 }}

      >
        <h1>
          Hello, I'm <span style={{ color: "rgb(59, 152, 219)" }}>Diarmuid</span>.
        </h1>
      </motion.div>

      <div style={{  overflowX: "hidden"  }}>
        <motion.div
          ref={ref}
          initial={{ x: 200, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Welcome to my Portfolio!!!</h1>
        </motion.div>
      </div>


      <motion.div
        ref={ref}
        initial={{ y: 200, opacity: 0 }} // Starts off-screen at the bottom
        animate={isInView ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }} // Moves up into view
        transition={{ duration: 0.8 }}
      >
        <Link 
          to="projects" 
          smooth={true} 
          duration={250} 
          className={`nav-link ${activeSection === 'Home' ? 'active fw-bold' : ''}`}
          style={{ cursor: "pointer" }}
        >
          <div className="btn"><h3>View my work &darr;</h3></div>
        </Link>
        
      </motion.div>
    </main>

    </Element>
  );
};

export default HomeSection;
