/**
 * Function to retrieve hourly historical weather data from Google Maps Platform.
 *
 * @param {Object} args - Arguments for the weather lookup.
 * @param {number} args.latitude - The latitude for the requested location.
 * @param {number} args.longitude - The longitude for the requested location.
 * @param {string} [args.unitsSystem='METRIC'] - The units system for the weather conditions.
 * @param {number} [args.pageSize=24] - The maximum number of hourly records to return per page.
 * @param {string} [args.pageToken] - A token received from a previous request for pagination.
 * @param {number} [args.hours=24] - Limits the total hours to fetch starting from the last hour.
 * @param {string} [args.languageCode='en'] - The language for the response.
 * @returns {Promise<Object>} - The result of the weather lookup.
 */
const executeFunction = async ({ latitude, longitude, unitsSystem = 'METRIC', pageSize = 24, pageToken, hours = 24, languageCode = 'en' }) => {
  const baseUrl = 'https://weather.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/history/hours:lookup`);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('unitsSystem', unitsSystem);
    url.searchParams.append('pageSize', pageSize.toString());
    if (pageToken) url.searchParams.append('pageToken', pageToken);
    url.searchParams.append('hours', hours.toString());
    url.searchParams.append('languageCode', languageCode);

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add the API key to the query parameters
    url.searchParams.append('key', apiKey);

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
    console.error('Error retrieving hourly historical weather data:', error);
    return {
      error: `An error occurred while retrieving weather data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving hourly historical weather data.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_hourly_weather',
      description: 'Retrieve hourly historical weather data from Google Maps Platform.',
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'The latitude for the requested location.'
          },
          longitude: {
            type: 'number',
            description: 'The longitude for the requested location.'
          },
          unitsSystem: {
            type: 'string',
            enum: ['METRIC', 'IMPERIAL'],
            description: 'The units system for the weather conditions.'
          },
          pageSize: {
            type: 'integer',
            description: 'The maximum number of hourly records to return per page.'
          },
          pageToken: {
            type: 'string',
            description: 'A token received from a previous request for pagination.'
          },
          hours: {
            type: 'integer',
            description: 'Limits the total hours to fetch starting from the last hour.'
          },
          languageCode: {
            type: 'string',
            description: 'The language for the response.'
          }
        },
        required: ['latitude', 'longitude']
      }
    }
  }
};

export { apiTool };