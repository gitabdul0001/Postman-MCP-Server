/**
 * Function to get place details from Google Maps.
 *
 * @param {Object} args - Arguments for the place details request.
 * @param {string} args.placeId - The place ID for which to retrieve details.
 * @param {string} [args.languageCode] - The language in which to return results.
 * @param {string} [args.regionCode] - The region code used to format the response.
 * @param {string} [args.sessionToken] - Session token for tracking autocomplete sessions.
 * @returns {Promise<Object>} - The details of the specified place.
 */
const executeFunction = async ({ placeId, languageCode, regionCode, sessionToken }) => {
  const baseUrl = 'https://places.googleapis.com/v1/places';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL for the request
    const url = new URL(`${baseUrl}/${placeId}`);
    
    // Set up query parameters
    const params = new URLSearchParams();
    if (languageCode) params.append('languageCode', languageCode);
    if (regionCode) params.append('regionCode', regionCode);
    if (sessionToken) params.append('sessionToken', sessionToken);
    
    // Append query parameters to the URL
    url.search = params.toString();

    // Set up headers for the request
    const headers = {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': '*',
      'Content-Type': 'application/json'
    };

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
    console.error('Error getting place details:', error);
    return {
      error: `An error occurred while getting place details: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting place details from Google Maps.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_place_details',
      description: 'Get details of a place using its place ID.',
      parameters: {
        type: 'object',
        properties: {
          placeId: {
            type: 'string',
            description: 'The place ID for which to retrieve details.'
          },
          languageCode: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          regionCode: {
            type: 'string',
            description: 'The region code used to format the response.'
          },
          sessionToken: {
            type: 'string',
            description: 'Session token for tracking autocomplete sessions.'
          }
        },
        required: ['placeId']
      }
    }
  }
};

export { apiTool };