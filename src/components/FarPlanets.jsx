import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const FarPlanets = ({ img }) => {
    // Load the texture
    const texture = useTexture(img.moonTexture);
    const meshRef = useRef();
    const time = useRef(0);

    useFrame((state, delta) => {
        if (meshRef.current) {
            let speedMultiplier = 0.5;
            if (meshRef.current.position.y <= -15) {
                speedMultiplier = 4;
            }
            time.current += delta * speedMultiplier;

            // Create oval movement
            // x: 50 + larger oscillation (long part of oval)
            // y: 30 + small oscillation (short part of oval)
            // z: -200 (fixed)
            meshRef.current.position.x = 0 + Math.cos(time.current * 0.2) * 150; // Larger horizontal movement
            meshRef.current.position.y = -35 + Math.sin(time.current * 0.2) * 80; // Small vertical movement
            meshRef.current.position.z = -200;
        }
    });

    return (
        <group>
            <mesh ref={meshRef} position={[50, 30, -200]}>
                <sphereGeometry args={[10, 32, 32]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </group>
    );
};

const MemoFarPlanets = memo(FarPlanets);
export { FarPlanets };
export default MemoFarPlanets; 