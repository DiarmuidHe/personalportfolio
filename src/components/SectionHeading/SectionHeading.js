import { motion } from "framer-motion";

// Shared animated heading used by every section on the main page.
// Animates once when scrolled into view so content doesn't jump around on re-scroll.
export default function SectionHeading({ title, center = false, id }) {
  return (
    <motion.div
      className={`section-heading ${center ? "text-center" : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      <motion.h2
        id={id}
        className="section-title"
        variants={{
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
        }}
      >
        {title}
      </motion.h2>
      <motion.span
        className="section-underline"
        aria-hidden="true"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, ease: "easeOut" } },
        }}
      />
    </motion.div>
  );
}
