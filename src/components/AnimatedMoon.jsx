import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Component to handle the moon with color animation
export const AnimatedMoon = ({ position, rotation, scale, img }) => {
    const meshRef = useRef();
    const materialRef = useRef();

    // Create refs for the texture loaders with updated blobby versions
    const colorMapRef = useRef(
        new THREE.TextureLoader().load(img.color, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
        })
    );

    const normalMapRef = useRef(
        new THREE.TextureLoader().load(img.normal, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
        })
    );

    const displacementMapRef = useRef(new THREE.TextureLoader().load(img.height));

    useFrame((state) => {
        if (materialRef.current) {
            // Oscillate between purple (270) and blue (240) hues
            const time = state.clock.getElapsedTime();
            // const hue = 200 + Math.sin(time * 0.2) * 1; // Oscillate between ~225 and ~255
            const hue = 150;
            materialRef.current.color = new THREE.Color(`hsl(${hue}, 70%, 80%)`);
        }
    });

    return (
        <mesh
            ref={meshRef}
            name="moon"
            position={position}
            rotation={rotation}
            scale={scale}
        >
            <planeGeometry args={[50, 50, 64, 64]} />
            <meshPhysicalMaterial
                ref={materialRef}
                roughness={0.8}
                metalness={0.2}
                map={colorMapRef.current}
                normalMap={normalMapRef.current}
                displacementMap={displacementMapRef.current}
                displacementScale={2}
                displacementBias={0}
            />
        </mesh>
    );
}; 