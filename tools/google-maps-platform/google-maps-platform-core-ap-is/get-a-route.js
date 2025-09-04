/**
 * Function to get a route between an origin and a destination using Google Maps Routes API.
 *
 * @param {Object} args - Arguments for the route request.
 * @param {Object} args.origin - The origin address.
 * @param {string} args.origin.address - The starting address for the route.
 * @param {Object} args.destination - The destination address.
 * @param {string} args.destination.address - The ending address for the route.
 * @returns {Promise<Object>} - The result of the route request.
 */
const executeFunction = async ({ origin, destination }) => {
  const baseUrl = 'https://routes.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  const url = `${baseUrl}/directions/v2:computeRoutes`;
  
  const requestBody = {
    origin: { address: origin.address },
    destination: { address: destination.address }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Goog-FieldMask': '*',
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify(requestBody)
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
    console.error('Error getting route:', error);
    return {
      error: `An error occurred while getting the route: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting a route using Google Maps Routes API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_route',
      description: 'Get a route between an origin and a destination.',
      parameters: {
        type: 'object',
        properties: {
          origin: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'The starting address for the route.'
              }
            },
            required: ['address']
          },
          destination: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'The ending address for the route.'
              }
            },
            required: ['address']
          }
        },
        required: ['origin', 'destination']
      }
    }
  }
};

export { apiTool };