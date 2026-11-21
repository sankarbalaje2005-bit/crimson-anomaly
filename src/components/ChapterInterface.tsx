/* ============================================
   CRIMSON ANOMALY — PHASE 5E
   CINEMATIC CHAPTER INTERFACE

   Visual-only component.
   Does not control chapter navigation.
============================================ */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type ChapterInterfaceProps = {
  chapterId: string;
  chapterIndex: number;
  totalChapters: number;
  direction: number;
};

type ChapterInfo = {
  title: string;
  subtitle: string;
  code: string;
};

const chapterInformation: Record<string, ChapterInfo> = {
  home: {
    title: "THE AWAKENING",
    subtitle: "INITIALIZE EXPERIENCE",
    code: "CA-000",
  },

  about: {
    title: "THE SIGNAL",
    subtitle: "IDENTITY REVEALED",
    code: "CA-001",
  },

  skills: {
    title: "THE ARCHITECTURE",
    subtitle: "SYSTEM CAPABILITIES",
    code: "CA-002",
  },

  projects: {
    title: "THE ARTIFACTS",
    subtitle: "SELECTED CREATIONS",
    code: "CA-003",
  },

  journey: {
    title: "THE TRAJECTORY",
    subtitle: "EVOLUTION IN PROGRESS",
    code: "CA-004",
  },

  experimentation: {
    title: "MOTION LAB",
    subtitle: "EXPERIMENTAL SYSTEMS",
    code: "CA-005",
  },

  contact: {
    title: "TRANSMISSION",
    subtitle: "CONNECTION AVAILABLE",
    code: "CA-006",
  },
};

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export default function ChapterInterface({
  chapterId,
  chapterIndex,
  totalChapters,
  direction,
}: ChapterInterfaceProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const chapter = chapterInformation[chapterId] ?? {
    title: "UNKNOWN CHAPTER",
    subtitle: "SYSTEM READY",
    code: "CA-000",
  };

  const travel = direction >= 0 ? "forward" : "reverse";

  const progress =
    totalChapters > 1 ? (chapterIndex / (totalChapters - 1)) * 100 : 0;

  return (
    <div className="chapter-interface" data-travel={travel} aria-hidden="true">
      {/* Top-left chapter signature */}
      <div className="ci-top-signature">
        <span className="ci-live-dot" />

        <span>CRIMSON ANOMALY</span>

        <span className="ci-signature-line" />

        <span className="ci-signature-code">{chapter.code}</span>
      </div>

      {/* Center-left orientation marks */}
      <div className="ci-side-markers">
        <span>01</span>
        <span className="ci-side-line" />
        <span>CA / SYSTEM</span>
      </div>

      {/* Bottom editorial chapter label */}
      <div className="ci-chapter-identity">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={chapterId}
            className="ci-identity-content"
            custom={direction}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: direction >= 0 ? 24 : -24,
                    filter: "blur(5px)",
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: direction >= 0 ? -20 : 20,
                    filter: "blur(5px)",
                  }
            }
            transition={{
              duration: reducedMotion ? 0.12 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="ci-identity-overline">CURRENT DIMENSION</span>

            <strong>{chapter.title}</strong>

            <span className="ci-identity-subtitle">{chapter.subtitle}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress line — not a scrolling scrollbar */}
      <div className="ci-progress">
        <span className="ci-progress-label">EXPLORATION PROGRESS</span>

        <div className="ci-progress-track">
          <motion.div
            className="ci-progress-fill"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: reducedMotion ? 0 : 0.64,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>

        <span className="ci-progress-value">
          {twoDigits(chapterIndex + 1)}
          <span> / </span>
          {twoDigits(totalChapters)}
        </span>
      </div>

      {/* Directional transition cue */}
      {!reducedMotion && (
        <div
          key={`cue-${chapterId}`}
          className="ci-transition-cue"
          data-direction={travel}
        >
          <div className="ci-transition-light" />
          <div className="ci-transition-edge" />
        </div>
      )}

      {/* Decorative technical marker */}
      <div className="ci-technical-marker">
        <span className="ci-marker-symbol">✳</span>
        <span>BEYOND THE SCREEN</span>
      </div>
    </div>
  );
}
