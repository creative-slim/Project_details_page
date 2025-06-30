import React, { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as THREE from "three";

const FlatSVG = ({ url, size = 1, flipY = true, envMapIntensity = 1, ...props }) => {
    const svgData = useLoader(SVGLoader, url);
    const groupRef = useRef();

    // Calculate bounding box, normalization factor, and center offset
    const { shapes, bboxCenter, normalizationFactor, bboxWidth, bboxHeight } = useMemo(() => {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        const allShapes = svgData.paths.flatMap(path => path.toShapes(false));
        allShapes.forEach(shape => {
            const points = shape.getPoints();
            points.forEach(p => {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
            });
        });
        const width = maxX - minX;
        const height = maxY - minY;
        const normalizationFactor = size / Math.max(width, height);
        // Bounding box center
        const bboxCenter = [
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            0
        ];
        // For wireframe
        const bboxWidth = width;
        const bboxHeight = height;
        return { shapes: allShapes, bboxCenter, normalizationFactor, bboxWidth, bboxHeight };
    }, [svgData, size]);

    return (
        <group
            ref={groupRef}
            scale={[normalizationFactor, flipY ? -normalizationFactor : normalizationFactor, normalizationFactor]}
            {...props}
        >
            {shapes.map((shape, j) => (
                <mesh key={j} position={[-bboxCenter[0], -bboxCenter[1], 0]}>
                    <shapeGeometry args={[shape]} />
                    <meshPhysicalMaterial
                        color="#FFFFFF"
                        side={THREE.DoubleSide}
                        metalness={0.1}
                        roughness={0.1}
                        reflectivity={0.5}
                        envMapIntensity={1}
                    />
                </mesh>
            ))}
        </group>
    );
};

export default FlatSVG; 