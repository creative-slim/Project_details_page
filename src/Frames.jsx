import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  Svg,
} from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import getUuid from "uuid-by-string";

import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { gsap } from "gsap"; // Import gsap
import { Frame } from "./components/Frame";

const GOLDENRATIO = 1.61803398875;

// Helper function to calculate lookAt quaternion more robustly
const calculateLookAtQuaternion = (
  eye,
  target,
  up = new THREE.Vector3(0, 1, 0)
) => {
  const _matrix = new THREE.Matrix4(); // Use local temp variable
  _matrix.lookAt(eye, target, up);
  return new THREE.Quaternion().setFromRotationMatrix(_matrix);
};
const clearActiveProjectClasses = () => {
  console.log("Clearing active project classes");
  const allProjectElements = document.querySelectorAll("[data-projects]");
  allProjectElements.forEach((el) => {
    el.classList.remove("active");
  });
};

export default function Frames({
  images,
  setIsZoomed, // Receive setIsZoomed prop
  section2Position, // Receive section 2 position
  section2LookAtTarget, // Receive section 2 lookAt target
  initialFov, // Receive initial FOV
}) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  const { camera } = useThree(); // Get camera instance here
  const [isAnimatingOut, setIsAnimatingOut] = useState(false); // State for zoom-out animation
  const targetFovRef = useRef(initialFov); // Ref to store target FOV

  const pointLightRef = useRef(); // Ref for point light
  // Refs for animation targets
  const finalZoomInPosition = useRef(new THREE.Vector3());
  const frameCenterWorld = useRef(new THREE.Vector3()); // Point to look at
  const zoomInTargetQ = useRef(new THREE.Quaternion());
  const zoomOutTargetQ = useRef(new THREE.Quaternion()); // Store the target quaternion for zoom-out

  // Effect to handle zoom IN state and target calculation
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (clicked.current) {
      // Item is selected: Calculate zoom-in targets, set isZoomed true
      clicked.current.parent.updateWorldMatrix(true, true);

      // 1. Calculate the world position the camera should move TO
      clicked.current.parent.localToWorld(
        finalZoomInPosition.current.set(0, GOLDENRATIO / 2, 1.25) // Camera position in front of frame
      );

      // 2. Calculate the world position the camera should LOOK AT
      clicked.current.parent.localToWorld(
        frameCenterWorld.current.set(0, GOLDENRATIO / 2, 0.7) // Center of image plane
      );

      // 3. Calculate the target quaternion based on the final position and lookAt point
      zoomInTargetQ.current.copy(
        calculateLookAtQuaternion(
          finalZoomInPosition.current,
          frameCenterWorld.current
        )
      );

      setIsZoomed(true); // Signal APP that we are zoomed
      targetFovRef.current = 70; // Set TARGET FOV for zoom in
      console.log(
        "Frames : Zoomed IN, setting isZoomed = true, target FOV = 100"
      );
    }
    // Target FOV reset is handled by zoom-out trigger
  }, [params?.id, setIsZoomed, camera, initialFov]); // Add camera and initialFov to dependencies, remove setFov

  // Effect to run the zoom OUT animation
  useEffect(() => {
    if (isAnimatingOut) {
      console.log("Frames : Starting zoom OUT animation");

      // Calculate the target quaternion for the final zoom-out state
      zoomOutTargetQ.current.copy(
        calculateLookAtQuaternion(section2Position, section2LookAtTarget)
      );

      // Animate position only using GSAP
      gsap.to(camera.position, {
        duration: 1.2, // Adjust duration as needed
        x: section2Position.x,
        y: section2Position.y,
        z: section2Position.z,
        ease: "power1.inOut",
        onComplete: () => {
          // Use delayedCall to allow dampQ one more frame to settle
          gsap.delayedCall(0.5, () => {
            // Small delay (approx 1-2 frames)
            console.log("Frames: Zoom OUT animation complete (after delay)");
            clearActiveProjectClasses(); // Clear active classes
            // No need to manually set quaternion if dampQ finishes
            setIsAnimatingOut(false);
            setIsZoomed(false); // Signal APP that zoom is finished AFTER animation and delay
          });
        },
      });
    }
  }, [
    isAnimatingOut,
    camera,
    section2Position,
    section2LookAtTarget,
    setIsZoomed,
  ]); // Add 'p' dependency

  // useFrame for animations (including FOV)
  useFrame((state, dt) => {
    // Animate FOV towards the target value
    const fovChanged = Math.abs(state.camera.fov - targetFovRef.current) > 0.01;
    if (fovChanged) {
      easing.damp(state.camera, "fov", targetFovRef.current, 0.4, dt);
      state.camera.updateProjectionMatrix(); // Update projection matrix if FOV changed
    }

    // pointLight animation
    if (pointLightRef.current) {
      // make the pointLIght rotate
      pointLightRef.current.position.z = Math.sin(state.clock.elapsedTime) * 2;
      pointLightRef.current.position.x = Math.cos(state.clock.elapsedTime) * 4;
      // pointLightRef.current.position.y = Math.sin(state.clock.elapsedTime);
    }
    if (isAnimatingOut) {
      // During zoom-out animation, smoothly rotate towards the target quaternion using dampQ
      easing.dampQ(state.camera.quaternion, zoomOutTargetQ.current, 0.5, dt); // Adjust speed (0.5) as needed
    } else if (params?.id && clicked.current) {
      // During zoom-in animation (and while zoomed), use maath easing for position and rotation
      easing.damp3(state.camera.position, finalZoomInPosition.current, 0.4, dt); // Move towards final position
      easing.dampQ(state.camera.quaternion, zoomInTargetQ.current, 0.4, dt); // Rotate towards final orientation
    }
    // If !isAnimatingOut and !params?.id, GSAP ScrollTrigger controls the camera
  });

  // Effect to handle scroll UP while zoomed in
  useEffect(() => {
    if (params?.id) {
      // Only listen when zoomed in
      const handleWheel = (event) => {
        if (event.deltaY < 0) {
          // Scrolling UP
          console.log("Frames: Scroll UP detected while zoomed, zooming out.");
          event.preventDefault(); // Prevent default scroll
          triggerZoomOut(); // Use the trigger function
        }
      };
      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => window.removeEventListener("wheel", handleWheel);
    }
  }, [params?.id, setLocation]); // Rerun when zoom state changes

  // Function to trigger zoom out
  const triggerZoomOut = () => {
    if (!isAnimatingOut && params?.id) {
      // Only trigger if zoomed in and not already animating out
      console.log("Frames: Triggering zoom out, setting target FOV");
      targetFovRef.current = initialFov; // Set TARGET FOV for zoom out
      setIsAnimatingOut(true);
      setLocation("/"); // Update route to exit item view
    }
  };

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        if (clicked.current === e.object) {
          // Clicked active frame: Zoom out
          triggerZoomOut();
        } else {
          // Clicked inactive frame: Zoom in
          if (!isAnimatingOut) {
            setLocation("/item/" + e.object.name);
          }
        }
      }}
      onPointerMissed={() => {
        // Clicked background: Zoom out
        triggerZoomOut(); // Will only run if params.id exists and not already animating
      }}
    >
      <pointLight ref={pointLightRef} position={[0, 1, 0]} intensity={5} />
      {images.map(
        (props) => <Frame key={props.url} {...props} /> /* prettier-ignore */
      )}
    </group>
  );
}
