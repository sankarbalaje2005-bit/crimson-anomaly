import { useCallback, useEffect, useRef, useState } from "react";

import type { TouchEvent as ReactTouchEvent } from "react";

import { Link, useLocation, useNavigate } from "react-router";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import HeroExperience from "../components/HeroExperience";
import ChapterCinematicFX from "../components/ChapterCinematicFX";
import ChapterArtifact from "../components/ChapterArtifact";
import ChapterInterface from "../components/ChapterInterface";
import ChapterPrecisionFX from "../components/ChapterPrecisionFX";

import { identity, projects, skills } from "../data/site";

/* ==========================================
   CRIMSON ANOMALY
   CINEMATIC FULL-SCREEN HOME
========================================== */

const chapters = [
  {
    id: "home",
    name: "The Awakening",
    number: "00",
  },
  {
    id: "about",
    name: "The Signal",
    number: "01",
  },
  {
    id: "skills",
    name: "The Architecture",
    number: "02",
  },
  {
    id: "projects",
    name: "The Artifacts",
    number: "03",
  },
  {
    id: "journey",
    name: "The Trajectory",
    number: "04",
  },
  {
    id: "experimentation",
    name: "Motion Lab",
    number: "05",
  },
  {
    id: "contact",
    name: "Transmission",
    number: "06",
  },
] as const;

/* ==========================================
   HELPERS
========================================== */

function getChapterIndex(hash: string): number {
  const id = hash.replace(/^#/, "");

  const index = chapters.findIndex((chapter) => chapter.id === id);

  return index >= 0 ? index : 0;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      [
        "input",
        "textarea",
        "select",
        '[contenteditable="true"]',
        '[role="dialog"]',
      ].join(","),
    ),
  );
}

function canScrollInternally(
  target: EventTarget | null,
  delta: number,
): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const panel = target.closest(".chapter-inner-scroll");

  if (!(panel instanceof HTMLElement)) {
    return false;
  }

  const maximumScroll = panel.scrollHeight - panel.clientHeight;

  if (maximumScroll <= 2) {
    return false;
  }

  if (delta > 0) {
    return panel.scrollTop < maximumScroll - 2;
  }

  if (delta < 0) {
    return panel.scrollTop > 2;
  }

  return false;
}

/* ==========================================
   ABOUT — THE SIGNAL
========================================== */

