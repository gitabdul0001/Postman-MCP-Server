/**
 * Function to perform a text search for places using the Google Maps Places API.
 *
 * @param {Object} args - Arguments for the text search.
 * @param {string} args.textQuery - The text query to search for places (required).
 * @param {string} [args.includedType] - Optional type to include in the search.
 * @param {string} [args.languageCode] - Optional language code for the search.
 * @param {Object} [args.locationBias] - Optional location bias for the search.
 * @param {Object} [args.locationRestriction] - Optional location restriction for the search.
 * @param {Object} [args.evOptions] - Optional options for electric vehicle charging stations.
 * @param {boolean} [args.minRating] - Optional minimum rating for the places.
 * @param {boolean} [args.openNow] - Optional flag to filter for places that are currently open.
 * @param {number} [args.pageSize] - Optional number of results to return per page.
 * @param {string} [args.pageToken] - Optional token for pagination.
 * @param {Array} [args.priceLevels] - Optional array of price levels to filter by.
 * @param {string} [args.rankPreference] - Optional preference for ranking results.
 * @param {string} [args.regionCode] - Optional region code for the search.
 * @param {string} [args.strictTypeFiltering] - Optional flag for strict type filtering.
 * @returns {Promise<Object>} - The result of the text search.
 */
const executeFunction = async ({
  textQuery,
  includedType,
  languageCode,
  locationBias,
  locationRestriction,
  evOptions,
  minRating,
  openNow,
  pageSize,
  pageToken,
  priceLevels,
  rankPreference,
  regionCode,
  strictTypeFiltering
}) => {
  const baseUrl = 'https://places.googleapis.com/v1/places:searchText';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  const requestBody = {
    textQuery,
    includedType,
    languageCode,
    locationBias,
    locationRestriction,
    evOptions,
    minRating,
    openNow,
    pageSize,
    pageToken,
    priceLevels,
    rankPreference,
    regionCode,
    strictTypeFiltering
  };

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': '*',
      'X-Goog-Api-Key': apiKey
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
    console.error('Error performing text search:', error);
    return {
      error: `An error occurred while performing the text search: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for performing a text search using the Google Maps Places API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'text_search_places',
      description: 'Perform a text search for places using the Google Maps Places API.',
      parameters: {
        type: 'object',
        properties: {
          textQuery: {
            type: 'string',
            description: 'The text query to search for places.'
          },
          includedType: {
            type: 'string',
            description: 'Optional type to include in the search.'
          },
          languageCode: {
            type: 'string',
            description: 'Optional language code for the search.'
          },
          locationBias: {
            type: 'object',
            description: 'Optional location bias for the search.'
          },
          locationRestriction: {
            type: 'object',
            description: 'Optional location restriction for the search.'
          },
          evOptions: {
            type: 'object',
            description: 'Optional options for electric vehicle charging stations.'
          },
          minRating: {
            type: 'boolean',
            description: 'Optional minimum rating for the places.'
          },
          openNow: {
            type: 'boolean',
            description: 'Optional flag to filter for places that are currently open.'
          },
          pageSize: {
            type: 'integer',
            description: 'Optional number of results to return per page.'
          },
          pageToken: {
            type: 'string',
            description: 'Optional token for pagination.'
          },
          priceLevels: {
            type: 'array',
            description: 'Optional array of price levels to filter by.'
          },
          rankPreference: {
            type: 'string',
            description: 'Optional preference for ranking results.'
          },
          regionCode: {
            type: 'string',
            description: 'Optional region code for the search.'
          },
          strictTypeFiltering: {
            type: 'string',
            description: 'Optional flag for strict type filtering.'
          }
        },
        required: ['textQuery']
      }
    }
  }
};

export { apiTool };