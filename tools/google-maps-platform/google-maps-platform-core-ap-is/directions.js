/**
 * Function to get directions using the Google Maps Directions API.
 *
 * @param {Object} args - Arguments for the directions request.
 * @param {string} args.origin - The starting point for the directions (place ID, address, or lat/lng).
 * @param {string} args.destination - The endpoint for the directions (place ID, address, or lat/lng).
 * @param {string} [args.mode='driving'] - The mode of transportation (driving, walking, bicycling, transit).
 * @param {string} [args.language='en'] - The language of the results.
 * @param {string} [args.units='metric'] - The unit system for displaying results (metric or imperial).
 * @param {number} [args.departure_time] - The desired departure time in seconds since epoch.
 * @param {number} [args.arrival_time] - The desired arrival time in seconds since epoch.
 * @param {boolean} [args.alternatives=false] - Whether to return alternative routes.
 * @param {string} [args.avoid] - Features to avoid (e.g., tolls, highways).
 * @param {string} [args.waypoints] - Intermediate locations to include along the route.
 * @param {string} [args.region] - The region code for the results.
 * @param {string} [args.traffic_model='best_guess'] - Assumptions for calculating time in traffic.
 * @returns {Promise<Object>} - The result of the directions request.
 */
const executeFunction = async ({ origin, destination, mode = 'driving', language = 'en', units = 'metric', departure_time, arrival_time, alternatives = false, avoid, waypoints, region, traffic_model = 'best_guess' }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/directions/json`);
    url.searchParams.append('origin', origin);
    url.searchParams.append('destination', destination);
    url.searchParams.append('mode', mode);
    url.searchParams.append('language', language);
    url.searchParams.append('units', units);
    if (departure_time) url.searchParams.append('departure_time', departure_time);
    if (arrival_time) url.searchParams.append('arrival_time', arrival_time);
    if (alternatives) url.searchParams.append('alternatives', alternatives);
    if (avoid) url.searchParams.append('avoid', avoid);
    if (waypoints) url.searchParams.append('waypoints', waypoints);
    if (region) url.searchParams.append('region', region);
    if (traffic_model) url.searchParams.append('traffic_model', traffic_model);
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
    console.error('Error fetching directions:', error);
    return {
      error: `An error occurred while fetching directions: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting directions using the Google Maps Directions API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_directions',
      description: 'Get directions between two locations using the Google Maps Directions API.',
      parameters: {
        type: 'object',
        properties: {
          origin: {
            type: 'string',
            description: 'The starting point for the directions (place ID, address, or lat/lng).'
          },
          destination: {
            type: 'string',
            description: 'The endpoint for the directions (place ID, address, or lat/lng).'
          },
          mode: {
            type: 'string',
            enum: ['driving', 'walking', 'bicycling', 'transit'],
            description: 'The mode of transportation.'
          },
          language: {
            type: 'string',
            description: 'The language of the results.'
          },
          units: {
            type: 'string',
            enum: ['metric', 'imperial'],
            description: 'The unit system for displaying results.'
          },
          departure_time: {
            type: 'number',
            description: 'The desired departure time in seconds since epoch.'
          },
          arrival_time: {
            type: 'number',
            description: 'The desired arrival time in seconds since epoch.'
          },
          alternatives: {
            type: 'boolean',
            description: 'Whether to return alternative routes.'
          },
          avoid: {
            type: 'string',
            description: 'Features to avoid (e.g., tolls, highways).'
          },
          waypoints: {
            type: 'string',
            description: 'Intermediate locations to include along the route.'
          },
          region: {
            type: 'string',
            description: 'The region code for the results.'
          },
          traffic_model: {
            type: 'string',
            description: 'Assumptions for calculating time in traffic.'
          }
        },
        required: ['origin', 'destination']
      }
    }
  }
};

export { apiTool };