function AboutChapter() {
  return (
    <div className="chapter-content about-chapter">
      <span className="chapter-eyebrow">01 / THE SIGNAL</span>

      <h2>
        IDEAS DESERVE
        <br />
        <span>A DIFFERENT DIMENSION.</span>
      </h2>

      <div className="chapter-columns">
        <div className="chapter-visual" aria-hidden="true">
          <div className="chapter-geometric-core" />

          <span>BUILD / EXPERIMENT / EVOLVE</span>
        </div>

        <div className="chapter-description">
          <p>
            I'm <strong>Sankar Balaje</strong>, a Full-Stack Developer and AI
            Product Builder at the beginning of my professional journey.
          </p>

          <p>
            I connect software engineering, artificial intelligence, emerging
            technologies, and immersive interface design.
          </p>

          <p className="chapter-muted">
            Engineering ideas. Coding possibilities. Building intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   SKILLS — THE ARCHITECTURE
========================================== */

function SkillsChapter() {
  return (
    <div className="chapter-content skills-chapter">
      <span className="chapter-eyebrow">02 / THE ARCHITECTURE</span>

      <h2>
        BUILDING
        <br />
        <span>INTELLIGENT SYSTEMS.</span>
      </h2>

      <p className="chapter-lead">
        My toolkit spans interfaces, backends, AI integrations, and deployment.
      </p>

      <div className="chapter-skills">
        {skills.map((group, index) => (
          <article className="chapter-skill" key={group.category}>
            <span className="chapter-card-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3>{group.category}</h3>

            <div className="chapter-tags">
              {group.entries.map((entry) => (
                <span key={entry}>{entry}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   PROJECTS — THE ARTIFACTS
========================================== */

function ProjectsChapter() {
  return (
    <div className="chapter-content projects-chapter">
      <span className="chapter-eyebrow">03 / THE ARTIFACTS</span>

      <h2>
        SELECTED
        <br />
        <span>CREATIONS.</span>
      </h2>

      <p className="chapter-lead">
        Experiments, applications, and products transformed from ideas into
        working software.
      </p>

      <div className="chapter-project-list">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            className="chapter-project"
            to={`/projects/${project.slug}`}
          >
            <span className="chapter-card-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="chapter-project-title">
              {project.title}

              <small>{project.description}</small>
            </span>

            <span className="chapter-project-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   JOURNEY — THE TRAJECTORY
========================================== */

function JourneyChapter() {
  return (
    <div className="chapter-content journey-chapter">
      <span className="chapter-eyebrow">04 / THE TRAJECTORY</span>

      <h2>
        MECHANICAL ORIGINS.
        <br />
        <span>DIGITAL AMBITIONS.</span>
      </h2>

      <div className="chapter-journey">
        <span className="chapter-year">{identity.years}</span>

        <div>
          <h3>{identity.degree}</h3>

          <p>{identity.university}</p>

          <p className="chapter-muted">CGPA: {identity.cgpa}</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MOTION LAB — EXPERIMENTATION
========================================== */

function ExperimentChapter() {
  return (
    <div className="chapter-content experiment-chapter">
      <span className="chapter-eyebrow">05 / THE EXPERIMENTATION</span>

      <h2>
        DON'T JUST BROWSE.
        <br />
        <span>INTERFERE.</span>
      </h2>

      <p className="chapter-lead">
        Enter an experimental playground for creative interfaces, motion
        systems, and spatial experiences.
      </p>

      <Link to="/lab" className="button-primary">
        ENTER MOTION LAB ↗
      </Link>

      <Link to="/dimension" className="chapter-secondary-link">
        DISCOVER THE HIDDEN DIMENSION ↗
      </Link>
    </div>
  );
}

/* ==========================================
   CONTACT — TRANSMISSION
========================================== */

function ContactChapter() {
  return (
    <div className="chapter-content contact-chapter">
      <span className="chapter-eyebrow">06 / THE TRANSMISSION</span>

      <h2>
        HAVE AN IDEA?
        <br />
        <span>LET'S BUILD WHAT'S NEXT.</span>
      </h2>

      <p className="chapter-lead">
        Let's connect and create something meaningful.
      </p>

      <div className="chapter-contact-links">
        <a
          className="button-primary"
          href={identity.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          EXPLORE GITHUB ↗
        </a>

        {identity.linkedin && (
          <a
            className="button-quiet"
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LINKEDIN ↗
          </a>
        )}

        {identity.email && (
          <a className="button-quiet" href={`mailto:${identity.email}`}>
            SEND AN EMAIL ↗
          </a>
        )}

        {identity.resume && (
          <a
            className="button-quiet"
            href={identity.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW RÉSUMÉ ↗
          </a>
        )}
      </div>

      <p className="chapter-signature">SANKAR BALAJE / BEYOND THE SCREEN</p>
    </div>
  );
}

/* ==========================================
   SEVEN EXISTING CHAPTER VIEWS
========================================== */

const chapterViews = [
  HeroExperience,
  AboutChapter,
  SkillsChapter,
  ProjectsChapter,
  JourneyChapter,
  ExperimentChapter,
  ContactChapter,
];

/* ==========================================
   FORWARD / REVERSE ZOOM ANIMATION
========================================== */

const sceneVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: direction > 0 ? 0.72 : 1.32,
    filter: "blur(10px)",
  }),

  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },

  exit: (direction: number) => ({
    opacity: 0,
    scale: direction > 0 ? 1.32 : 0.72,
    filter: "blur(10px)",
  }),
};

/* ==========================================
   MAIN HOME COMPONENT

   IMPORTANT:
   Every hook remains INSIDE this component.
========================================== */

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const reducedMotion = Boolean(useReducedMotion());

  const stageRef = useRef<HTMLElement>(null);

  const lastNavigation = useRef(0);
  const wheelAccumulation = useRef(0);

  const touchStart = useRef({
    x: 0,
    y: 0,
  });

  const [direction, setDirection] = useState(1);

  // The hash determines which chapter is displayed.
  const activeIndex = getChapterIndex(location.hash);

  /* ========================================
     CHAPTER NAVIGATION
  ======================================== */

  const goToChapter = useCallback(
    (index: number, throttle = false) => {
      const next = Math.max(0, Math.min(chapters.length - 1, index));

      if (next === activeIndex) {
        return;
      }

      const now = performance.now();

      if (throttle && now - lastNavigation.current < 900) {
        return;
      }

      lastNavigation.current = now;

      wheelAccumulation.current = 0;

      setDirection(next > activeIndex ? 1 : -1);

      navigate({
        pathname: "/",
        hash: `#${chapters[next].id}`,
      });
    },
    [activeIndex, navigate],
  );

  /* ========================================
     MOUSE WHEEL / TRACKPAD

     Registered only while Home is mounted.
  ======================================== */

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || isEditableTarget(event.target)) {
        return;
      }

      const amount =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1);

      if (Math.abs(amount) < 0.1) {
        return;
      }

      // Allow overflowing content to scroll
      // before switching chapters.
      if (canScrollInternally(event.target, amount)) {
        wheelAccumulation.current = 0;
        return;
      }

      event.preventDefault();

      const previous = wheelAccumulation.current;

      if (previous !== 0 && Math.sign(previous) !== Math.sign(amount)) {
        wheelAccumulation.current = 0;
      }

      wheelAccumulation.current += amount;

      // Small trackpad movements accumulate.
      if (Math.abs(wheelAccumulation.current) < 70) {
        return;
      }

      const nextDirection = wheelAccumulation.current > 0 ? 1 : -1;

      wheelAccumulation.current = 0;

      goToChapter(activeIndex + nextDirection, true);
    };

    stage.addEventListener("wheel", onWheel, {
      passive: false,
    });

    return () => {
      stage.removeEventListener("wheel", onWheel);
    };
  }, [activeIndex, goToChapter]);

  /* ========================================
     KEYBOARD NAVIGATION
  ======================================== */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      const isInteractive =
        event.target instanceof HTMLElement &&
        Boolean(event.target.closest("a, button"));

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        if (isInteractive) return;

        if (canScrollInternally(event.target, 100)) {
          return;
        }

        event.preventDefault();

        goToChapter(activeIndex + 1);
        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        if (isInteractive) return;

        if (canScrollInternally(event.target, -100)) {
          return;
        }

        event.preventDefault();

        goToChapter(activeIndex - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToChapter(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goToChapter(chapters.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, goToChapter]);

  /* ========================================
     TOUCH NAVIGATION
  ======================================== */

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];

    if (!touch) return;

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];

    if (!touch) return;

    const deltaY = touchStart.current.y - touch.clientY;

    const deltaX = touchStart.current.x - touch.clientX;

    // Ignore taps and mostly horizontal swipes.
    if (Math.abs(deltaY) < 65 || Math.abs(deltaY) < Math.abs(deltaX) * 1.3) {
      return;
    }

    // Preserve scrolling inside long chapters.
    if (canScrollInternally(event.target, deltaY)) {
      return;
    }

    goToChapter(activeIndex + (deltaY > 0 ? 1 : -1), true);
  };

  /* ========================================
     ACCESSIBILITY: FOCUS NEW HEADING
  ======================================== */

  useEffect(() => {
    // Do not take focus away from the
    // initial page on first mount.
    if (!location.hash) return;

    const frame = requestAnimationFrame(() => {
      const page = stageRef.current?.querySelector(
        `.chapter-page--${chapters[activeIndex].id}`,
      );

      const heading = page?.querySelector<HTMLElement>("h1, h2");

      if (!heading) return;

      heading.tabIndex = -1;

      heading.focus({
        preventScroll: true,
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [activeIndex, location.hash]);

  /* ========================================
     CURRENT CHAPTER
  ======================================== */

  const CurrentView = chapterViews[activeIndex];

  /* ========================================
     RENDER
  ======================================== */

  return (
    <main
      id="main-content"
      ref={stageRef}
      className="chapter-experience"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* CINEMATIC ZOOM STAGE */}

      <div className="chapter-stage">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.section
            key={chapters[activeIndex].id}
            data-active="true"
            className={`chapter-page chapter-page--${chapters[activeIndex].id}`}
            custom={direction}
            variants={sceneVariants}
            initial={
              reducedMotion
                ? {
                    opacity: 0,
                    scale: 1,
                  }
                : "enter"
            }
            animate={
              reducedMotion
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : "center"
            }
            exit={
              reducedMotion
                ? {
                    opacity: 0,
                    scale: 1,
                  }
                : "exit"
            }
            transition={{
              duration: reducedMotion ? 0.18 : 0.88,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="chapter-inner-scroll">
              <CurrentView />
            </div>

            <ChapterArtifact chapterId={chapters[activeIndex].id} />

            {/* Phase 5C — cinematic chapter visuals */}
            <ChapterCinematicFX
              chapterId={chapters[activeIndex].id}
              direction={direction}
            />
          </motion.section>
        </AnimatePresence>

        <ChapterPrecisionFX chapterId={chapters[activeIndex].id} />

        <ChapterInterface
          chapterId={chapters[activeIndex].id}
          chapterIndex={activeIndex}
          totalChapters={chapters.length}
          direction={direction}
        />
      </div>

      {/* RIGHT-SIDE CHAPTER DOTS */}

      <nav className="chapter-nav" aria-label="Portfolio chapters">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            className={
              index === activeIndex ? "chapter-dot is-active" : "chapter-dot"
            }
            type="button"
            title={chapter.name}
            aria-label={`Go to ${chapter.name}`}
            aria-current={index === activeIndex ? "step" : undefined}
            onClick={() => {
              goToChapter(index);
            }}
          >
            <span />
          </button>
        ))}
      </nav>

      {/* CHAPTER COUNTER */}

      <div className="chapter-counter" aria-live="polite">
        <span>{chapters[activeIndex].number}</span>

        <span className="chapter-counter-divider">/</span>

        <span>06</span>
      </div>

      {/* NEXT / PREVIOUS BUTTONS */}

      <div className="chapter-direction-controls">
        <button
          type="button"
          aria-label="Previous chapter"
          disabled={activeIndex === 0}
          onClick={() => {
            goToChapter(activeIndex - 1);
          }}
        >
          ↑
        </button>

        <button
          type="button"
          aria-label="Next chapter"
          disabled={activeIndex === chapters.length - 1}
          onClick={() => {
            goToChapter(activeIndex + 1);
          }}
        >
          ↓
        </button>
      </div>
    </main>
  );
}
