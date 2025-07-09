import * as THREE from "three";
import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, OrbitControls, Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import getApiData from "./images.js";
import ErrorBoundary from "./ErrorBoundary";
import { Rig } from "./components/Rig.jsx";
import { InnerScene } from "./components/InnerScene.jsx";
import { FarPlanets } from "./components/FarPlanets.jsx";
import Env from "./Env.jsx";
import LoadingManager from "./components/LoadingManager.jsx";
// import LoadingScreen from "./components/LoadingScreen.jsx";
// import useLoadingState from "./utils/useLoadingState.js";

gsap.registerPlugin(ScrollTrigger);

const INITIAL_FOV = 50;

const section2Position = new THREE.Vector3(0, 0.8, 7.5);
const section2LookAtTarget = new THREE.Vector3(0, 0, -5);

const isDevelopment = import.meta.env.DEV;

const localimages = {
  color: "/terrain_color_4x_blobby.jpg",
  normal: "/terrain_normal_4x_blobby.jpg",
  height: "/terrain_height_4x_blobby.jpg",
  moonTexture: "/moonTextur_Small.jpeg",
};
const remoteImages = {
  color:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_color_4x_blobby.webp",
  normal:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_normal_4x_blobby.webp",
  height:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_height_4x_blobby.webp",
  moonTexture:
    "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/moonTextur_Small.jpeg",
};

const img = isDevelopment ? localimages : remoteImages;

console.log(`Loading model from: ${img}`);

const App = () => {
  const [images, setImages] = useState([]);
  const [svgUrl, setSvgUrl] = useState(null);
  const defaultSvgUrl = null;

  useEffect(() => {
    const fetchData = async () => {
      console.log("🌐 Fetching API data...");
      try {
        const data = await getApiData();
        if (data) {
          setImages(data.images || []);
          const finalSvgUrl = data.svgUrl || defaultSvgUrl;
          setSvgUrl(finalSvgUrl);
          console.log("✅ API data fetched successfully");
          console.log("📊 Images to load:", data.images?.length || 0);
          console.log("🎨 SVG URL:", data.svgUrl, "| Using:", finalSvgUrl);
        } else {
          setSvgUrl(defaultSvgUrl);
          console.log("⚠️ No data fetched, using default SVG URL:", defaultSvgUrl);
        }
      } catch (error) {
        console.error("❌ Failed to fetch API data:", error);
        setSvgUrl(defaultSvgUrl);
      }
    };
    fetchData();
  }, []);

  console.log("Images:", images);

  // Example: handle progress and completion
  const handleProgress = (progress, assets) => {
    // You can hook this up to your own UI or state
    console.log("[App] Progress:", progress, assets);
  };
  const handleLoadComplete = () => {
    console.log("[App] All assets loaded!");
  };

  return (
    <ErrorBoundary>
      <Canvas
        dpr={1}
        gl={{ antialias: true }}
        camera={{ fov: INITIAL_FOV, position: [0, 0.8, 7.5] }}
        flat
      >
        <Suspense fallback={null}>
          {/* LoadingManager is now headless and reusable */}
          <LoadingManager
            onProgress={handleProgress}
            onLoadComplete={handleLoadComplete}
          />
          <Env />
          <AdaptiveDpr pixelated />
          <FarPlanets img={img} />
          <InnerScene
            images={images}
            svgUrl={svgUrl}
            section2Position={section2Position}
            section2LookAtTarget={section2LookAtTarget}
            initialFov={INITIAL_FOV}
            img={img}
          />
        </Suspense>
        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Bloom mipmapBlur luminanceThreshold={1} intensity={1} />
        </EffectComposer>
        <Rig />
      </Canvas>
    </ErrorBoundary>
  );
};

export default App;
