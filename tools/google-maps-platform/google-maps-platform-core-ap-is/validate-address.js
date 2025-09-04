/**
 * Function to validate an address using the Google Maps Address Validation API.
 *
 * @param {Object} args - Arguments for the address validation.
 * @param {string} args.regionCode - The region code of the address (e.g., "US").
 * @param {string} args.locality - The locality of the address (e.g., "Mountain View").
 * @param {Array<string>} args.addressLines - The address lines of the address (e.g., ["1600 Amphitheatre Pkwy"]).
 * @returns {Promise<Object>} - The result of the address validation.
 */
const executeFunction = async ({ regionCode, locality, addressLines }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  const url = `${baseUrl}/addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;
  
  const requestBody = {
    address: {
      regionCode,
      locality,
      addressLines
    }
  };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    console.error('Error validating address:', error);
    return {
      error: `An error occurred while validating the address: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for validating addresses using the Google Maps Address Validation API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'validate_address',
      description: 'Validate an address using the Google Maps Address Validation API.',
      parameters: {
        type: 'object',
        properties: {
          regionCode: {
            type: 'string',
            description: 'The region code of the address (e.g., "US").'
          },
          locality: {
            type: 'string',
            description: 'The locality of the address (e.g., "Mountain View").'
          },
          addressLines: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The address lines of the address (e.g., ["1600 Amphitheatre Pkwy"]).'
          }
        },
        required: ['regionCode', 'locality', 'addressLines']
      }
    }
  }
};

export { apiTool };