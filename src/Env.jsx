import { Environment, useTexture } from "@react-three/drei";
import { EquirectangularReflectionMapping, SRGBColorSpace, Color } from "three";

const isDevelopment = import.meta.env.DEV;
const backgroundTextureLocalUrl = "/sci-fi-nebula-space-planet_4K.jpg";
const backgroundTextureRemoteUrl =
    "https://files.creative-directors.com/creative-website/creative25/background/sci-fi-nebula-space-planet_4K_2.webp";

const backgroundTextureUrl = isDevelopment ? backgroundTextureLocalUrl : backgroundTextureRemoteUrl;

const lightingTextureLocalUrl = "/artist_workshop_100.hdr";
const lightingTextureRemoteUrl = "https://files.creative-directors.com/creative-website/creative25/hdr/artist_workshop_100.hdr";
const lightingTextureUrl = isDevelopment ? lightingTextureLocalUrl : lightingTextureRemoteUrl;



export default function Env({ hueShift = 0, saturation = 0, brightness = 0 }) {

    const backgroundTexture = useTexture(backgroundTextureUrl);
    backgroundTexture.mapping = EquirectangularReflectionMapping;
    backgroundTexture.colorSpace = SRGBColorSpace;

    // Apply color modifications to the texture
    if (hueShift !== 0 || saturation !== 1 || brightness !== 1) {
        const color = new Color();
        color.setHSL(hueShift / 360, saturation, brightness);
        backgroundTexture.color = color;
    }

    return (
        <>
            <primitive object={backgroundTexture} attach="background" />
            <Environment
                files={lightingTextureUrl}
            />
        </>
    );
}