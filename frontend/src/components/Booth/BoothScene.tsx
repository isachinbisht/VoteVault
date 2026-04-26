import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Text, MeshDistortMaterial, ContactShadows } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function EVMModel({ active, color, hovered }: { active: boolean; color: string; hovered: boolean }) {
    return (
        <group scale={[0.6, 0.6, 0.6]}>
            {/* Main Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.2, 1.8, 0.3]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.1} />
            </mesh>
            {/* Darker Inner Panel */}
            <mesh position={[0.1, 0, 0.16]}>
                <boxGeometry args={[0.8, 1.6, 0.05]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Buttons & Lights */}
            {Array.from({ length: 8 }).map((_, i) => (
                <group key={i} position={[0.1, 0.65 - i * 0.18, 0.19]}>
                    {/* Blue Button */}
                    <mesh position={[0.2, 0, 0]}>
                        <boxGeometry args={[0.15, 0.1, 0.05]} />
                        <meshStandardMaterial color="#3b82f6" />
                    </mesh>
                    {/* Red Light */}
                    <mesh position={[0.35, 0, 0]}>
                        <sphereGeometry args={[0.03]} />
                        <meshStandardMaterial color={active && hovered ? '#ef4444' : '#450a0a'} emissive={active && hovered ? '#ef4444' : '#000'} emissiveIntensity={2} />
                    </mesh>
                    {/* White label area */}
                    <mesh position={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.4, 0.12, 0.02]} />
                        <meshStandardMaterial color="#f8fafc" />
                    </mesh>
                </group>
            ))}
            {/* Top Green Ready Light */}
            <mesh position={[-0.3, 0.8, 0.16]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color={active ? '#22c55e' : '#064e3b'} emissive={active ? '#22c55e' : '#000'} emissiveIntensity={2} />
            </mesh>
            {/* Outer Glow if active */}
            {active && (
                <mesh position={[0, 0, -0.05]}>
                    <boxGeometry args={[1.35, 1.95, 0.3]} />
                    <meshBasicMaterial color={color} transparent opacity={hovered ? 0.3 : 0.15} blending={THREE.AdditiveBlending} />
                </mesh>
            )}
        </group>
    );
}

