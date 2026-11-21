import { useEffect } from "react";

export default function SceneReactor() {
  useEffect(() => {
    const root = document.documentElement;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    const update = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      root.style.setProperty("--scene-pointer-x", `${currentX.toFixed(2)}%`);

      root.style.setProperty("--scene-pointer-y", `${currentY.toFixed(2)}%`);

      const distance =
        Math.abs(targetX - currentX) + Math.abs(targetY - currentY);

      frame = distance > 0.05 ? requestAnimationFrame(update) : 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === "touch") return;

      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;

      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    const onPointerLeave = () => {
      targetX = 50;
      targetY = 50;

      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);

      document.removeEventListener("pointerleave", onPointerLeave);

      if (frame) cancelAnimationFrame(frame);

      root.style.removeProperty("--scene-pointer-x");
      root.style.removeProperty("--scene-pointer-y");
    };
  }, []);

  return (
    <div className="scene-light-system" aria-hidden="true">
      <div className="scene-ambient-light" />
      <div className="scene-pointer-light" />
      <div className="scene-edge-light" />
      <div className="scene-noise" />
    </div>
  );
}
