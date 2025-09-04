/**
 * Function to render a video for a specified address using the Google Maps Platform.
 *
 * @param {Object} args - Arguments for the video rendering.
 * @param {string} args.address - The postal address for which the aerial view video is requested.
 * @returns {Promise<Object>} - The result of the video rendering request.
 */
const executeFunction = async ({ address }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  const url = `${baseUrl}/v1/videos:renderVideo?key=${apiKey}`;
  
  const requestBody = {
    address: address
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
    console.error('Error rendering video:', error);
    return {
      error: `An error occurred while rendering the video: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for rendering videos using the Google Maps Platform.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'render_video',
      description: 'Render a video for a specified address using the Google Maps Platform.',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'The postal address for which the aerial view video is requested.'
          }
        },
        required: ['address']
      }
    }
  }
};

export { apiTool };