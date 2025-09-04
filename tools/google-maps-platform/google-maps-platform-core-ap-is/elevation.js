/**
 * Function to get elevation data from the Google Maps Elevation API.
 *
 * @param {Object} args - Arguments for the elevation request.
 * @param {string} args.locations - The locations for which to get elevation data, specified as latitude/longitude values.
 * @param {string} [args.path] - An array of comma-separated `latitude,longitude` strings for path elevation requests.
 * @param {number} [args.samples] - Required if the path parameter is set, indicating the number of samples to return along the path.
 * @returns {Promise<Object>} - The elevation data response from the API.
 */
const executeFunction = async ({ locations, path, samples }) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/elevation/json';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('locations', locations);
    if (path) {
      url.searchParams.append('path', path);
    }
    if (samples) {
      url.searchParams.append('samples', samples.toString());
    }
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
    console.error('Error fetching elevation data:', error);
    return {
      error: `An error occurred while fetching elevation data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching elevation data from the Google Maps Elevation API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_elevation',
      description: 'Get elevation data for specified locations from the Google Maps Elevation API.',
      parameters: {
        type: 'object',
        properties: {
          locations: {
            type: 'string',
            description: 'The locations for which to get elevation data, specified as latitude/longitude values.'
          },
          path: {
            type: 'string',
            description: 'An array of comma-separated `latitude,longitude` strings for path elevation requests.'
          },
          samples: {
            type: 'integer',
            description: 'Required if the path parameter is set, indicating the number of samples to return along the path.'
          }
        },
        required: ['locations']
      }
    }
  }
};

export { apiTool };