/**
 * Function to compute insights for places using Google Maps API.
 *
 * @param {Object} args - Arguments for the insights computation.
 * @param {Array<string>} args.insights - The list of insights to compute.
 * @param {Object} args.filter - The filter object to restrict results.
 * @param {Object} args.filter.locationFilter - The location filter to restrict results.
 * @param {Object} args.filter.locationFilter.circle - A circle defined by a center point and radius.
 * @param {Object} args.filter.locationFilter.circle.latLng - The latitude and longitude of the center point.
 * @param {number} args.filter.locationFilter.circle.latLng.latitude - Latitude of the center point.
 * @param {number} args.filter.locationFilter.circle.latLng.longitude - Longitude of the center point.
 * @param {number} args.filter.locationFilter.circle.radius - Radius in meters.
 * @param {Object} args.filter.typeFilter - The type filter for places.
 * @param {Array<string>} args.filter.typeFilter.includedTypes - Types to include.
 * @param {Array<string>} args.filter.typeFilter.excludedTypes - Types to exclude.
 * @returns {Promise<Object>} - The result of the insights computation.
 */
const executeFunction = async ({ insights, filter }) => {
  const baseUrl = 'https://areainsights.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    const url = `${baseUrl}/v1:computeInsights`;
    
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey
    };

    // Prepare the request body
    const body = JSON.stringify({ insights, filter });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
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
    console.error('Error computing insights:', error);
    return {
      error: `An error occurred while computing insights: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for computing insights using Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'compute_insights',
      description: 'Compute insights for places using Google Maps API.',
      parameters: {
        type: 'object',
        properties: {
          insights: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The list of insights to compute.'
          },
          filter: {
            type: 'object',
            properties: {
              locationFilter: {
                type: 'object',
                properties: {
                  circle: {
                    type: 'object',
                    properties: {
                      latLng: {
                        type: 'object',
                        properties: {
                          latitude: {
                            type: 'number',
                            description: 'Latitude of the center point.'
                          },
                          longitude: {
                            type: 'number',
                            description: 'Longitude of the center point.'
                          }
                        },
                        required: ['latitude', 'longitude']
                      },
                      radius: {
                        type: 'number',
                        description: 'Radius in meters.'
                      }
                    },
                    required: ['latLng', 'radius']
                  }
                },
                required: ['circle']
              },
              typeFilter: {
                type: 'object',
                properties: {
                  includedTypes: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    description: 'Types to include.'
                  },
                  excludedTypes: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    description: 'Types to exclude.'
                  }
                },
                required: ['includedTypes']
              }
            },
            required: ['locationFilter', 'typeFilter']
          }
        },
        required: ['insights', 'filter']
      }
    }
  }
};

export { apiTool };