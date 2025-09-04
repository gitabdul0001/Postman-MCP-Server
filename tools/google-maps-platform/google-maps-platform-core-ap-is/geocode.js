/**
 * Function to geocode an address using the Google Maps Geocoding API.
 *
 * @param {Object} args - Arguments for the geocoding request.
 * @param {string} args.address - The street address or plus code to geocode.
 * @param {string} [args.bounds] - The bounding box of the viewport to bias geocode results.
 * @param {string} [args.components] - A components filter for the geocoding request.
 * @param {string} [args.latlng] - The latitude and longitude to reverse geocode.
 * @param {string} [args.place_id] - A place ID to retrieve the address for.
 * @param {string} [args.language='en'] - The language in which to return results.
 * @param {string} [args.region='en'] - The region code for the results.
 * @returns {Promise<Object>} - The result of the geocoding request.
 */
const executeFunction = async ({ address, bounds, components, latlng, place_id, language = 'en', region = 'en' }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/geocode/json`);
    url.searchParams.append('address', address);
    if (bounds) url.searchParams.append('bounds', bounds);
    if (components) url.searchParams.append('components', components);
    if (latlng) url.searchParams.append('latlng', latlng);
    if (place_id) url.searchParams.append('place_id', place_id);
    url.searchParams.append('language', language);
    url.searchParams.append('region', region);
    url.searchParams.append('key', apiKey);

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
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
    console.error('Error geocoding address:', error);
    return {
      error: `An error occurred while geocoding the address: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for geocoding addresses using the Google Maps Geocoding API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'geocode_address',
      description: 'Geocode an address using the Google Maps Geocoding API.',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'The street address or plus code to geocode.'
          },
          bounds: {
            type: 'string',
            description: 'The bounding box of the viewport to bias geocode results.'
          },
          components: {
            type: 'string',
            description: 'A components filter for the geocoding request.'
          },
          latlng: {
            type: 'string',
            description: 'The latitude and longitude to reverse geocode.'
          },
          place_id: {
            type: 'string',
            description: 'A place ID to retrieve the address for.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          region: {
            type: 'string',
            description: 'The region code for the results.'
          }
        },
        required: ['address']
      }
    }
  }
};

export { apiTool };