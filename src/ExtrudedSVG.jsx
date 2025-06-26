import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

const ExtrudedSVG = ({ url, targetHeight, depth = 1, ...props }) => {
  const svgData = useLoader(SVGLoader, url);
  const groupRef = useRef();

  const { shapes, scale, centerOffsetX, centerOffsetY } = useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const processedShapes = svgData.paths.flatMap((path) => {
      const shapes = path.toShapes(true);
      shapes.forEach((shape) => {
        const points = shape.getPoints();
        points.forEach((p) => {
          minX = Math.min(minX, p.x);
          maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        });
      });
      return shapes.map((shape) => ({
        shape,
        color: path.userData.style.fill,
      }));
    });

    const originalHeight = maxY - minY;
    let calculatedScale = 1;
    if (targetHeight && originalHeight > 0) {
      calculatedScale = targetHeight / originalHeight;
    }

    const calculatedCenterOffsetX = -(minX + maxX) / 2;
    const calculatedCenterOffsetY = -(minY + maxY) / 2;

    return {
      shapes: processedShapes,
      scale: calculatedScale,
      centerOffsetX: calculatedCenterOffsetX,
      centerOffsetY: calculatedCenterOffsetY,
    };
  }, [svgData, targetHeight]);

  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth: depth * scale,
      bevelEnabled: false,
    }),
    [scale, depth]
  );

  const positionX = centerOffsetX * scale;
  const positionY = centerOffsetY * scale;
  const positionZ = -(depth * scale) / 2;

  return (
    <group
      ref={groupRef}
      {...props}
      scale={scale}
      position-x={positionX}
      position-y={positionY}
      position-z={positionZ}
    >
      {shapes.map(({ shape, color }, index) => (
        <mesh key={index}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshBasicMaterial
            color={color || "#ffffff"}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ExtrudedSVG;
