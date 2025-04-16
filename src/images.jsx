const getApiData = async () => {
  const url =
    "https://webhook.creative-directors.com/webhook/7bd04d17-2d35-49e1-a2aa-10b5c8ee3429";
  const endpointResponse = await fetchImageData(url);
  console.log("Endpoint Response:", endpointResponse);

  // --- Calculate Semi-Circle Layout ---
  const numImages = 9; // Number of images/frames to arrange
  const radius = 3.5; // Radius of the semi-circle
  const totalAngle = Math.PI; // Ensure positive PI for 180 degrees arc
  const angleStep = numImages > 1 ? totalAngle / (numImages - 1) : 0; // Angle between each frame

  const calculatedImages = Array.from({ length: numImages }).map((_, index) => {
    // Calculate angle for this frame, from -PI/2 to PI/2
    const angle = -Math.PI / 2 + index * angleStep;

    // Calculate position on the circle (X and Z plane)
    const x = radius * Math.sin(angle); // Use sin for X to span from -radius to +radius
    const z = -radius * Math.cos(angle); // Use NEGATIVE cos for Z to place along the negative Z arc

    // Calculate rotation to face the center (0, 0, 0)
    const rotationY = -angle; // Rotate around Y axis to face inwards

    return {
      position: [x, 0, z], // Position [x, y, z]
      rotation: [0, rotationY, 0], // Rotation [x, y, z]
    };
  });
  // --- End Calculation ---

  // Use the calculated positions and rotations
  const images = endpointResponse.slice(0, numImages).map((image, index) => ({
    position: calculatedImages[index].position,
    rotation: calculatedImages[index].rotation,
    url: image.images[0] || "https://placehold.co/600x400",
    name: image.name,
    slug: image.slug,
  }));

  return images;
};

const fetchImageData = async (webhookUrl) => {
  try {
    const response = await fetch(webhookUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching image data:", error);
    // Return empty array as fallback
    return [];
  }
};

export default getApiData;
