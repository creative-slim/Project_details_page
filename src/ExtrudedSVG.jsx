import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

// Add depth prop with a default value
const ExtrudedSVG = ({ url, targetHeight, depth = 20, ...props }) => {
  const svgData = useLoader(SVGLoader, url);
  const groupRef = useRef();

  //   const glowBlue = new THREE.MeshBasicMaterial({
  //     color: new THREE.Color(0, 0.5, 10),
  //     toneMapped: false,
  //   });

  // Keep centerOffsetY and add centerOffsetX from the calculation
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
          minX = Math.min(minX, p.x); // Calculate minX
          maxX = Math.max(maxX, p.x); // Calculate maxX
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
    // const originalWidth = maxX - minX; // Width calculation if needed

    let calculatedScale = 1;
    if (targetHeight && originalHeight > 0) {
      calculatedScale = targetHeight / originalHeight;
    }

    // Calculate the horizontal offset needed to center the original SVG
    const calculatedCenterOffsetX = -(minX + maxX) / 2;
    // Calculate the vertical offset needed to center the original SVG
    const calculatedCenterOffsetY = -(minY + maxY) / 2;

    // Return center offsets along with shapes and scale
    return {
      shapes: processedShapes,
      scale: calculatedScale,
      centerOffsetX: calculatedCenterOffsetX, // Return offsetX
      centerOffsetY: calculatedCenterOffsetY,
    };
  }, [svgData, targetHeight]);

  const extrudeSettings = useMemo(
    () => ({
      steps: 2,
      // Use the depth prop, scaled appropriately
      depth: depth * scale,
      bevelEnabled: true,
      // Scale bevel settings too
      bevelThickness: 2 * scale,
      bevelSize: 1 * scale,
      bevelOffset: 0,
      bevelSegments: 5,
    }),
    [scale, depth] // Add depth to dependencies
  );

  // Calculate position-x using the overall centerOffsetX and scale
  const positionX = centerOffsetX * scale;
  // Calculate position-y using the overall centerOffsetY and scale
  const positionY = centerOffsetY * scale;
  // Calculate position-z to center the depth
  const positionZ = -(depth * scale) / 2; // Shift forward by half the scaled depth

  return (
    // Apply the calculated scale and position, remove rotation-x
    <group
      ref={groupRef}
      {...props}
      scale={scale}
      position-x={positionX}
      position-y={positionY}
      position-z={positionZ} // Apply Z centering
    >
      {shapes.map(({ shape, color }, index) => (
        <mesh key={index}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshPhysicalMaterial
            color={color || "#ffffff"}
            side={THREE.DoubleSide}
            metalness={0.5} // Example material adjustment
            roughness={0.5} // Example material adjustment
          />
        </mesh>
      ))}
    </group>
  );
};

export default ExtrudedSVG;
