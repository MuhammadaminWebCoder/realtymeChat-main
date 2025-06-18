import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

type Direction = "left" | "right" | "top" | "bottom";

type Props = {
  children: ReactNode;
  delay?: number;
  directions?: Direction[];
  extraClass?:ReactNode,
  onClick?: () => void
};

const getInitialPosition = (directions: Direction[]) => {
  let x = 0, y = 0;

  directions.forEach((dir) => {
    if (dir === "left") x -= 50;
    if (dir === "right") x += 50;
    if (dir === "top") y -= 50;
    if (dir === "bottom") y += 50;
  });

  return { x, y };
};

export const AnimatedSection = ({ children,extraClass,onClick, delay = 0, directions = ["left"] }: Props) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const initial = { opacity: 0, ...getInitialPosition(directions) };

  return (
    <motion.div
    ref={ref}
    className={`${extraClass}`}
    onClick={onClick}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};
