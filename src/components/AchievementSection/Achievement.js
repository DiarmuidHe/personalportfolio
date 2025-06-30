"use client"

import { Element } from "react-scroll"
import { motion, useScroll, useInView } from "framer-motion"
import { useRef } from "react"
import './Achievement.css'


const AchievementsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px", once: false })

  return (
    <Element name="achievements" id="achievements">
      <main style={{ minHeight: '100vh', paddingTop: '70px', overflowX: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>

          {/* Title with animation */}
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
  )
}

export default AchievementsSection
