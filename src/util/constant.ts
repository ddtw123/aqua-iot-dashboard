import { Transition } from "framer-motion";

export const animationVieport = {
  once: true,
  margin: "-100px",
};
export const fadeInYInitial = {
  opacity: 0,
  y: 25,
};
export const fadeInYEnd = {
  opacity: 1,
  y: 0,
};

export const fadeInXInitial = {
  opacity: 0,
  x: -25,
};
export const fadeInXEnd = {
  opacity: 1,
  x: 0,
};
export const fadeOutYInitial = {
  opacity: 0,
  y: -25,
  transition: { duration: 0.5, ease: "easeOut" }
};
export const fadefastTransition: Transition = {
  duration: 0.5,
  ease: "easeInOut",
};
export const fadeTransition: Transition = {
  duration: 1.25,
  ease: "easeInOut",
};
