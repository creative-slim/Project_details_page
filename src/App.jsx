import * as THREE from "three";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import getApiData from "./images.js";
import { Rig } from "./components/Rig.jsx";
import { InnerScene } from "./components/InnerScene.jsx";
import { FarPlanets } from "./components/FarPlanets.jsx";

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
  //  "https://cdn.prod.website-files.com/678907d8717d9b914d9d4b48/67c04ac57662945f0bfed7cc_Linea_D.svg";

  useEffect(() => {
    const fetchData = async () => {
      const data = await getApiData();
      if (data) {
        setImages(data.images || []);
        const finalSvgUrl = data.svgUrl || defaultSvgUrl;
        setSvgUrl(finalSvgUrl);
        console.log("Fetched SVG URL:", data.svgUrl, "| Using:", finalSvgUrl);
      } else {
        setSvgUrl(defaultSvgUrl);
        console.log("No data fetched, using default SVG URL:", defaultSvgUrl);
      }
    };
    fetchData();
  }, []);

  console.log("Images:", images);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{ fov: INITIAL_FOV, position: [0, 0.8, 7.5] }}
        flat
      >
        <FarPlanets img={img} />
        <InnerScene
          images={images}
          svgUrl={svgUrl}
          section2Position={section2Position}
          section2LookAtTarget={section2LookAtTarget}
          initialFov={INITIAL_FOV}
          img={img}
        />
        {/* <OrbitControls /> */}
        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Bloom mipmapBlur luminanceThreshold={1} intensity={1} />
        </EffectComposer>
        <Rig />
      </Canvas>
    </>
  );
};

export default App;
