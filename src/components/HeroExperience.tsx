import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router";
import { useReducedMotion } from "motion/react";
import { identity } from "../data/site";
import SentinelMotionFX from "./SentinelMotionFX";

export default function HeroExperience() {
  const navigate = useNavigate();
  const reducedMotion = Boolean(useReducedMotion());

  const [coreBoost, setCoreBoost] = useState(false);
  const [entering, setEntering] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") {
      return;
    }

    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();

    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    element.style.setProperty("--parallax-x", `${x * 22}px`);

    element.style.setProperty("--parallax-y", `${y * 14}px`);

    element.style.setProperty("--hud-x", `${x * -12}px`);

    element.style.setProperty("--hud-y", `${y * -10}px`);
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    const element = event.currentTarget;

    element.style.setProperty("--parallax-x", "0px");
    element.style.setProperty("--parallax-y", "0px");
    element.style.setProperty("--hud-x", "0px");
    element.style.setProperty("--hud-y", "0px");
  }

  function handleEnter() {
    if (entering) return;

    if (reducedMotion) {
      navigate("/#about");
      return;
    }

    setEntering(true);

    timerRef.current = setTimeout(() => {
      navigate("/#about");
      timerRef.current = null;
    }, 450);
  }

  return (
    <div
      id="home"
      className={[
        "hero",
        "sentinel-hero",
        entering ? "sentinel-entering" : "",
        coreBoost ? "sentinel-boosted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="sentinel-atmosphere" aria-hidden="true" />

      <div className="sentinel-grid" aria-hidden="true" />

      <div className="sentinel-energy-beam beam-one" aria-hidden="true" />

      <div className="sentinel-energy-beam beam-two" aria-hidden="true" />

      <div className="sentinel-image-motion" aria-hidden="true">
        <div className="sentinel-image-window">
          <div className="sentinel-image-float">
            <img
              className="sentinel-character"
              src="/images/crimson-sentinel-hero.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="sentinel-image-vignette" />
        </div>

        <div className="sentinel-red-aura" />
        <div className="sentinel-light-sweep" />
      </div>

      <SentinelMotionFX />
      <div className="sentinel-hud-layer">
        <div className="sentinel-target-ring" aria-hidden="true">
          <span className="target-crosshair" />
        </div>

        <div className="sentinel-hud-panel hud-top">
          <span className="hud-overline">IDENTITY PROTOCOL / 001</span>

          <strong>CRIMSON SENTINEL</strong>

          <span className="hud-detail">VISUAL SYSTEM / ACTIVE</span>

          <span className="hud-progress">
            <span />
          </span>
        </div>

        <div className="sentinel-hud-panel hud-bottom">
          <span className="hud-overline">CREATIVE ENGINE</span>

          <strong>
            FULL-STACK
            <br />+ AI SYSTEMS
          </strong>

          <span className="hud-detail">BUILD / EXPERIMENT / EVOLVE</span>
        </div>

        <div className="sentinel-core-panel">
          <span className="hud-overline">CRIMSON CORE</span>

          <button
            type="button"
            className="sentinel-core-button"
            aria-pressed={coreBoost}
            onClick={() => setCoreBoost((value) => !value)}
          >
            <span className="sentinel-core-dot" aria-hidden="true" />

            {coreBoost ? "BOOST ACTIVE" : "ACTIVATE GLOW"}
          </button>
        </div>
      </div>

      <div className="hero-content sentinel-copy container">
        <div className="sentinel-copy-inner">
          <p className="eyebrow sentinel-reveal">
            <span className="sentinel-live-dot" aria-hidden="true" />
            SYSTEM INITIALIZED / 001
            <span className="line" />
          </p>

          <h1 id="hero-title" className="sentinel-title sentinel-reveal">
            SANKAR
            <br />
            <span>
              BALAJE
              <span className="accent">.</span>
            </span>
          </h1>

          <p className="hero-role sentinel-reveal">
            FULL-STACK DEVELOPER
            <span className="accent"> / </span>
            AI PRODUCT BUILDER
          </p>

          <p className="hero-tagline sentinel-reveal">{identity.tagline}</p>

          <div className="hero-actions sentinel-reveal">
            <button
              className="button-primary sentinel-enter-button"
              type="button"
              disabled={entering}
              onClick={handleEnter}
            >
              ENTER MY UNIVERSE
              <span aria-hidden="true"> ↗</span>
            </button>

            <a href="/#projects" className="button-quiet">
              EXPLORE PROJECTS
              <span aria-hidden="true"> ↓</span>
            </a>
          </div>

          <div className="sentinel-status sentinel-reveal">
            <span className="sentinel-status-indicator" aria-hidden="true" />

            <span>ENGINEERING IDEAS INTO REALITY</span>
          </div>
        </div>
      </div>

      <div className="sentinel-side-label" aria-hidden="true">
        ANOMALY / HUMAN × INTELLIGENCE
      </div>

      <button
        className="scroll-cue sentinel-scroll"
        type="button"
        onClick={handleEnter}
      >
        SCROLL / ZOOM INTO THE SIGNAL
        <span aria-hidden="true"> ↓</span>
      </button>

      <div className="sentinel-transition-wipe" aria-hidden="true" />
    </div>
  );
}
