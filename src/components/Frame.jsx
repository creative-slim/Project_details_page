import * as THREE from "three";
import { useTexture } from "@react-three/drei";


export function Frame({ url, c = new THREE.Color(), ...props }) {
    const texture = useTexture(url);

    return (
        <group {...props}>
            <mesh

                scale={[1, 1.61803398875, 0.05]}
                position={[0, 1.61803398875 / 2, 0]}
            >
                <boxGeometry />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={1}
                    roughness={0.2}
                    envMapIntensity={2}
                />
                <mesh
                    scale={[0.9, 0.93, 0.9]}
                    position={[0, 0, 0.2]}
                >
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <mesh
                    position={[0, 0, 0.7]}
                    scale={[0.9, 0.93, 0.9]}
                >
                    <planeGeometry />
                    <meshBasicMaterial map={texture} toneMapped={false} />
                </mesh>
            </mesh>
        </group>
    );
} 