import * as THREE from "three";
// Make sure useRef is imported from react
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
  OrbitControls,
  Html,
  Resize,
  ContactShadows,
  MeshPortalMaterial,
  Stars,
  Center,
  Billboard,
  Bounds,
  Float, // Import Bounds
  useHelper, // Import useHelper
} from "@react-three/drei";
// Import BoxHelper from three
import { BoxHelper } from "three";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { useRoute, useLocation } from "wouter";
import getUuid from "uuid-by-string";

import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { Kreaton } from "./Kreaton_A";
import { Armchair } from "./Armchair";
import { ProjectPlane } from "./Projekte-2";
import Frames from "./Frames";
import ExtrudedSVG from "./ExtrudedSVG"; // Import the new component

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heading } from "./Site-headings";

import getApiData from "./images";

gsap.registerPlugin(ScrollTrigger);

const GOLDENRATIO = 1.61803398875;
const INITIAL_FOV = 50; // Define initial FOV

// --- Camera Configuration ---
const section1Position = new THREE.Vector3(0, 8, 5);
const section2Position = new THREE.Vector3(0, 0.8, 7.5);
const section2LookAtTarget = new THREE.Vector3(0, 0, -5);
// --- End Camera Configuration ---

// Determine the model URL based on the environment
const isDevelopment = import.meta.env.DEV;
const localimages = {
  color: "/terrain_color_4x_blobby.jpg",
  normal: "/terrain_normal_4x_blobby.jpg",
  height: "/terrain_height_4x_blobby.jpg",
};
const remoteImages = {
  color:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_color_4x_blobby.jpg",
  normal:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_normal_4x_blobby.jpg",
  height:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_height_4x_blobby.jpg",
};
const img = isDevelopment ? localimages : remoteImages;

console.log(`Loading model from: ${img}`); // Log which URL is being used

const App = ({}) => {
  const innerSceneRef = useRef();
  const projectTextRef = useRef();
  const headingRef = useRef(); // Create ref for Heading

  // use getApiData to fetch images
  const [images, setImages] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {
      const data = await getApiData();
      setImages(data);
    };
    fetchImages();
  }, []);
  console.log("Images:", images);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{ fov: INITIAL_FOV, position: [0, 0.8, 7.5] }} // Use INITIAL_FOV directly
        flat
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 0, 20]} />

        <InnerScene
          images={images}
          ref={innerSceneRef}
          // Pass down section 2 camera targets
          section2Position={section2Position}
          section2LookAtTarget={section2LookAtTarget}
          // Pass down FOV related props
          initialFov={INITIAL_FOV}
        />
        {/* <Environment preset="city" /> */}
        <OrbitControls />
        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Bloom mipmapBlur luminanceThreshold={1} intensity={1} />
        </EffectComposer>
        {/* </Resize> */}
      </Canvas>
    </>
  );
};

// Component to handle the moon with color animation
const AnimatedMoon = ({ position, rotation, scale }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  // Create refs for the texture loaders with updated blobby versions
  const colorMapRef = useRef(
    new THREE.TextureLoader().load(img.color, (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    })
  );

  const normalMapRef = useRef(
    new THREE.TextureLoader().load(img.normal, (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    })
  );

  const displacementMapRef = useRef(new THREE.TextureLoader().load(img.height));

  useFrame((state) => {
    if (materialRef.current) {
      // Oscillate between purple (270) and blue (240) hues
      const time = state.clock.getElapsedTime();
      const hue = 230 + Math.sin(time * 0.2) * 25; // Oscillate between ~225 and ~255
      materialRef.current.color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);
    }
  });

  return (
    <mesh
      ref={meshRef}
      name="moon"
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[50, 50, 64, 64]} />
      <meshPhysicalMaterial
        ref={materialRef}
        roughness={0.8}
        metalness={0.2}
        map={colorMapRef.current}
        normalMap={normalMapRef.current}
        displacementMap={displacementMapRef.current}
        displacementScale={2}
        displacementBias={0}
      />
    </mesh>
  );
};

// Pass props down to Frames
const InnerScene = ({
  images,
  setIsZoomed,
  section2Position,
  section2LookAtTarget,
  initialFov, // Receive initialFov
}) => {
  // SVG URL - Using the direct link to the SVG file
  const svgUrl =
    // "https://cdn.prod.website-files.com/678907d8717d9b914d9d4b48/67c04ac5baaf44a1bd8eb8e9_Jadestein.svg";
    "https://cdn.prod.website-files.com/678907d8717d9b914d9d4b48/67c04ac5765ce10bca8db9d0_LafeeDor.svg";

  // Create a ref for the group containing the SVG
  const svgGroupRef = useRef();

  // Use the useHelper hook to attach a BoxHelper
  // The helper will be attached to whatever svgGroupRef points to
  // useHelper(svgGroupRef, BoxHelper, "cyan"); // Use 'cyan' color for the wireframe

  return (
    <group name="innerScene">
      <Stars />
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
        {/* Pass props to Frames */}
        <Frames
          images={images}
          setIsZoomed={setIsZoomed}
          section2Position={section2Position}
          section2LookAtTarget={section2LookAtTarget}
          initialFov={initialFov} // Pass initialFov down
        />
        <AnimatedMoon
          position={[1, -0.74, -3]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 3]}
          scale={0.7}
        />

        <Float
          speed={1}
          rotationIntensity={0.5}
          floatIntensity={0.5}
          position={[0, 1, 0]} // Adjust Y value here (e.g., 1)
        >
          {/* Wrap ExtrudedSVG in a group and assign the ref */}
          <group
            ref={svgGroupRef}
            rotation={[Math.PI, 0, 0]}
            position={[0, 0, 0]}
          >
            <ExtrudedSVG
              url={svgUrl}
              targetHeight={1.5}
              depth={20}
              // scale={0.005} // Adjust scale to fit your needs
              position={[0, 0, 0]} // Position inside Float is relative to Float's origin
              // rotation={[Math.PI, 0, 0]} // Rotate to face the camera
              // Note: Rotation is in radians
              // Position inside Float is relative to Float's origin
            />
          </group>
        </Float>
      </group>
      <ContactShadows
        frames={1}
        opacity={1}
        scale={10}
        blur={1}
        far={10}
        position={[0, -0.6, 0]}
        resolution={256}
        color="#000000"
      />
    </group>
  );
};

export default App;
