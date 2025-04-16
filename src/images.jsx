const getApiData = async () => {
  const url =
    "https://webhook.creative-directors.com/webhook/7bd04d17-2d35-49e1-a2aa-10b5c8ee3429";
  const endpointResponse = await fetchImageData(url);
  console.log("Endpoint Response:", endpointResponse);

  // --- Get slug from URL ---
  const pathname = window.location.pathname;
  const slugMatch = pathname.match(/^\/works\/(.+)/); // Match paths starting with /works/
  const currentSlug = slugMatch ? slugMatch[1] : null;
  console.log("Current Slug from URL:", currentSlug);

  // --- Find matching project data ---
  let projectData = null;
  if (currentSlug && endpointResponse.length > 0) {
    projectData = endpointResponse.find((p) => p.slug === currentSlug);
  }

  // --- Determine which images and SVG to use ---
  let sourceImages = [];
  let projectName = "Default Project"; // Default name
  let projectSlug = "default-slug"; // Default slug
  let projectSvgUrl = null; // Variable to store the SVG URL

  // Helper function to check if the svg value is a valid, non-empty string URL
  const isValidSvgUrl = (svgValue) => {
    return typeof svgValue === "string" && svgValue.trim() !== "";
  };

  if (projectData) {
    // Use data from the matched project
    sourceImages =
      projectData.images && projectData.images.length > 0
        ? projectData.images
        : [];
    projectName = projectData.name || projectName;
    projectSlug = projectData.slug || projectSlug;
    // Check if projectData.svg is a valid string URL
    projectSvgUrl = isValidSvgUrl(projectData.svg) ? projectData.svg : null;
    console.log(
      `Using data for project: ${projectName} (${projectSlug}), SVG: ${projectSvgUrl}`
    );
  } else if (endpointResponse.length > 0) {
    // Fallback: Use data from the first project if no slug matches
    const firstProject = endpointResponse[0];
    sourceImages =
      firstProject.images && firstProject.images.length > 0
        ? firstProject.images
        : [];
    projectName = firstProject.name || projectName;
    projectSlug = firstProject.slug || projectSlug;
    // Check if firstProject.svg is a valid string URL
    projectSvgUrl = isValidSvgUrl(firstProject.svg) ? firstProject.svg : null;
    console.log(
      `Fallback: Using data from first project: ${projectName} (${projectSlug}), SVG: ${projectSvgUrl}`
    );
  } else {
    // Fallback: If no data at all
    console.warn("No project data found. Returning empty array and null SVG.");
    return { images: [], svgUrl: null }; // Return object with empty images and null SVG
  }

  // If no valid images found after checks, return empty array and the found SVG URL
  if (sourceImages.length === 0) {
    console.warn(
      `No images found for project ${projectName}. Returning empty image array.`
    );
    // Still return the SVG URL if it was found
    return { images: [], svgUrl: projectSvgUrl };
  }

  // --- Calculate Semi-Circle Layout based on sourceImages ---
  const numImages = sourceImages.length; // Use actual number of images
  const radius = 3.5; // Radius of the semi-circle
  const totalAngle = Math.PI; // Ensure positive PI for 180 degrees arc
  // Adjust angle step calculation for single image case
  const angleStep = numImages > 1 ? totalAngle / (numImages - 1) : 0; // Angle between each frame

  const calculatedImages = Array.from({ length: numImages }).map((_, index) => {
    // Calculate angle for this frame, from -PI/2 to PI/2
    // If only one image, place it directly in front (angle = 0)
    const angle = numImages > 1 ? -Math.PI / 2 + index * angleStep : 0;

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

  // Use the calculated positions and rotations with the determined sourceImages
  const images = sourceImages.map((imageUrl, index) => ({
    position: calculatedImages[index].position,
    rotation: calculatedImages[index].rotation,
    url: imageUrl || "https://placehold.co/600x400", // Use the image URL from the array
    name: `${projectName} ${index + 1}`, // Give a unique name based on project and index
    slug: projectSlug, // Pass the slug of the project
  }));

  console.log("Final Images for Frames:", images);
  // Return an object containing both images and the svgUrl
  return { images, svgUrl: projectSvgUrl };
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
