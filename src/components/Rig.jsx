import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Vector2 } from "three";

export function Rig({ children }) {
    const ref = useRef();
    const vec = new Vector3();
    const { camera } = useThree();
    const mouse = new Vector2();
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 2, 1, 7), 0.01);
        ref.current.position.lerp(vec.set(mouse.x * 0.1, mouse.y * 0.1, 0), 0.1);

        camera.lookAt(ref.current.position);
        // ref.current.rotation.y = MathUtils.lerp(
        //   ref.current.rotation.y,
        //   (mouse.x * Math.PI) / 10,
        //   0.1
        // );
    });
    return <group ref={ref}>{children}</group>;
} 