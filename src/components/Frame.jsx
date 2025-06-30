import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import { useRoute } from "wouter";
import { easing } from "maath";
import getUuid from "uuid-by-string";

export function Frame({ url, c = new THREE.Color(), ...props }) {
    const texture = useTexture(url);
    const image = useRef();
    const frame = useRef();
    const linkRef = useRef();
    const [, params] = useRoute("/item/:id");
    const [hovered, hover] = useState(false);
    const [rnd] = useState(() => Math.random());
    const name = getUuid(url);
    const isActive = params?.id === name;
    useCursor(hovered);
    useFrame((state, dt) => {
        if (image.current) {
            image.current.material.zoom =
                2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
            easing.damp3(
                image.current.scale,
                [
                    0.85 * (!isActive && hovered ? 0.85 : 1),
                    0.9 * (!isActive && hovered ? 0.905 : 1),
                    1,
                ],
                0.1,
                dt
            );
        }
        easing.dampC(
            frame.current.material.color,
            hovered ? "#E1E1E1" : "white",
            0.1,
            dt
        );
    });
    const handleLinkClick = (e) => {
        e.stopPropagation();
        // Your click handling logic here
        console.log(`Link clicked for image: ${props.slug}`);
        window.open(`/project/${props.slug}`, "_blank");
    };

    return (
        <group {...props}>
            <mesh
                name={name}
                onPointerOver={(e) => (e.stopPropagation(), hover(true))}
                onPointerOut={() => hover(false)}
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
                    ref={frame}
                    raycast={() => null}
                    scale={[0.9, 0.93, 0.9]}
                    position={[0, 0, 0.2]}
                >
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <mesh
                    ref={image}
                    position={[0, 0, 0.7]}
                    scale={[0.9, 0.93, 0.9]}
                    onClick={(e) => e.stopPropagation()}
                >
                    <planeGeometry />
                    <meshBasicMaterial map={texture} toneMapped={false} />
                </mesh>
            </mesh>
        </group>
    );
} 