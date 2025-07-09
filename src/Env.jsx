import { Environment, useTexture } from "@react-three/drei";
import { EquirectangularReflectionMapping, SRGBColorSpace } from "three";

const isDevelopment = import.meta.env.DEV;
const backgroundTextureLocalUrl = "/sci-fi-nebula-space-planet_4K.jpg";
const backgroundTextureRemoteUrl =
    "https://files.creative-directors.com/creative-website/creative25/background/sci-fi-nebula-space-planet_4K_2.webp";

const backgroundTextureUrl = isDevelopment ? backgroundTextureLocalUrl : backgroundTextureRemoteUrl;

const lightingTextureLocalUrl = "/artist_workshop_100.hdr";
const lightingTextureRemoteUrl = "https://files.creative-directors.com/creative-website/creative25/hdr/artist_workshop_100.hdr";
const lightingTextureUrl = isDevelopment ? lightingTextureLocalUrl : lightingTextureRemoteUrl;



export default function Env() {

    const backgroundTexture = useTexture(backgroundTextureUrl);
    backgroundTexture.mapping = EquirectangularReflectionMapping;
    backgroundTexture.colorSpace = SRGBColorSpace;

    return (
        <>
            <primitive object={backgroundTexture} attach="background" />
            <Environment
                files={lightingTextureUrl}
            />
        </>
    );
}