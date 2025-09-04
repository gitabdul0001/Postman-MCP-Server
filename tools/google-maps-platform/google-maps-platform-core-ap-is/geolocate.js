/**
 * Function to geolocate using the Google Maps Geolocation API.
 *
 * @param {Object} args - Arguments for the geolocation request.
 * @param {Array} args.cellTowers - An array of cell tower information.
 * @param {Array} args.wifiAccessPoints - An array of WiFi access point information.
 * @param {boolean} [args.considerIp=false] - Whether to consider the IP address for geolocation.
 * @returns {Promise<Object>} - The result of the geolocation request.
 */
const executeFunction = async ({ cellTowers, wifiAccessPoints, considerIp = false }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  const url = `${baseUrl}/geolocation/v1/geolocate?key=${apiKey}`;

  const requestBody = {
    considerIp,
    cellTowers,
    wifiAccessPoints
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
    console.error('Error geolocating:', error);
    return {
      error: `An error occurred while geolocating: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for geolocating using the Google Maps Geolocation API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'geolocate',
      description: 'Geolocate using the Google Maps Geolocation API.',
      parameters: {
        type: 'object',
        properties: {
          cellTowers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                cellId: { type: 'integer' },
                locationAreaCode: { type: 'integer' },
                mobileCountryCode: { type: 'integer' },
                mobileNetworkCode: { type: 'integer' },
                age: { type: 'integer' },
                signalStrength: { type: 'number' },
                timingAdvance: { type: 'number' }
              },
              required: ['cellId', 'locationAreaCode', 'mobileCountryCode', 'mobileNetworkCode']
            },
            description: 'An array of cell tower information.'
          },
          wifiAccessPoints: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                macAddress: { type: 'string' },
                signalStrength: { type: 'integer' },
                signalToNoiseRatio: { type: 'integer' },
                age: { type: 'integer' },
                channel: { type: 'integer' }
              },
              required: ['macAddress', 'signalStrength']
            },
            description: 'An array of WiFi access point information.'
          },
          considerIp: {
            type: 'boolean',
            description: 'Whether to consider the IP address for geolocation.'
          }
        },
        required: ['cellTowers', 'wifiAccessPoints']
      }
    }
  }
};

export { apiTool };