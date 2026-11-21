import { useEffect, useRef } from "react";

/**
 * CRIMSON ANOMALY — PHASE 5B
 *
 * Adds subtle mouse and wheel-responsive motion
 * to the existing 2.5D Sentinel.
 *
 * Important:
 * - Does not modify React navigation state.
 * - Does not prevent wheel or touch events.
 * - Does not control Motion scene transforms.
 * - Stops all animation when unmounted.
 */

const MOTION = {
  pointerDistanceX: 13,
  pointerDistanceY: 8,
  maximumRotation: 0.65,
  springStrength: 0.085,
  wheelDecay: 0.84,
  wheelSensitivity: 0.008,
  maximumWheelEnergy: 1,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

export default function SentinelMotionFX() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;

    if (!layer) return;

    const hero = layer.closest<HTMLElement>(".sentinel-hero");

    if (!hero) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Skip all continuous motion when the
    // visitor prefers reduced motion.
    if (mediaQuery.matches) {
      return;
    }

    let frameId = 0;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let wheelEnergy = 0;
    let wheelDirection = 0;

    const applyFrame = () => {
      currentX += (targetX - currentX) * MOTION.springStrength;

      currentY += (targetY - currentY) * MOTION.springStrength;

      wheelEnergy *= MOTION.wheelDecay;
      wheelDirection *= MOTION.wheelDecay;

      const moveX = currentX * MOTION.pointerDistanceX;

      const moveY = currentY * MOTION.pointerDistanceY - wheelDirection * 5;

      const rotation = currentX * MOTION.maximumRotation;

      const round = (value: number) => value.toFixed(3);

      hero.style.setProperty("--sfx-character-x", `${round(moveX)}px`);

      hero.style.setProperty("--sfx-character-y", `${round(moveY)}px`);

      hero.style.setProperty("--sfx-character-rotate", `${round(rotation)}deg`);

      hero.style.setProperty("--sfx-energy", round(wheelEnergy));

      hero.style.setProperty("--sfx-shift-x", `${round(currentX * -11)}px`);

      hero.style.setProperty("--sfx-shift-y", `${round(currentY * -7)}px`);

      const stillMoving =
        Math.abs(targetX - currentX) > 0.002 ||
        Math.abs(targetY - currentY) > 0.002 ||
        wheelEnergy > 0.005 ||
        Math.abs(wheelDirection) > 0.005;

      if (stillMoving) {
        frameId = requestAnimationFrame(applyFrame);
      } else {
        frameId = 0;
      }
    };

    const startAnimation = () => {
      if (frameId !== 0) return;

      frameId = requestAnimationFrame(applyFrame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const bounds = hero.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const normalizedX = (event.clientX - bounds.left) / bounds.width;

      const normalizedY = (event.clientY - bounds.top) / bounds.height;

      targetX = clamp((normalizedX - 0.5) * 2, -1, 1);

      targetY = clamp((normalizedY - 0.5) * 2, -1, 1);

      hero.style.setProperty(
        "--sfx-cursor-x",
        `${clamp(normalizedX * 100, 0, 100)}%`,
      );

      hero.style.setProperty(
        "--sfx-cursor-y",
        `${clamp(normalizedY * 100, 0, 100)}%`,
      );

      startAnimation();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;

      startAnimation();
    };

    const onWheel = (event: WheelEvent) => {
      // Read the wheel gesture without consuming it.
      // The existing Home.tsx zoom engine is
      // still responsible for chapter navigation.

      if (event.ctrlKey || event.metaKey) {
        return;
      }

      const scale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;

      const delta = event.deltaY * scale;

      const strength = clamp(
        Math.abs(delta) * MOTION.wheelSensitivity,
        0,
        MOTION.maximumWheelEnergy,
      );

      wheelEnergy = clamp(
        Math.max(wheelEnergy, strength),
        0,
        MOTION.maximumWheelEnergy,
      );

      wheelDirection = clamp(delta / 120, -1, 1);

      startAnimation();
    };

    const onVisibilityChange = () => {
      if (document.hidden && frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!document.hidden) {
        startAnimation();
      }
    };

    hero.addEventListener("pointermove", onPointerMove, { passive: true });

    hero.addEventListener("pointerleave", onPointerLeave);

    hero.addEventListener("wheel", onWheel, { passive: true });

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);

      hero.removeEventListener("pointerleave", onPointerLeave);

      hero.removeEventListener("wheel", onWheel);

      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }

      const properties = [
        "--sfx-character-x",
        "--sfx-character-y",
        "--sfx-character-rotate",
        "--sfx-energy",
        "--sfx-shift-x",
        "--sfx-shift-y",
        "--sfx-cursor-x",
        "--sfx-cursor-y",
      ];

      properties.forEach((property) => {
        hero.style.removeProperty(property);
      });
    };
  }, []);

  return (
    <div ref={layerRef} className="sfx-layer" aria-hidden="true">
      <div className="sfx-reactor-halo" />

      <div className="sfx-tracking-light" />

      <div className="sfx-light-column" />

      <div className="sfx-energy-field">
        <span className="sfx-energy-line sfx-line-one" />
        <span className="sfx-energy-line sfx-line-two" />
        <span className="sfx-energy-line sfx-line-three" />
      </div>

      <div className="sfx-scan-beam" />

      <div className="sfx-corner sfx-corner-top" />
      <div className="sfx-corner sfx-corner-bottom" />

      <div className="sfx-scroll-signal" />
    </div>
  );
}
