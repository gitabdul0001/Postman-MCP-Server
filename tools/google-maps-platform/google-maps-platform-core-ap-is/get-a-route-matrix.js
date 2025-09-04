/**
 * Function to get a route matrix from the Google Maps API.
 *
 * @param {Object} args - Arguments for the route matrix request.
 * @param {Array} args.origins - An array of origin waypoints with latitude and longitude.
 * @param {Array} args.destinations - An array of destination waypoints with latitude and longitude.
 * @param {string} [args.travelMode="DRIVE"] - The mode of travel (e.g., DRIVE, WALK).
 * @param {string} [args.routingPreference="TRAFFIC_AWARE"] - The routing preference.
 * @returns {Promise<Object>} - The result of the route matrix request.
 */
const executeFunction = async ({ origins, destinations, travelMode = 'DRIVE', routingPreference = 'TRAFFIC_AWARE' }) => {
  const baseUrl = 'https://routes.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  const url = `${baseUrl}/distanceMatrix/v2:computeRouteMatrix`;

  const body = {
    origins,
    destinations,
    travelMode,
    routingPreference
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Goog-FieldMask': '*',
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify(body)
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
    console.error('Error getting route matrix:', error);
    return {
      error: `An error occurred while getting the route matrix: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting a route matrix from the Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_route_matrix',
      description: 'Get a route matrix from the Google Maps API.',
      parameters: {
        type: 'object',
        properties: {
          origins: {
            type: 'array',
            description: 'An array of origin waypoints with latitude and longitude.'
          },
          destinations: {
            type: 'array',
            description: 'An array of destination waypoints with latitude and longitude.'
          },
          travelMode: {
            type: 'string',
            enum: ['DRIVE', 'WALK', 'BICYCLING', 'TRANSIT'],
            description: 'The mode of travel.'
          },
          routingPreference: {
            type: 'string',
            enum: ['TRAFFIC_AWARE', 'LESS_TRAFFIC'],
            description: 'The routing preference.'
          }
        },
        required: ['origins', 'destinations']
      }
    }
  }
};

export { apiTool };