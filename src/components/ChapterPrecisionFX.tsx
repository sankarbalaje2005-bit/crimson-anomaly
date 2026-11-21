import { useEffect, useRef } from "react";

/* ==========================================
   CRIMSON ANOMALY — PHASE 5F
   PRECISION INTERACTION ENGINE

   Independent, decorative, pointer-safe.

   Does not:
   - change React navigation state
   - intercept wheel or touch events
   - modify scene transforms
   - modify the Crimson Sentinel
========================================== */

type ChapterPrecisionFXProps = {
  chapterId: string;
};

const TARGET_SELECTOR = [
  ".chapter-project",
  ".chapter-skill",
  ".chapter-contact-links a",
  ".chapter-secondary-link",
  ".chapter-page--experimentation .button-primary",
].join(", ");

const EASING = 0.16;

function interpolate(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function ChapterPrecisionFX({
  chapterId,
}: ChapterPrecisionFXProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;

    if (!layer) return;

    const stage = layer.closest<HTMLElement>(".chapter-stage");

    if (!stage) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let frame = 0;
    let enabled = false;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let initialized = false;

    let activeTarget: HTMLElement | null = null;

    /* ======================================
       INTERACTIVE TARGET CLEANUP
    ====================================== */

    const clearTarget = () => {
      if (activeTarget) {
        activeTarget.removeAttribute("data-precision-active");

        activeTarget = null;
      }
    };

    const updateTarget = (candidate: HTMLElement | null) => {
      if (candidate === activeTarget) {
        return;
      }

      clearTarget();

      if (candidate) {
        candidate.setAttribute("data-precision-active", "true");

        activeTarget = candidate;
      }
    };

    /* ======================================
       SMOOTH POINTER RENDERING
    ====================================== */

    const renderFrame = () => {
      frame = 0;

      if (!enabled) {
        return;
      }

      currentX = interpolate(currentX, targetX, EASING);

      currentY = interpolate(currentY, targetY, EASING);

      layer.style.setProperty("--pfx-x", `${currentX.toFixed(2)}px`);

      layer.style.setProperty("--pfx-y", `${currentY.toFixed(2)}px`);

      const distance =
        Math.abs(targetX - currentX) + Math.abs(targetY - currentY);

      if (distance > 0.3) {
        frame = requestAnimationFrame(renderFrame);
      } else {
        currentX = targetX;
        currentY = targetY;

        layer.style.setProperty("--pfx-x", `${currentX.toFixed(2)}px`);

        layer.style.setProperty("--pfx-y", `${currentY.toFixed(2)}px`);
      }
    };

    const scheduleFrame = () => {
      if (frame !== 0 || !enabled) {
        return;
      }

      frame = requestAnimationFrame(renderFrame);
    };

    /* ======================================
       POINTER TRACKING
    ====================================== */

    const onPointerMove = (event: PointerEvent) => {
      if (
        motionPreference.matches ||
        !finePointer.matches ||
        (event.pointerType !== "mouse" && event.pointerType !== "pen")
      ) {
        return;
      }

      const rect = stage.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      targetX = clamp(event.clientX - rect.left, 0, rect.width);

      targetY = clamp(event.clientY - rect.top, 0, rect.height);

      if (!initialized) {
        currentX = targetX;
        currentY = targetY;
        initialized = true;
      }

      enabled = true;

      layer.setAttribute("data-precision-visible", "true");

      const element = event.target instanceof Element ? event.target : null;

      const closestTarget = element?.closest(TARGET_SELECTOR);

      updateTarget(closestTarget instanceof HTMLElement ? closestTarget : null);

      scheduleFrame();
    };

    /* ======================================
       RESET WHEN LEAVING THE STAGE
    ====================================== */

    const onPointerLeave = () => {
      enabled = false;

      layer.setAttribute("data-precision-visible", "false");

      clearTarget();

      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onMotionPreferenceChange = () => {
      if (motionPreference.matches || !finePointer.matches) {
        onPointerLeave();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        onPointerLeave();
      }
    };

    /* ======================================
       LISTENERS

       Passive pointer tracking.
       No wheel or navigation listeners.
    ====================================== */

    stage.addEventListener("pointermove", onPointerMove, { passive: true });

    stage.addEventListener("pointerleave", onPointerLeave);

    window.addEventListener("blur", onPointerLeave);

    document.addEventListener("visibilitychange", onVisibilityChange);

    motionPreference.addEventListener("change", onMotionPreferenceChange);

    finePointer.addEventListener("change", onMotionPreferenceChange);

    /* ======================================
       CLEANUP ON UNMOUNT
    ====================================== */

    return () => {
      stage.removeEventListener("pointermove", onPointerMove);

      stage.removeEventListener("pointerleave", onPointerLeave);

      window.removeEventListener("blur", onPointerLeave);

      document.removeEventListener("visibilitychange", onVisibilityChange);

      motionPreference.removeEventListener("change", onMotionPreferenceChange);

      finePointer.removeEventListener("change", onMotionPreferenceChange);

      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }

      clearTarget();
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="chapter-precision-fx"
      data-chapter={chapterId}
      data-precision-visible="false"
      aria-hidden="true"
    >
      <div className="pfx-cursor-glow" />

      <div className="pfx-cursor-core" />

      <div className="pfx-ambient-grain" />
    </div>
  );
}
