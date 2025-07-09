/**
 * LoadingManager.jsx
 *
 * A drop-in, headless asset loading tracker for React Three Fiber projects.
 *
 * Usage:
 *   <LoadingManager
 *     onProgress={(progress, assets) => { ... }}
 *     onLoadComplete={() => { ... }}
 *     onStart={() => { ... }} // optional
 *   />
 *
 * - Place inside your <Canvas> tree.
 * - Handles all Three.js asset loading (textures, images, SVGs, GLTFs).
 * - Calls your callbacks with progress and asset counts.
 * - No UI, no state, no dependencies—just drop it in and use your own UI if desired.
 */

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let loadersOverridden = false;
let globalLoadingManager = null;

function setupGlobalLoaderOverrides({ onProgress, onLoadComplete, onStart }) {
    if (loadersOverridden) return;
    loadersOverridden = true;

    globalLoadingManager = new THREE.LoadingManager();

    let totalItems = 0;
    let loadedItems = 0;
    let textureCount = 0;
    let imageCount = 0;
    let modelCount = 0;
    let svgCount = 0;
    let originalGLTFLoad;

    const updateProgressInternal = () => {
        const progress = totalItems > 0 ? (loadedItems / totalItems) * 100 : 0;
        const assets = {
            textures: textureCount,
            images: imageCount,
            models: modelCount,
            svgs: svgCount,
            total: totalItems
        };
        if (onProgress) onProgress(progress, assets);
        if (loadedItems === totalItems && totalItems > 0) {
            if (onLoadComplete) onLoadComplete();
        }
    };

    // TextureLoader
    const originalTextureLoad = THREE.TextureLoader.prototype.load;
    THREE.TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        if (totalItems === 0 && onStart) onStart();
        textureCount++;
        totalItems++;
        return originalTextureLoad.call(this, url, (texture) => {
            loadedItems++;
            updateProgressInternal();
            if (onLoad) onLoad(texture);
        }, onProgress, (error) => {
            if (onError) onError(error);
        });
    };

    // SVGLoader
    const originalSVGLoad = SVGLoader.prototype.load;
    SVGLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        if (totalItems === 0 && onStart) onStart();
        svgCount++;
        totalItems++;
        return originalSVGLoad.call(this, url, (data) => {
            loadedItems++;
            updateProgressInternal();
            if (onLoad) onLoad(data);
        }, onProgress, (error) => {
            if (onError) onError(error);
        });
    };

    // GLTFLoader
    if (GLTFLoader) {
        originalGLTFLoad = GLTFLoader.prototype.load;
        GLTFLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            if (totalItems === 0 && onStart) onStart();
            modelCount++;
            totalItems++;
            return originalGLTFLoad.call(this, url, (gltf) => {
                loadedItems++;
                updateProgressInternal();
                if (onLoad) onLoad(gltf);
            }, onProgress, (error) => {
                if (onError) onError(error);
            });
        };
    }

    // ImageLoader
    const originalImageLoad = THREE.ImageLoader.prototype.load;
    THREE.ImageLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        if (totalItems === 0 && onStart) onStart();
        imageCount++;
        totalItems++;
        return originalImageLoad.call(this, url, (image) => {
            loadedItems++;
            updateProgressInternal();
            if (onLoad) onLoad(image);
        }, onProgress, (error) => {
            if (onError) onError(error);
        });
    };

    // Check for no assets
    setTimeout(() => {
        if (totalItems === 0 && onLoadComplete) {
            onLoadComplete();
        }
    }, 1000);
}

const LoadingManager = ({ onProgress, onLoadComplete, onStart }) => {
    const { gl } = useThree();

    useEffect(() => {
        setupGlobalLoaderOverrides({ onProgress, onLoadComplete, onStart });
        if (gl && globalLoadingManager) {
            gl.loadingManager = globalLoadingManager;
        }
    }, [gl, onProgress, onLoadComplete, onStart]);

    return null; // Headless utility
};

export default LoadingManager; 