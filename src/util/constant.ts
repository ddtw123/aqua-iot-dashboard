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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const REGION = process.env.REGION;
export const DYNAMO_TABLE_NAME = process.env.DYNAMO_TABLE_NAME;
export const SPECIES_TABLE_NAME = process.env.SPECIES_TABLE_NAME;
export const AI_INSIGHTS_TABLE = process.env.AI_INSIGHT_TABLE_NAME || "ai_insights";
export const SENSOR_TABLE = process.env.DYNAMO_TABLE_NAME;
export const THRESHOLDS_TABLE = process.env.THRESHOLDS_TABLE_NAME;