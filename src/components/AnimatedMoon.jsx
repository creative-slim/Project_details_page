import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

// Component to handle the moon with color animation
export const AnimatedMoon = ({ position, rotation, scale, img }) => {
    const meshRef = useRef();
    const materialRef = useRef();

    // Memoize texture loading so it only happens once per prop change
    const colorMap = useMemo(() => {
        const texture = new THREE.TextureLoader().load(img.color, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(1, 1);
        });
        return texture;
    }, [img.color]);

    const normalMap = useMemo(() => {
        const texture = new THREE.TextureLoader().load(img.normal, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(1, 1);
        });
        return texture;
    }, [img.normal]);

    const displacementMap = useMemo(() => {
        return new THREE.TextureLoader().load(img.height);
    }, [img.height]);

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
                map={colorMap}
                normalMap={normalMap}
                displacementMap={displacementMap}
                displacementScale={2}
                displacementBias={0}
            />
        </mesh>
    );
}; 