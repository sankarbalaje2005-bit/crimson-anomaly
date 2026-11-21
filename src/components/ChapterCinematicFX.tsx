/* ==========================================
   CRIMSON ANOMALY — PHASE 5C
   CINEMATIC CHAPTER VISUAL EFFECTS

   Decorative only.
   Navigation remains controlled by Home.tsx.
========================================== */

type ChapterCinematicFXProps = {
  chapterId: string;
  direction: number;
};

export default function ChapterCinematicFX({
  chapterId,
  direction,
}: ChapterCinematicFXProps) {
  const travelDirection = direction >= 0 ? "forward" : "reverse";

  return (
    <div
      className="chapter-cinematic-fx"
      data-chapter={chapterId}
      data-direction={travelDirection}
      aria-hidden="true"
    >
      {/* Ambient illumination for every chapter */}
      <div className="cfx-ambient" />

      {/* Expanding cinematic portal */}
      <div className="cfx-portal">
        <div className="cfx-portal-outer" />
        <div className="cfx-portal-middle" />
        <div className="cfx-portal-inner" />
      </div>

      {/* Short lighting event during chapter entrance */}
      <div className="cfx-transition-flash" />

      {/* Directional light across the scene */}
      <div className="cfx-energy-sweep" />

      {/* Technical depth-grid */}
      <div className="cfx-grid" />

      {/* Persistent decorative target rings */}
      <div className="cfx-orbit-system">
        <div className="cfx-orbit cfx-orbit-one" />
        <div className="cfx-orbit cfx-orbit-two" />
        <div className="cfx-orbit cfx-orbit-three" />
      </div>

      {/* Small energy trails */}
      <div className="cfx-traces">
        <span className="cfx-trace cfx-trace-one" />
        <span className="cfx-trace cfx-trace-two" />
        <span className="cfx-trace cfx-trace-three" />
      </div>

      {/* Small framing details */}
      <span className="cfx-corner cfx-corner-tl" />
      <span className="cfx-corner cfx-corner-tr" />
      <span className="cfx-corner cfx-corner-bl" />
      <span className="cfx-corner cfx-corner-br" />
    </div>
  );
}
