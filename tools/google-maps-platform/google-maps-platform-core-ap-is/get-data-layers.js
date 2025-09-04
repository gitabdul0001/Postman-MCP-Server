/**
 * Function to get data layers from the Google Maps Solar API.
 *
 * @param {Object} args - Arguments for the data layer request.
 * @param {number} args.latitude - The latitude of the location.
 * @param {number} args.longitude - The longitude of the location.
 * @param {number} [args.radiusMeters=100] - The radius in meters for the data layers.
 * @param {string} [args.view="FULL_LAYERS"] - The view type for the data layers.
 * @param {string} [args.requiredQuality="HIGH"] - The required quality of the data.
 * @param {number} [args.pixelSizeMeters=0.5] - The pixel size in meters for the data layers.
 * @returns {Promise<Object>} - The result of the data layers request.
 */
const executeFunction = async ({ latitude, longitude, radiusMeters = 100, view = 'FULL_LAYERS', requiredQuality = 'HIGH', pixelSizeMeters = 0.5 }) => {
  const baseUrl = 'https://solar.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/dataLayers:get`);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('radiusMeters', radiusMeters.toString());
    url.searchParams.append('view', view);
    url.searchParams.append('requiredQuality', requiredQuality);
    url.searchParams.append('pixelSizeMeters', pixelSizeMeters.toString());
    url.searchParams.append('key', apiKey);

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET'
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
    console.error('Error getting data layers:', error);
    return {
      error: `An error occurred while getting data layers: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting data layers from the Google Maps Solar API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_data_layers',
      description: 'Get data layers from the Google Maps Solar API.',
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'The latitude of the location.'
          },
          longitude: {
            type: 'number',
            description: 'The longitude of the location.'
          },
          radiusMeters: {
            type: 'integer',
            description: 'The radius in meters for the data layers.'
          },
          view: {
            type: 'string',
            description: 'The view type for the data layers.'
          },
          requiredQuality: {
            type: 'string',
            description: 'The required quality of the data.'
          },
          pixelSizeMeters: {
            type: 'number',
            description: 'The pixel size in meters for the data layers.'
          }
        },
        required: ['latitude', 'longitude']
      }
    }
  }
};

export { apiTool };