/**
 * Function to retrieve a static Street View image from the Google Maps API.
 *
 * @param {Object} args - Arguments for the Street View request.
 * @param {string} args.size - The output size of the image in pixels (format: {width}x{height}).
 * @param {number} [args.fov=90] - The horizontal field of view of the image (max 120).
 * @param {number} [args.heading] - The compass heading of the camera (0 to 360).
 * @param {string} [args.location] - The point around which to retrieve place information.
 * @param {string} [args.pano] - A specific panorama ID.
 * @param {number} [args.pitch=0] - The up or down angle of the camera.
 * @param {number} [args.radius=50] - The radius in meters to search for a panorama.
 * @param {boolean} [args.return_error_code=false] - Whether to return a non-200 HTTP status for errors.
 * @param {string} [args.signature] - A digital signature for request verification.
 * @param {string} [args.source] - Limits Street View searches to selected sources.
 * @returns {Promise<Buffer>} - The static image data from the Street View API.
 */
const executeFunction = async ({ size, fov = 90, heading, location, pano, pitch = 0, radius = 50, return_error_code = false, signature, source }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/streetview`);
    url.searchParams.append('size', size);
    if (fov) url.searchParams.append('fov', fov);
    if (heading) url.searchParams.append('heading', heading);
    if (location) url.searchParams.append('location', location);
    if (pano) url.searchParams.append('pano', pano);
    if (pitch) url.searchParams.append('pitch', pitch);
    if (radius) url.searchParams.append('radius', radius);
    if (return_error_code) url.searchParams.append('return_error_code', return_error_code);
    if (signature) url.searchParams.append('signature', signature);
    if (source) url.searchParams.append('source', source);
    url.searchParams.append('key', apiKey);

    // Set up headers for the request
    const headers = {
      'Accept': 'image/*'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return the image data as a Buffer
    const imageBuffer = await response.buffer();
    return imageBuffer;
  } catch (error) {
    console.error('Error retrieving Street View image:', error);
    throw new Error(`An error occurred while retrieving the Street View image: ${error.message}`);
  }
};

/**
 * Tool configuration for retrieving a static Street View image from Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_street_view',
      description: 'Retrieve a static Street View image from Google Maps API.',
      parameters: {
        type: 'object',
        properties: {
          size: {
            type: 'string',
            description: 'The output size of the image in pixels (format: {width}x{height}).'
          },
          fov: {
            type: 'number',
            description: 'The horizontal field of view of the image (max 120).'
          },
          heading: {
            type: 'number',
            description: 'The compass heading of the camera (0 to 360).'
          },
          location: {
            type: 'string',
            description: 'The point around which to retrieve place information.'
          },
          pano: {
            type: 'string',
            description: 'A specific panorama ID.'
          },
          pitch: {
            type: 'number',
            description: 'The up or down angle of the camera.'
          },
          radius: {
            type: 'number',
            description: 'The radius in meters to search for a panorama.'
          },
          return_error_code: {
            type: 'boolean',
            description: 'Whether to return a non-200 HTTP status for errors.'
          },
          signature: {
            type: 'string',
            description: 'A digital signature for request verification.'
          },
          source: {
            type: 'string',
            description: 'Limits Street View searches to selected sources.'
          }
        },
        required: ['size']
      }
    }
  }
};

export { apiTool };