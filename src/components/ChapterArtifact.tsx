import { useEffect, useRef } from "react";

type ChapterArtifactProps = {
  chapterId: string;
};

const nodes = [
  { x: 22, y: 25 },
  { x: 45, y: 16 },
  { x: 72, y: 31 },
  { x: 85, y: 57 },
  { x: 56, y: 75 },
  { x: 24, y: 68 },
  { x: 47, y: 46 },
];

const connections = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [0, 6],
  [1, 6],
  [2, 6],
  [4, 6],
  [5, 6],
];

function HomeArtifact() {
  return (
    <div className="artifact-home" aria-hidden="true">
      <div className="artifact-home-orbit" />
      <div className="artifact-home-line" />
      <span>CA / 001</span>
    </div>
  );
}

function SignalArtifact() {
  return (
    <div className="artifact-signal">
      <div className="artifact-signal-halo" />

      <div className="artifact-signal-ring ring-one" />
      <div className="artifact-signal-ring ring-two" />
      <div className="artifact-signal-ring ring-three" />

      <div className="artifact-signal-core">
        <span className="artifact-core-center" />
      </div>

      <span className="artifact-visual-label">SIGNAL / ORIGIN</span>
    </div>
  );
}

function NeuralArtifact() {
  return (
    <div className="artifact-neural">
      <svg
        viewBox="0 0 100 100"
        className="artifact-neural-svg"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="artifact-network-line"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#CDCBCA" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#D41514" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {connections.map(([a, b], index) => (
          <line
            key={`connection-${index}`}
            className="artifact-network-connection"
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#artifact-network-line)"
            strokeWidth="0.35"
          />
        ))}

        {nodes.map((node, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={index === 6 ? 6 : 3.5}
              fill="#D41514"
              fillOpacity={index === 6 ? 0.17 : 0.08}
            />

            <circle
              className="artifact-network-node"
              cx={node.x}
              cy={node.y}
              r={index === 6 ? 2 : 1.2}
              fill={index === 6 ? "#D41514" : "#CDCBCA"}
              style={{
                animationDelay: `${index * 0.25}s`,
              }}
            />
          </g>
        ))}
      </svg>

      <span className="artifact-visual-label">SYSTEM / CONNECTED</span>
    </div>
  );
}

function VaultArtifact() {
  return (
    <div className="artifact-vault">
      <div className="artifact-vault-back" />

      <div className="artifact-vault-frame">
        <div className="artifact-vault-symbol">
          <span>CA</span>
          <small>03 / ARTIFACT</small>
        </div>

        <div className="artifact-vault-scan" />

        <span className="artifact-vault-corner corner-a" />
        <span className="artifact-vault-corner corner-b" />
        <span className="artifact-vault-corner corner-c" />
        <span className="artifact-vault-corner corner-d" />
      </div>

      <span className="artifact-visual-label">OBJECT / DISCOVERED</span>
    </div>
  );
}

function TrajectoryArtifact() {
  return (
    <div className="artifact-trajectory">
      <svg
        viewBox="0 0 400 400"
        className="artifact-trajectory-svg"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="artifact-trajectory-gradient"
            x1="0"
            y1="1"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#5D1010" />
            <stop offset="100%" stopColor="#D41514" />
          </linearGradient>
        </defs>

        <path
          d="M35 335 L125 250 L200 273 L285 155 L368 64"
          fill="none"
          stroke="#CDCBCA"
          strokeOpacity="0.1"
          strokeWidth="14"
        />

        <path
          className="artifact-trajectory-path"
          d="M35 335 L125 250 L200 273 L285 155 L368 64"
          fill="none"
          stroke="url(#artifact-trajectory-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />

        {[
          [35, 335],
          [125, 250],
          [200, 273],
          [285, 155],
          [368, 64],
        ].map(([x, y], index) => (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="11"
              stroke="#D41514"
              strokeOpacity="0.45"
              fill="#080808"
            />
            <circle cx={x} cy={y} r="3" fill="#D41514" />
          </g>
        ))}
      </svg>

      <span className="artifact-visual-label">EVOLUTION / CONTINUOUS</span>
    </div>
  );
}

function KineticArtifact() {
  return (
    <div className="artifact-kinetic">
      <div className="artifact-kinetic-glow" />

      <div className="artifact-kinetic-ring outer" />
      <div className="artifact-kinetic-ring middle" />
      <div className="artifact-kinetic-ring inner" />

      <div className="artifact-kinetic-cube">
        <span className="kinetic-face face-front" />
        <span className="kinetic-face face-back" />
        <span className="kinetic-face face-left" />
        <span className="kinetic-face face-right" />
        <span className="kinetic-face face-top" />
        <span className="kinetic-face face-bottom" />
      </div>

      <span className="artifact-visual-label">EXPERIMENT / ACTIVE</span>
    </div>
  );
}

function TransmissionArtifact() {
  return (
    <div className="artifact-transmission">
      <div className="artifact-transmission-wave wave-one" />
      <div className="artifact-transmission-wave wave-two" />
      <div className="artifact-transmission-wave wave-three" />

      <div className="artifact-transmission-core">
        <span />
      </div>

      <div className="artifact-transmission-line horizontal" />
      <div className="artifact-transmission-line vertical" />

      <span className="artifact-visual-label">TRANSMISSION / READY</span>
    </div>
  );
}

function ArtifactVisual({ chapterId }: ChapterArtifactProps) {
  switch (chapterId) {
    case "home":
      return <HomeArtifact />;

    case "about":
      return <SignalArtifact />;

    case "skills":
      return <NeuralArtifact />;

    case "projects":
      return <VaultArtifact />;

    case "journey":
      return <TrajectoryArtifact />;

    case "experimentation":
      return <KineticArtifact />;

    case "contact":
      return <TransmissionArtifact />;

    default:
      return null;
  }
}

export default function ChapterArtifact({ chapterId }: ChapterArtifactProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const page = layer.closest<HTMLElement>(".chapter-page");

    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === "touch") {
        return;
      }

      const rect = page.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const x = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      );

      const y = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
      );

      layer.style.setProperty("--artifact-move-x", `${(x * 15).toFixed(2)}px`);

      layer.style.setProperty("--artifact-move-y", `${(y * 10).toFixed(2)}px`);
    };

    const reset = () => {
      layer.style.setProperty("--artifact-move-x", "0px");

      layer.style.setProperty("--artifact-move-y", "0px");
    };

    page.addEventListener("pointermove", onPointerMove, { passive: true });

    page.addEventListener("pointerleave", reset);

    return () => {
      page.removeEventListener("pointermove", onPointerMove);

      page.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="chapter-artifact-layer"
      data-artifact={chapterId}
      aria-hidden="true"
    >
      <div className="chapter-artifact-position">
        <div className="chapter-artifact-motion">
          <ArtifactVisual chapterId={chapterId} />
        </div>
      </div>
    </div>
  );
}
