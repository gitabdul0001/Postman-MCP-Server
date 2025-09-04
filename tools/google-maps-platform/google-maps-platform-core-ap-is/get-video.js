/**
 * Function to get video URIs from the Google Aerial View API.
 *
 * @param {Object} args - Arguments for the video lookup.
 * @param {string} args.videoId - The ID of the video to look up.
 * @returns {Promise<Object>} - The result of the video lookup containing URIs.
 */
const executeFunction = async ({ videoId }) => {
  const baseUrl = 'https://aerialview.googleapis.com/v1/videos:lookupVideo';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('videoId', videoId);

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(`${url.toString()}?key=${apiKey}`, {
      method: 'GET',
      headers
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
    console.error('Error retrieving video:', error);
    return {
      error: `An error occurred while retrieving the video: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving video URIs from the Google Aerial View API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_video',
      description: 'Retrieve video URIs from the Google Aerial View API.',
      parameters: {
        type: 'object',
        properties: {
          videoId: {
            type: 'string',
            description: 'The ID of the video to look up.'
          }
        },
        required: ['videoId']
      }
    }
  }
};

export { apiTool };