/**
 * Function to get the pollen forecast from the Google Maps Platform.
 *
 * @param {Object} args - Arguments for the forecast request.
 * @param {number} args.longitude - The longitude from which the API searches for pollen forecast data.
 * @param {number} args.latitude - The latitude from which the API searches for pollen forecast data.
 * @param {number} args.days - The number of forecast days to request (minimum value 1, maximum value is 5).
 * @returns {Promise<Object>} - The result of the pollen forecast request.
 */
const executeFunction = async ({ longitude, latitude, days }) => {
  const baseUrl = 'https://pollen.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/forecast:lookup`);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('days', days.toString());

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // If an API key is provided, add it to the query parameters
    if (apiKey) {
      url.searchParams.append('key', apiKey);
    }

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
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
    console.error('Error getting pollen forecast:', error);
    return {
      error: `An error occurred while getting the pollen forecast: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting pollen forecast from Google Maps Platform.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_forecast',
      description: 'Get pollen forecast based on location.',
      parameters: {
        type: 'object',
        properties: {
          longitude: {
            type: 'number',
            description: 'The longitude from which the API searches for pollen forecast data.'
          },
          latitude: {
            type: 'number',
            description: 'The latitude from which the API searches for pollen forecast data.'
          },
          days: {
            type: 'integer',
            description: 'The number of forecast days to request (minimum value 1, maximum value is 5).'
          }
        },
        required: ['longitude', 'latitude', 'days']
      }
    }
  }
};

export { apiTool };