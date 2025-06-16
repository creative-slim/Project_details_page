// --- Configuration ---
const API_URL = "https://webhook.creative-directors.com/webhook/7bd04d17-2d35-49e1-a2aa-10b5c8ee3429";
const LAYOUT_RADIUS = 3.5; // Radius of the semi-circle for image layout

// --- Helper Functions ---

/**
 * Fetches project data from a given URL.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<Array>} A promise that resolves to an array of projects, or an empty array on failure.
 */
const fetchProjectsData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch project data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Endpoint Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return [];
  }
};

/**
 * Extracts a slug from a URL pathname.
 * @param {string} pathname - The URL pathname, e.g., '/works/project-slug'.
 * @returns {string|null} The extracted slug or null if not found.
 */
const getSlugFromPathname = (pathname) => {
  const slugMatch = pathname.match(/^\/works\/(.+)/);
  const currentSlug = slugMatch ? slugMatch[1] : null;
  console.log("Current Slug from URL:", currentSlug);
  return currentSlug;
};

/**
 * Finds the relevant project from a list based on a slug, with a fallback to the first project.
 * @param {Array} projects - The list of project objects.
 * @param {string|null} slug - The slug to search for.
 * @returns {object|null} The found project data or null if no projects are available.
 */
const findProjectData = (projects, slug) => {
  if (!projects || projects.length === 0) {
    return null;
  }
  let projectData = null;
  if (slug) {
    projectData = projects.find((p) => p.slug === slug);
  }
  return projectData || projects[0]; // Fallback to the first project
};

/**
 * Checks if a value is a valid, non-empty string URL.
 * @param {*} svgValue - The value to check.
 * @returns {boolean} True if it's a valid SVG URL string.
 */
const isValidSvgUrl = (svgValue) => {
  return typeof svgValue === "string" && svgValue.trim() !== "";
};

/**
 * Calculates positions and rotations for items in a semi-circle layout.
 * @param {number} numImages - The number of images to lay out.
 * @param {number} radius - The radius of the semi-circle.
 * @returns {Array<object>} An array of objects with position and rotation.
 */
const calculateSemiCircleLayout = (numImages, radius) => {
  if (numImages === 0) {
    return [];
  }
  const totalAngle = Math.PI; // 180 degrees
  const angleStep = numImages > 1 ? totalAngle / (numImages - 1) : 0;

  return Array.from({ length: numImages }).map((_, index) => {
    const angle = numImages > 1 ? -Math.PI / 2 + index * angleStep : 0;
    const x = radius * Math.sin(angle);
    const z = -radius * Math.cos(angle);
    const rotationY = -angle;
    return {
      position: [x, 0, z],
      rotation: [0, rotationY, 0],
    };
  });
};

// --- Main Data Provider Function ---

/**
 * Fetches API data, processes it based on the current URL slug,
 * and returns formatted image data and an SVG URL for the 3D scene.
 * @returns {Promise<{images: Array, svgUrl: string|null}>}
 */
const getApiData = async () => {
  const allProjects = await fetchProjectsData(API_URL);

  if (!allProjects || allProjects.length === 0) {
    console.warn("No project data found. Returning empty array and null SVG.");
    return { images: [], svgUrl: null };
  }

  const currentSlug = getSlugFromPathname(window.location.pathname);
  const projectData = findProjectData(allProjects, currentSlug);

  const projectName = projectData.name || "Default Project";
  const projectSlug = projectData.slug || "default-slug";
  const projectSvgUrl = isValidSvgUrl(projectData.svg.url) ? projectData.svg.url : null;

  console.log(`Using data for project: ${projectName} (${projectSlug}), SVG: ${projectSvgUrl}`);

  const sourceImages = (projectData.images && projectData.images.length > 0) ? projectData.images : [];

  if (sourceImages.length === 0) {
    console.warn(`No images found for project ${projectName}. Returning empty image array.`);
    return { images: [], svgUrl: projectSvgUrl };
  }

  const layout = calculateSemiCircleLayout(sourceImages.length, LAYOUT_RADIUS);

  const images = sourceImages.map((imageUrl, index) => ({
    position: layout[index].position,
    rotation: layout[index].rotation,
    url: imageUrl || "https://placehold.co/600x400",
    name: `${projectName} ${index + 1}`,
    slug: projectSlug,
  }));

  console.log("Final Images for Frames:", images);
  return { images, svgUrl: projectSvgUrl };
};

export default getApiData;
