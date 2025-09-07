import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-scroll";
import data from "../../JsonFolders/portfolio.json"
import './Home.css'

const HomeSection = ({ activeSection }) => {
  const images = data.images
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10px", once: false });

  console.log("Is in view:", isInView); // Debug line

  return (
    <div style={{ height: '100vh', overflow:'hidden' }}>
      <Element name="Home" id="Home">
        
        <main className="d-flex flex-column justify-content-center align-items-center" style={{  
          backgroundImage: "url('/HomeBackground.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%', textAlign: 'center' }}>
        {/* Profile Image at Top */}
        
        <img
          src={images.profile}
          alt="Diarmuid Hession profile"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '195px',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '50%',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px #07376a'
          }}
        />


          <h1>
            Hi, I’m <span style={{ color: "#07376a", fontWeight:"bold" }}>Diarmuid Hession</span>.
          </h1>


            <h1>Welcome to my Portfolio!</h1>


          <Link
            to="projects"
            smooth={true}
            duration={250}
            style={{ cursor: "pointer", marginTop: '2rem' }}
          >

          <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="btnViewWork"
            >
              <h2>View my work &darr;</h2>
            
            </motion.button>
          </Link>
      </main>


      </Element>
    </div>
  );
};

export default HomeSection;
