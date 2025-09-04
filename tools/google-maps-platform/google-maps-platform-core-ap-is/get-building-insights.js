/**
 * Function to get building insights from the Google Maps Platform.
 *
 * @param {Object} args - Arguments for the building insights request.
 * @param {number} args.latitude - The latitude of the location.
 * @param {number} args.longitude - The longitude of the location.
 * @returns {Promise<Object>} - The insights about the building at the specified location.
 */
const executeFunction = async ({ latitude, longitude }) => {
  const baseUrl = 'https://solar.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/buildingInsights:findClosest`);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('requiredQuality', 'HIGH');
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
    console.error('Error fetching building insights:', error);
    return {
      error: `An error occurred while fetching building insights: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting building insights from Google Maps Platform.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_building_insights',
      description: 'Get insights about a building based on its location.',
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
          }
        },
        required: ['latitude', 'longitude']
      }
    }
  }
};

export { apiTool };