function Station({ position, color, label, active, onClick, type = 'default' }: {
    position: [number, number, number];
    color: string;
    label: string;
    active: boolean;
    onClick: () => void;
    type?: 'default' | 'evm';
}) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (groupRef.current && active) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.12;
        }
    });

    return (
        <group position={position}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
                <group
                    ref={groupRef}
                    onClick={onClick}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    {type === 'evm' ? (
                        <EVMModel active={active} color={color} hovered={hovered} />
                    ) : (
                        <mesh>
                            <octahedronGeometry args={[0.55, 0]} />
                            <MeshDistortMaterial
                                color={active ? color : '#555'}
                                speed={active ? 2 : 0}
                                distort={active ? 0.35 : 0}
                                emissive={active ? color : '#111'}
                                emissiveIntensity={active ? (hovered ? 2.5 : 1.2) : 0}
                                metalness={0.4}
                                roughness={0.2}
                            />
                        </mesh>
                    )}
                </group>
            </Float>
            <Text
                position={[0, -0.95, 0]}
                fontSize={0.22}
                color={active ? color : '#aaa'}
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
            >
                {label}
            </Text>
            {active && (
                <>
                    <pointLight position={[0, 0.8, 0]} color={color} intensity={2} distance={4} />
                    {/* Glow ring on floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.98, 0]}>
                        <ringGeometry args={[0.6, 0.9, 32]} />
                        <meshBasicMaterial color={color} transparent opacity={0.25} />
                    </mesh>
                </>
            )}
        </group>
    );
}

interface OrbitControlsImpl {
    target: THREE.Vector3;
    update: () => void;
}

function CameraController({ currentStep, controlsRef }: { currentStep: string, controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree();

    useFrame((_, delta) => {
        const t = 1.0 - Math.pow(0.01, delta); // Frame-rate independent lerp factor

        const targetPos = new THREE.Vector3(0, 2.5, 9);
        const targetLookAt = new THREE.Vector3(0, 0.5, 0);

        if (currentStep === 'id_check') {
            targetPos.set(-3.5, 1.5, 4);
            targetLookAt.set(-3.5, 0.5, 0);
        } else if (currentStep === 'evm') {
            targetPos.set(0, 1.5, 4);
            targetLookAt.set(0, 0.5, 0);
        } else if (currentStep === 'complete') {
            // Neutral wide view when complete
            targetPos.set(0, 2.5, 9);
            targetLookAt.set(0, 0.5, 0);
        }

        camera.position.lerp(targetPos, t * 4);
        if (controlsRef.current) {
            controlsRef.current.target.lerp(targetLookAt, t * 4);
            controlsRef.current.update();
        }
    });

    return null;
}

function Floor() {
    return (
        <>
            {/* Semi-transparent floor so booth image shows through */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#1a1008" metalness={0.1} roughness={0.9} transparent opacity={0.6} />
            </mesh>
            <ContactShadows opacity={0.5} scale={16} blur={2.5} far={4} position={[0, -1.01, 0]} />
        </>
    );
}

export default function BoothScene({ currentStep, onStationClick }: {
    currentStep: string;
    onStationClick: (step: string) => void;
}) {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const stepColors: Record<string, string> = {
        id_check: '#3b82f6',
        evm: '#ef4444',
        complete: '#10b981',
    };
    const activeColor = stepColors[currentStep] || '#FF9933';

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* ── Real polling station photo background ── */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/voting-booth.png')" }}
            />
            {/* Depth overlay — darkens edges, keeps centre visible */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.72) 100%)',
                }}
            />
            {/* Subtle color tint matching active station */}
            <div
                className="absolute inset-0 transition-colors duration-1000 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 100%, ${activeColor}22 0%, transparent 70%)` }}
            />

            {/* ── Three.js overlay with holographic stations ── */}
            <div className="absolute inset-0">
                <Canvas shadows gl={{ alpha: true }} style={{ background: 'transparent' }}>
                    <PerspectiveCamera makeDefault position={[0, 2.5, 9]} fov={48} />
                    <OrbitControls
                        ref={controlsRef}
                        enablePan={false}
                        minPolarAngle={Math.PI / 5}
                        maxPolarAngle={Math.PI / 2.2}
                        minDistance={6}
                        maxDistance={13}
                        enableZoom={false}
                    />

                    <CameraController currentStep={currentStep} controlsRef={controlsRef} />

                    {/* Lighting */}
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
                    <pointLight position={[-5, 3, 3]} intensity={0.4} color="#ffd580" />

                    <Floor />

                    {/* ID Verification */}
                    <Station
                        position={[-3.5, 0.5, 0]}
                        color="#3b82f6"
                        label="① ID Verification"
                        active={currentStep === 'id_check'}
                        onClick={() => currentStep === 'id_check' && onStationClick('id_check')}
                    />

                    {/* EVM Machine */}
                    <Station
                        position={[0, 0.5, 0]}
                        color="#ef4444"
                        label="② EVM Machine"
                        active={currentStep === 'evm'}
                        onClick={() => currentStep === 'evm' && onStationClick('evm')}
                        type="evm"
                    />

                    {/* Submission */}
                    <Station
                        position={[3.5, 0.5, 0]}
                        color="#10b981"
                        label="③ Vote Submitted"
                        active={currentStep === 'complete'}
                        onClick={() => currentStep === 'complete' && onStationClick('complete')}
                    />
                </Canvas>
            </div>

            {/* ── Step label at top ── */}
            {currentStep !== 'intro' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <div
                        className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase backdrop-blur-md border text-white"
                        style={{
                            background: `${activeColor}20`,
                            borderColor: `${activeColor}50`,
                            color: activeColor,
                            boxShadow: `0 0 20px ${activeColor}30`,
                        }}
                    >
                        {currentStep === 'id_check' && '🪪 Station 1 — Identity Check'}
                        {currentStep === 'evm' && '🗳️ Station 2 — Cast Your Vote'}
                        {currentStep === 'complete' && '✅ Station 3 — Vote Recorded'}
                    </div>
                </div>
            )}
        </div>
    );
}
