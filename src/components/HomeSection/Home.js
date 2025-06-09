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
      <main className="d-flex flex-column justify-content-center align-items-center" style={{  
        backgroundImage: "url('/HomeBackground.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%', textAlign: 'center' }}>
      {/* Profile Image at Top */}
      <motion.img
        src="/ProfileIMG.jpg"
        alt="Diarmuid Hession profile"
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '50%',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(59, 152, 219,0.9)'
        }}
      />

      {/* First Name */}
      <motion.div
        ref={ref}
        initial={{ x: -200, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>
          Hi, I’m <span style={{ color: "rgb(59, 152, 219)", fontWeight:"bold" }}>Diarmuid Hession</span>.
        </h1>
      </motion.div>

      {/* Last Name */}
      <motion.div
        ref={ref}
        initial={{ x: 200, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
          <h1>Welcome to my Portfolio!</h1>

      </motion.div>

      {/* CTA Button */}
      <motion.div
        ref={ref}
        initial={{ y: 200, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link
          to="projects"
          smooth={true}
          duration={250}
          className={`nav-link ${activeSection === 'Home' ? 'active fw-bold' : ''}`}
          style={{ cursor: "pointer", marginTop: '2rem' }}
        >
          <div className="btn">
            <h3>View my work &darr;</h3>
          </div>
        </Link>
      </motion.div>
    </main>




    </Element>
  );
};

export default HomeSection;
