import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PointerTarget = {
  current: {
    x: number;
    y: number;
  };
};

type SceneProps = {
  pointer: PointerTarget;
  activated: boolean;
  reducedMotion: boolean;
  visible: boolean;
};

type Beam = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/*
  Original procedural SB emblem.

  Each stroke is a separate solid 3D beam.
  These components can assemble, rotate,
  separate, and eventually morph into
  other structures in later phases.
*/

const BEAMS: Beam[] = [
  // Letter S
  { x: -0.92, y: 0.82, width: 1.12, height: 0.2 },
  { x: -1.38, y: 0.42, width: 0.2, height: 0.82 },
  { x: -0.92, y: 0.02, width: 1.12, height: 0.2 },
  { x: -0.46, y: -0.38, width: 0.2, height: 0.82 },
  { x: -0.92, y: -0.78, width: 1.12, height: 0.2 },

  // Letter B
  { x: 0.3, y: 0.02, width: 0.2, height: 1.8 },
  { x: 0.82, y: 0.82, width: 1.08, height: 0.2 },
  { x: 1.27, y: 0.42, width: 0.2, height: 0.82 },
  { x: 0.82, y: 0.02, width: 1.08, height: 0.2 },
  { x: 1.27, y: -0.38, width: 0.2, height: 0.82 },
  { x: 0.82, y: -0.78, width: 1.08, height: 0.2 },
];

const SHARD_COUNT = 18;

const SHARDS = Array.from({ length: SHARD_COUNT }, (_, index) => {
  const angle = (index / SHARD_COUNT) * Math.PI * 2;

  return {
    x: Math.cos(angle) * (2.1 + (index % 3) * 0.22),
    y: Math.sin(angle) * (1.42 + (index % 4) * 0.18),
    z: Math.sin(index * 2.1) * 0.65,
    scale: 0.035 + (index % 4) * 0.018,
  };
});

