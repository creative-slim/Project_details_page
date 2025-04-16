/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 ./public/models/projekte-2.glb --transform 
Files: ./public/models/projekte-2.glb [105.18KB] > /Users/slim-cd/Documents/_Projects/__Creative Directors Website/website 2025/Projects_page/projekte-2-transformed.glb [10.63KB] (90%)
*/

import React, { useEffect } from "react";
import { ContactShadows, useGLTF, useHelper } from "@react-three/drei";
import { Color, MeshBasicMaterial, ShaderMaterial } from "three";
import {
  useCursor,
  Outlines,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Bounds,
  Environment,
} from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function ProjectPlane(props) {
  const textObj = useRef();

  const glowBlue = new MeshBasicMaterial({
    color: new Color(1.5, 1.4, 1.3), // Exaggerated #F4E7D7
    // color: new Color("#F4E7D7"), // Exaggerated #F4E7D7
    toneMapped: false,
  });

  const { nodes, materials } = useGLTF("/models/projekte-2-transformed.glb");

  return (
    <group {...props} dispose={null}>
      <mesh
        name="Text"
        ref={textObj}
        geometry={nodes.Text.geometry}
        material={glowBlue}
        position={[3.725, -0.9, 0]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[2.444, 2.444, 2.444]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload("/models/projekte-2-transformed.glb");
