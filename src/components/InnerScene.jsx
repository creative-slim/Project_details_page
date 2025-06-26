import { useRef, Suspense } from "react";
import { Float, ContactShadows, Svg } from "@react-three/drei";
import AnimatedStars from "../AnimatedStars";
import Frames from "../Frames";
import { AnimatedMoon } from "./AnimatedMoon";
import FlatSVG from "./FlatSVG";

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
        <Suspense fallback={null}>
            <group name="innerScene">
                <AnimatedStars />
                <ambientLight intensity={1} />
                <pointLight
                    position={[0, 3, 3]}
                    intensity={5}
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
                            {typeof svgUrl === 'string' && svgUrl.length > 0 && (
                                <FlatSVG url={svgUrl} size={2} position={[0, 0, 0]} flipY={false} envMapIntensity={0.5} />
                            )}

                            {/* <ExtrudedSVG
                            url={"/test-donut-compound.svg"}
                            targetHeight={1.5}
                            depth={1000}
                            position={[0, 0, 0]}
                        /> */}
                            {/* <FlatSVG url={"/optimized-circle-logo.svg"} scale={0.008} flipY={false} position={[0, -3, 0]} /> */}
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
        </Suspense>
    );
}; 