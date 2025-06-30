// --- Configuration ---
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

/**
 * Waits for the DOM to be fully loaded.
 * @returns {Promise<void>}
 */
const waitForDom = () => {
  if (document.readyState === "loading") {
    return new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
  }
  return Promise.resolve();
};

// --- Main Data Provider Function ---

/**
 * Fetches image and logo data from the DOM, applies layout, and returns formatted data.
 * @returns {Promise<{images: Array, svgUrl: string|null}>}
 */
const getApiData = async () => {
  await waitForDom();

  // Find images container
  const imagesContainer = document.querySelector('[data-three="images"]');
  let imageElements = [];
  if (imagesContainer) {
    imageElements = Array.from(imagesContainer.querySelectorAll('img'));
  }

  // Find logo
  const logoElement = document.querySelector('[data-three="logo"]');
  const logoUrl = logoElement && logoElement.src ? logoElement.src : null;

  if (!imageElements.length) {
    console.warn("No images found in DOM. Returning empty image array.");
    return { images: [], svgUrl: logoUrl };
  }

  const layout = calculateSemiCircleLayout(imageElements.length, LAYOUT_RADIUS);

  const images = imageElements.map((img, index) => ({
    position: layout[index].position,
    rotation: layout[index].rotation,
    url: img.src || "https://placehold.co/600x400",
    name: img.alt || `Image ${index + 1}`,
    slug: img.getAttribute('data-slug') || 'dom-image',
  }));

  console.log("Final Images for Frames (from DOM):", images);
  return { images, svgUrl: logoUrl };
};

export default getApiData;
