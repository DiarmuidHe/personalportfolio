import { motion, useMotionValue, useSpring } from "framer-motion";

// Leans its children a few pixels towards the mouse, then springs back.
// Mouse only: touch has no hover, and keyboard users shouldn't see things move.
export default function Magnetic({ children, strength = 0.25, max = 10 }) {
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 });

  const clamp = (v) => Math.max(-max, Math.min(max, v));

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x, y, display: "inline-block" }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
