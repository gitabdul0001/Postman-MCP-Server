/**
 * Function to compute insights using the Google Maps Places Aggregate API.
 *
 * @param {Object} args - Arguments for the insights computation.
 * @param {Array<string>} args.insights - The types of insights to retrieve (e.g., INSIGHT_COUNT, INSIGHT_PLACES).
 * @param {Object} args.filter - The filter criteria for the insights.
 * @param {Object} args.filter.locationFilter - The location filter for the insights.
 * @param {Object} args.filter.typeFilter - The type filter for the insights.
 * @returns {Promise<Object>} - The result of the insights computation.
 */
const executeFunction = async ({ insights, filter }) => {
  const baseUrl = 'https://areainsights.googleapis.com/v1:computeInsights';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  const requestBody = {
    insights,
    filter
  };

  try {
    // Set up headers for the request
    const headers = {
      'X-Goog-Api-Key': apiKey,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
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
    console.error('Error computing insights:', error);
    return {
      error: `An error occurred while computing insights: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for computing insights using the Google Maps Places Aggregate API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'compute_insights',
      description: 'Compute insights about areas using the Google Maps Places Aggregate API.',
      parameters: {
        type: 'object',
        properties: {
          insights: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['INSIGHT_COUNT', 'INSIGHT_PLACES'],
              description: 'The types of insights to retrieve.'
            },
            description: 'The types of insights to retrieve.'
          },
          filter: {
            type: 'object',
            properties: {
              locationFilter: {
                type: 'object',
                description: 'The location filter for the insights.'
              },
              typeFilter: {
                type: 'object',
                description: 'The type filter for the insights.'
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