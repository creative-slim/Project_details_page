import { useRef } from "react";
import { Float, ContactShadows } from "@react-three/drei";
import AnimatedStars from "../AnimatedStars";
import Frames from "../Frames";
import ExtrudedSVG from "../ExtrudedSVG";
import { AnimatedMoon } from "./AnimatedMoon";

export const InnerScene = ({
    images,
    svgUrl,
    setIsZoomed,
    section2Position,
    section2LookAtTarget,
    initialFov,
    img,
}) => {
    const svgGroupRef = useRef();

    return (
        <group name="innerScene">
            <AnimatedStars />
            <ambientLight intensity={1} />
            <pointLight
                position={[0, 3, 3]}
                intensity={50}
                color={"#ffffff"}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
                shadow-camera-top={10}
                shadow-camera-right={10}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}
                shadow-radius={100}
                shadow-bias={-0.0001}
            />

            <group position={[0, -0.5, 0]}>
                <Frames
                    images={images}
                    setIsZoomed={setIsZoomed}
                    section2Position={section2Position}
                    section2LookAtTarget={section2LookAtTarget}
                    initialFov={initialFov}
                />
                <AnimatedMoon
                    position={[1, -0.74, -3]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 3]}
                    scale={0.7}
                    img={img}
                />

                <Float
                    speed={1}
                    rotationIntensity={0.5}
                    floatIntensity={0.5}
                    position={[0, 1, 0]}
                >
                    <group
                        ref={svgGroupRef}
                        rotation={[Math.PI, 0, 0]}
                        position={[0, 0, 0]}
                    >
                        {svgUrl && (
                            <ExtrudedSVG
                                url={svgUrl}
                                targetHeight={1.5}
                                depth={20}
                                position={[0, 0, 0]}
                            />
                        )}
                    </group>
                </Float>
            </group>
            <ContactShadows
                frames={1}
                opacity={1}
                scale={20}
                blur={0.5}
                far={10}
                position={[0, -1, 0]}
                resolution={256}
                color="#000000"
            />
        </group>
    );
}; 