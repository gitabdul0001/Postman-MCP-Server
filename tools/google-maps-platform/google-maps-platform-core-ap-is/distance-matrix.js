/**
 * Function to calculate the distance matrix using Google Maps Distance Matrix API.
 *
 * @param {Object} args - Arguments for the distance matrix calculation.
 * @param {string} args.origins - The starting point(s) for calculating travel distance and time.
 * @param {string} args.destinations - The finishing point(s) for calculating travel distance and time.
 * @param {string} [args.mode='driving'] - The transportation mode to use for the calculation.
 * @param {string} [args.units='metric'] - The unit system to use when displaying results.
 * @param {string} [args.language='en'] - The language in which to return results.
 * @param {number} [args.departure_time] - The desired time of departure.
 * @param {number} [args.arrival_time] - The desired time of arrival.
 * @param {string} [args.avoid] - Restrictions to avoid certain routes (e.g., tolls, highways).
 * @param {string} [args.region='en'] - The region code for the results.
 * @param {string} [args.traffic_model='best_guess'] - Assumptions to use when calculating time in traffic.
 * @param {string} [args.transit_mode] - Preferred modes of transit for transit directions.
 * @param {string} [args.transit_routing_preference] - Preferences for transit routes.
 * @returns {Promise<Object>} - The result of the distance matrix calculation.
 */
const executeFunction = async ({
  origins,
  destinations,
  mode = 'driving',
  units = 'metric',
  language = 'en',
  departure_time,
  arrival_time,
  avoid,
  region = 'en',
  traffic_model = 'best_guess',
  transit_mode,
  transit_routing_preference
}) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('origins', origins);
    url.searchParams.append('destinations', destinations);
    url.searchParams.append('mode', mode);
    url.searchParams.append('units', units);
    url.searchParams.append('language', language);
    if (departure_time) url.searchParams.append('departure_time', departure_time);
    if (arrival_time) url.searchParams.append('arrival_time', arrival_time);
    if (avoid) url.searchParams.append('avoid', avoid);
    if (region) url.searchParams.append('region', region);
    if (traffic_model) url.searchParams.append('traffic_model', traffic_model);
    if (transit_mode) url.searchParams.append('transit_mode', transit_mode);
    if (transit_routing_preference) url.searchParams.append('transit_routing_preference', transit_routing_preference);
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
    console.error('Error calculating distance matrix:', error);
    return {
      error: `An error occurred while calculating the distance matrix: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for calculating the distance matrix using Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'distance_matrix',
      description: 'Calculate the distance matrix using Google Maps Distance Matrix API.',
      parameters: {
        type: 'object',
        properties: {
          origins: {
            type: 'string',
            description: 'The starting point(s) for calculating travel distance and time.'
          },
          destinations: {
            type: 'string',
            description: 'The finishing point(s) for calculating travel distance and time.'
          },
          mode: {
            type: 'string',
            enum: ['driving', 'walking', 'bicycling', 'transit'],
            description: 'The transportation mode to use for the calculation.'
          },
          units: {
            type: 'string',
            description: 'The unit system to use when displaying results.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          departure_time: {
            type: 'number',
            description: 'The desired time of departure.'
          },
          arrival_time: {
            type: 'number',
            description: 'The desired time of arrival.'
          },
          avoid: {
            type: 'string',
            description: 'Restrictions to avoid certain routes.'
          },
          region: {
            type: 'string',
            description: 'The region code for the results.'
          },
          traffic_model: {
            type: 'string',
            description: 'Assumptions to use when calculating time in traffic.'
          },
          transit_mode: {
            type: 'string',
            description: 'Preferred modes of transit for transit directions.'
          },
          transit_routing_preference: {
            type: 'string',
            description: 'Preferences for transit routes.'
          }
        },
        required: ['origins', 'destinations']
      }
    }
  }
};

export { apiTool };