import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AchievementsSection = () => {

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });
  return (
    <Element name="achievements" id="achievements">
      <main style={{ height: '95vh', paddingTop: '56px' }}>
        
        <div className="container">
          

          <motion.div
            ref={ref}
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="fw-bold page-title">Achievements</h1>
          </motion.div>
        </div>
      </main>
        

    </Element>
  );
};

export default AchievementsSection;