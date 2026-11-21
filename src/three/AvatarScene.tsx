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

type FragmentSpec = {
  x: number;
  y: number;
  z: number;
  scale: number;
  color: string;
};

const FRAGMENTS: FragmentSpec[] = Array.from({ length: 22 }, (_, index) => {
  const angle = (index / 22) * Math.PI * 2;
  const radius = 2 + (index % 4) * 0.22;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * 1.35 + ((index % 5) - 2) * 0.16,
    z: Math.sin(index * 1.9) * 0.9,
    scale: 0.04 + (index % 3) * 0.018,
    color: index % 5 === 0 ? "#D41514" : "#847f7d",
  };
});

function AvatarBust({
  pointer,
  activated,
  reducedMotion,
}: Omit<SceneProps, "visible">) {
  const root = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const auraGroup = useRef<THREE.Group>(null);
  const fragments = useRef<(THREE.Mesh | null)[]>([]);
  const activation = useRef(0);

  const chestLight = useMemo(() => new THREE.Color("#D41514"), []);

  useFrame(({ clock, camera }, delta) => {
    const time = clock.getElapsedTime();
    const step = Math.min(delta, 0.05);

    activation.current = THREE.MathUtils.damp(
      activation.current,
      activated ? 1 : 0,
      2.4,
      step,
    );

    const idleFloat = reducedMotion ? 0 : Math.sin(time * 0.9) * 0.05;

    if (root.current) {
      const targetRotX = reducedMotion ? 0 : -pointer.current.y * 0.18;

      const targetRotY = reducedMotion ? 0 : pointer.current.x * 0.42;

      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        targetRotX,
        3.2,
        step,
      );

      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        targetRotY,
        3.2,
        step,
      );

      root.current.position.y = idleFloat;
      root.current.position.z = activation.current * -0.45;
    }

    if (headGroup.current) {
      const lookX = reducedMotion ? 0 : -pointer.current.y * 0.12;

      const lookY = reducedMotion ? 0 : pointer.current.x * 0.28;

      headGroup.current.rotation.x = THREE.MathUtils.damp(
        headGroup.current.rotation.x,
        lookX,
        4,
        step,
      );

      headGroup.current.rotation.y = THREE.MathUtils.damp(
        headGroup.current.rotation.y,
        lookY,
        4,
        step,
      );

      headGroup.current.rotation.z = reducedMotion
        ? 0
        : Math.sin(time * 0.8) * 0.015;
    }

    if (ringGroup.current) {
      ringGroup.current.rotation.y = reducedMotion ? 0.35 : time * 0.2 + 0.35;

      ringGroup.current.rotation.z = reducedMotion ? 0 : time * 0.08;

      const ringScale = 1 + activation.current * 0.32;

      ringGroup.current.scale.set(ringScale, ringScale, ringScale);
    }

    if (auraGroup.current) {
      auraGroup.current.rotation.z = reducedMotion ? 0 : -time * 0.06;

      const auraScale =
        1 + Math.sin(time * 1.4) * 0.02 + activation.current * 0.08;

      auraGroup.current.scale.set(auraScale, auraScale, auraScale);
    }

    fragments.current.forEach((fragment, index) => {
      if (!fragment) return;

      const base = FRAGMENTS[index];
      const spread = 1 + activation.current * 1.05;

      fragment.position.x =
        base.x * spread + Math.sin(time * 1.2 + index) * 0.04;

      fragment.position.y = base.y + Math.cos(time * 1.1 + index * 0.6) * 0.05;

      fragment.position.z =
        base.z * spread + activation.current * Math.sin(index * 0.7) * 1.2;

      fragment.rotation.x += step * 0.6;
      fragment.rotation.y += step * 0.4;
      fragment.rotation.z += step * 0.5;
    });

    const targetCameraZ = activated ? 5 : 6.9;
    const targetCameraY = activated ? 0.45 : 0.2;

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetCameraZ,
      2.3,
      step,
    );

    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetCameraY,
      2.3,
      step,
    );

    camera.lookAt(0, 0.55, 0);
  });

  return (
    <group>
      <ambientLight intensity={0.95} color="#d4d0ce" />

      <directionalLight
        position={[-3.5, 4.2, 4.5]}
        intensity={2.2}
        color="#ffffff"
      />

      <directionalLight position={[4, 2, 2]} intensity={0.9} color="#9c9794" />

      <pointLight
        position={[2.4, 0.2, 2.8]}
        intensity={24}
        distance={10}
        color="#D41514"
      />

      <pointLight
        position={[-2.6, 1, -2]}
        intensity={8}
        distance={9}
        color="#a09b98"
      />

      <group ref={root} position={[0, -0.25, 0]}>
        {/* Holographic aura */}
        <group ref={auraGroup} position={[0, 0.7, -0.7]}>
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[1.2, 1.28, 64]} />
            <meshBasicMaterial
              color="#D41514"
              transparent
              opacity={0.14}
              depthWrite={false}
            />
          </mesh>

          <mesh rotation={[0.4, 0.2, 0.3]}>
            <ringGeometry args={[1.55, 1.57, 64]} />
            <meshBasicMaterial
              color="#CDCBCA"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Orbit rings */}
        <group ref={ringGroup} position={[0, 0.8, 0]}>
          <mesh rotation={[1.05, 0.2, -0.15]}>
            <torusGeometry args={[1.65, 0.012, 8, 96]} />
            <meshBasicMaterial
              color="#D41514"
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>

          <mesh rotation={[0.48, 0.7, 0.35]}>
            <torusGeometry args={[2.04, 0.006, 8, 96]} />
            <meshBasicMaterial
              color="#b1acab"
              transparent
              opacity={0.28}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Floating fragments */}
        {FRAGMENTS.map((fragment, index) => (
          <mesh
            key={index}
            ref={(element) => {
              fragments.current[index] = element;
            }}
            position={[fragment.x, fragment.y, fragment.z]}
            rotation={[index * 0.4, index * 0.25, index * 0.35]}
            scale={fragment.scale}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={fragment.color}
              emissive={fragment.color === "#D41514" ? "#D41514" : "#080808"}
              emissiveIntensity={fragment.color === "#D41514" ? 0.8 : 0.15}
              metalness={0.72}
              roughness={0.34}
            />
          </mesh>
        ))}

        {/* Torso */}
        <group position={[0, -0.55, 0]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.9, 1.7, 0.78]} />
            <meshStandardMaterial
              color="#141414"
              metalness={0.84}
              roughness={0.28}
            />
          </mesh>

          <mesh position={[0, 0.18, 0.41]}>
            <boxGeometry args={[1.12, 0.92, 0.03]} />
            <meshStandardMaterial
              color="#2b2827"
              metalness={0.82}
              roughness={0.32}
            />
          </mesh>

          <mesh position={[0, 0.05, 0.43]}>
            <boxGeometry args={[0.22, 0.92, 0.04]} />
            <meshStandardMaterial
              color="#D41514"
              emissive={chestLight}
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>

          <mesh position={[-1.15, 0.42, 0.05]}>
            <boxGeometry args={[0.46, 0.62, 0.52]} />
            <meshStandardMaterial
              color="#1b1a1a"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[1.15, 0.42, 0.05]}>
            <boxGeometry args={[0.46, 0.62, 0.52]} />
            <meshStandardMaterial
              color="#1b1a1a"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[-1.42, -0.2, 0.04]}>
            <boxGeometry args={[0.35, 1.12, 0.4]} />
            <meshStandardMaterial
              color="#161616"
              metalness={0.78}
              roughness={0.35}
            />
          </mesh>

          <mesh position={[1.42, -0.2, 0.04]}>
            <boxGeometry args={[0.35, 1.12, 0.4]} />
            <meshStandardMaterial
              color="#161616"
              metalness={0.78}
              roughness={0.35}
            />
          </mesh>

          <mesh position={[0, 1.02, 0.12]}>
            <cylinderGeometry args={[0.22, 0.26, 0.35, 24]} />
            <meshStandardMaterial
              color="#57514e"
              metalness={0.7}
              roughness={0.45}
            />
          </mesh>

          <mesh position={[0, 0.9, 0.28]}>
            <boxGeometry args={[0.82, 0.12, 0.08]} />
            <meshStandardMaterial
              color="#D41514"
              emissive={chestLight}
              emissiveIntensity={0.9}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Head group */}
        <group ref={headGroup} position={[0, 1.15, 0.08]}>
          {/* Head */}
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.68, 48, 48]} />
            <meshStandardMaterial
              color="#c9c2bd"
              metalness={0.18}
              roughness={0.58}
            />
          </mesh>

          {/* Hair cap */}
          <mesh position={[0, 0.56, 0.03]}>
            <sphereGeometry
              args={[0.69, 40, 40, 0, Math.PI * 2, 0, Math.PI / 1.95]}
            />
            <meshStandardMaterial
              color="#0d0d0d"
              metalness={0.36}
              roughness={0.5}
            />
          </mesh>

          {/* Side hair accents */}
          <mesh position={[-0.48, 0.28, 0.1]}>
            <boxGeometry args={[0.12, 0.5, 0.16]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.34}
              roughness={0.48}
            />
          </mesh>

          <mesh position={[0.48, 0.28, 0.1]}>
            <boxGeometry args={[0.12, 0.5, 0.16]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.34}
              roughness={0.48}
            />
          </mesh>

          {/* Jaw / chin silhouette */}
          <mesh position={[0, -0.08, 0.08]}>
            <boxGeometry args={[0.72, 0.34, 0.46]} />
            <meshStandardMaterial
              color="#b6aea8"
              metalness={0.12}
              roughness={0.62}
            />
          </mesh>

          {/* Visor frame */}
          <mesh position={[0, 0.28, 0.52]}>
            <boxGeometry args={[0.95, 0.24, 0.08]} />
            <meshStandardMaterial
              color="#141414"
              metalness={0.88}
              roughness={0.25}
            />
          </mesh>

          {/* Crimson visor */}
          <mesh position={[0, 0.28, 0.57]}>
            <boxGeometry args={[0.78, 0.11, 0.04]} />
            <meshStandardMaterial
              color="#D41514"
              emissive={chestLight}
              emissiveIntensity={2.3}
              transparent
              opacity={0.95}
              toneMapped={false}
            />
          </mesh>

          {/* Nose plate */}
          <mesh position={[0, 0.08, 0.58]}>
            <boxGeometry args={[0.12, 0.18, 0.05]} />
            <meshStandardMaterial
              color="#958d88"
              metalness={0.14}
              roughness={0.64}
            />
          </mesh>

          {/* Mouth line */}
          <mesh position={[0, -0.14, 0.58]}>
            <boxGeometry args={[0.28, 0.03, 0.04]} />
            <meshStandardMaterial
              color="#6b6562"
              metalness={0.12}
              roughness={0.7}
            />
          </mesh>

          {/* Ear devices */}
          <mesh position={[-0.72, 0.24, 0.02]}>
            <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
            <meshStandardMaterial
              color="#2b2726"
              metalness={0.78}
              roughness={0.34}
            />
          </mesh>

          <mesh position={[0.72, 0.24, 0.02]}>
            <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
            <meshStandardMaterial
              color="#2b2726"
              metalness={0.78}
              roughness={0.34}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function AvatarScene({
  pointer,
  activated,
  reducedMotion,
  visible,
}: SceneProps) {
  const camera = useMemo(
    () => ({
      position: [0, 0.2, 6.9] as [number, number, number],
      fov: 36,
      near: 0.1,
      far: 100,
    }),
    [],
  );

  return (
    <Canvas
      camera={camera}
      dpr={[1, 1.5]}
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      fallback={<div className="hero-webgl-fallback">SK</div>}
    >
      <AvatarBust
        pointer={pointer}
        activated={activated}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
