/**
 * Function to retrieve Street View metadata from Google Maps.
 *
 * @param {Object} args - Arguments for the metadata request.
 * @param {string} args.location - The point around which to retrieve place information.
 * @param {number} [args.heading] - Indicates the compass heading of the camera.
 * @param {string} [args.pano] - A specific panorama ID.
 * @param {number} [args.pitch] - Specifies the up or down angle of the camera.
 * @param {number} [args.radius=50] - Sets a radius in which to search for a panorama.
 * @param {boolean} [args.return_error_code=false] - Indicates whether to return a non `200 OK` HTTP status when no image is found.
 * @param {string} [args.signature] - A digital signature used to verify the API key authorization.
 * @param {string} [args.size] - Specifies the output size of the image in pixels.
 * @param {string} [args.source] - Limits Street View searches to selected sources.
 * @returns {Promise<Object>} - The result of the Street View metadata request.
 */
const executeFunction = async ({ location, heading, pano, pitch, radius = 50, return_error_code = false, signature, size, source }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/streetview/metadata`);
    url.searchParams.append('location', location);
    if (heading) url.searchParams.append('heading', heading);
    if (pano) url.searchParams.append('pano', pano);
    if (pitch) url.searchParams.append('pitch', pitch);
    if (radius) url.searchParams.append('radius', radius);
    if (return_error_code) url.searchParams.append('return_error_code', return_error_code);
    if (signature) url.searchParams.append('signature', signature);
    if (size) url.searchParams.append('size', size);
    if (source) url.searchParams.append('source', source);
    url.searchParams.append('key', apiKey);

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving Street View metadata:', error);
    return {
      error: `An error occurred while retrieving Street View metadata: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving Street View metadata from Google Maps.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_street_view_metadata',
      description: 'Retrieve Street View metadata from Google Maps.',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The point around which to retrieve place information.'
          },
          heading: {
            type: 'number',
            description: 'Indicates the compass heading of the camera.'
          },
          pano: {
            type: 'string',
            description: 'A specific panorama ID.'
          },
          pitch: {
            type: 'number',
            description: 'Specifies the up or down angle of the camera.'
          },
          radius: {
            type: 'number',
            description: 'Sets a radius in which to search for a panorama.'
          },
          return_error_code: {
            type: 'boolean',
            description: 'Indicates whether to return a non `200 OK` HTTP status when no image is found.'
          },
          signature: {
            type: 'string',
            description: 'A digital signature used to verify the API key authorization.'
          },
          size: {
            type: 'string',
            description: 'Specifies the output size of the image in pixels.'
          },
          source: {
            type: 'string',
            description: 'Limits Street View searches to selected sources.'
          }
        },
        required: ['location']
      }
    }
  }
};

export { apiTool };