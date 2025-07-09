
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Frame } from "./components/Frame";

export default function Frames({
  images,

}) {
  const pointLightRef = useRef();

  // useFrame for animations (including FOV)
  useFrame((state, dt) => {

    // pointLight animation
    if (pointLightRef.current) {
      // make the pointLIght rotate
      const t = state.clock.elapsedTime;
      pointLightRef.current.position.x = Math.cos(t) * 4;
      pointLightRef.current.position.z = Math.sin(t) * 2;
      // pointLightRef.current.position.y = Math.sin(t);
    }

  });


  return (
    <group
    >
      <spotLight
        position={[0, 2, 3]}
        angle={0.4}
        penumbra={0.5}
        intensity={15}
        color={0xffffff}
      />
      <pointLight ref={pointLightRef} position={[0, 1, 0]} intensity={5} />
      {images.map(
        (props) => <Frame key={props.url} {...props} /> /* prettier-ignore */
      )}
    </group>
  );
}