function Emblem({
  pointer,
  activated,
  reducedMotion,
}: Omit<SceneProps, "visible">) {
  const root = useRef<THREE.Group>(null);
  const fragments = useRef<(THREE.Group | null)[]>([]);
  const energyRing = useRef<THREE.Mesh>(null);
  const shardsRoot = useRef<THREE.Group>(null);

  const assembly = useRef(reducedMotion ? 1 : 0);
  const dispersion = useRef(0);

  useFrame(({ clock, camera }, delta) => {
    const time = clock.getElapsedTime();
    const step = Math.min(delta, 0.05);

    if (!reducedMotion) {
      assembly.current = Math.min(1, assembly.current + step / 2.1);
    } else {
      assembly.current = 1;
    }

    const desiredDispersion = activated ? 1 : 0;

    dispersion.current = THREE.MathUtils.damp(
      dispersion.current,
      desiredDispersion,
      2.8,
      step,
    );

    const assembleEase = 1 - Math.pow(1 - assembly.current, 3);

    fragments.current.forEach((fragment, index) => {
      if (!fragment) return;

      const beam = BEAMS[index];

      const scatterAngle = index * 2.399963229728653;

      const scatterRadius = 2.8 + (index % 4) * 0.42;

      const scatteredX = Math.cos(scatterAngle) * scatterRadius;

      const scatteredY = Math.sin(scatterAngle) * scatterRadius;

      const scatteredZ = Math.sin(index * 1.8) * 2.1;

      const explosionX = Math.cos(scatterAngle) * 4.5;

      const explosionY = Math.sin(scatterAngle) * 3.0;

      const explosionZ = Math.cos(index * 1.7) * 3.0;

      const baseX = THREE.MathUtils.lerp(scatteredX, beam.x, assembleEase);

      const baseY = THREE.MathUtils.lerp(scatteredY, beam.y, assembleEase);

      const baseZ = THREE.MathUtils.lerp(scatteredZ, 0, assembleEase);

      fragment.position.set(
        baseX + explosionX * dispersion.current,
        baseY + explosionY * dispersion.current,
        baseZ + explosionZ * dispersion.current,
      );

      const initialRotation = (1 - assembleEase) * (index % 2 ? 2.4 : -2.4);

      fragment.rotation.set(
        initialRotation + dispersion.current * 1.8,
        initialRotation + dispersion.current * 2.3,
        dispersion.current * 1.6,
      );
    });

    if (root.current) {
      const targetX = reducedMotion ? 0 : -pointer.current.y * 0.22;

      const targetY = reducedMotion ? 0 : pointer.current.x * 0.42;

      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        targetX,
        3,
        step,
      );

      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        targetY,
        3,
        step,
      );

      root.current.position.y = reducedMotion
        ? 0
        : Math.sin(time * 0.6) * 0.055;
    }

    if (energyRing.current) {
      energyRing.current.rotation.z = reducedMotion
        ? -0.18
        : time * 0.08 - 0.18;

      energyRing.current.scale.setScalar(1 + dispersion.current * 0.8);
    }

    if (shardsRoot.current) {
      shardsRoot.current.rotation.z = reducedMotion ? 0 : time * 0.025;
    }

    const targetCameraZ = activated ? 5.1 : 7.6;

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetCameraZ,
      2.1,
      step,
    );

    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <ambientLight intensity={0.75} color="#CDCBCA" />

      <directionalLight position={[-3, 5, 5]} intensity={3} color="#ffffff" />

      <pointLight
        position={[2.6, -0.4, 3]}
        intensity={22}
        distance={9}
        color="#D41514"
      />

      <pointLight
        position={[-2.8, 0.5, -1.5]}
        intensity={9}
        distance={8}
        color="#a3a0a0"
      />

      <group ref={root}>
        {BEAMS.map((beam, index) => (
          <group
            key={index}
            ref={(element) => {
              fragments.current[index] = element;
            }}
            position={[beam.x, beam.y, 0]}
          >
            <mesh>
              <boxGeometry args={[beam.width, beam.height, 0.3]} />

              <meshStandardMaterial
                color="#b5b2b0"
                metalness={0.88}
                roughness={0.22}
              />
            </mesh>

            <mesh position={[0, 0, 0.157]}>
              <boxGeometry
                args={[beam.width * 0.87, beam.height * 0.72, 0.009]}
              />

              <meshStandardMaterial
                color="#1c1b1b"
                metalness={0.85}
                roughness={0.35}
              />
            </mesh>

            {index % 3 === 0 && (
              <mesh position={[0, 0, 0.168]}>
                <boxGeometry
                  args={[
                    beam.width > beam.height ? beam.width * 0.64 : 0.025,
                    beam.height > beam.width ? beam.height * 0.64 : 0.025,
                    0.012,
                  ]}
                />

                <meshStandardMaterial
                  color="#D41514"
                  emissive="#D41514"
                  emissiveIntensity={1.5}
                  toneMapped={false}
                />
              </mesh>
            )}
          </group>
        ))}

        <mesh ref={energyRing} rotation={[1.1, 0.22, -0.18]}>
          <torusGeometry args={[2.15, 0.012, 6, 96]} />

          <meshBasicMaterial
            color="#D41514"
            transparent
            opacity={0.62}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[0.8, -0.3, 0.12]}>
          <torusGeometry args={[2.48, 0.006, 5, 96]} />

          <meshBasicMaterial
            color="#CDCBCA"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={shardsRoot}>
        {SHARDS.map((shard, index) => (
          <mesh
            key={index}
            position={[shard.x, shard.y, shard.z]}
            rotation={[index * 0.7, index * 0.4, index * 0.3]}
            scale={shard.scale}
          >
            <octahedronGeometry args={[1, 0]} />

            <meshStandardMaterial
              color={index % 4 === 0 ? "#D41514" : "#858080"}
              emissive={index % 4 === 0 ? "#D41514" : "#080808"}
              emissiveIntensity={0.65}
              metalness={0.75}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function EmblemScene({
  pointer,
  activated,
  reducedMotion,
  visible,
}: SceneProps) {
  const camera = useMemo(
    () => ({
      position: [0, 0, 7.6] as [number, number, number],
      fov: 39,
      near: 0.1,
      far: 100,
    }),
    [],
  );

  return (
    <Canvas
      aria-label="Interactive metallic SB sculpture"
      camera={camera}
      dpr={[1, 1.5]}
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      fallback={<div className="hero-webgl-fallback">SB</div>}
    >
      <Emblem
        pointer={pointer}
        activated={activated}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
