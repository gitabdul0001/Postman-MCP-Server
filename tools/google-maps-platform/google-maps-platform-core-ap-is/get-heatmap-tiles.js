/**
 * Function to get heatmap tiles from the Google Maps Platform.
 *
 * @param {Object} args - Arguments for the heatmap tile request.
 * @param {string} args.mapType - The type of map to request (e.g., "GRASS_UPI").
 * @param {number} args.x - The X coordinate of the tile.
 * @param {number} args.y - The Y coordinate of the tile.
 * @param {number} args.zoom - The zoom level for the tile.
 * @returns {Promise<Object>} - The response containing the heatmap tile data.
 */
const executeFunction = async ({ mapType, x, y, zoom }) => {
  const baseUrl = 'https://pollen.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL for the heatmap tile request
    const url = `${baseUrl}/v1/mapTypes/${mapType}/heatmapTiles/${zoom}/${x}/${y}?key=${apiKey}`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET'
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error fetching heatmap tiles:', error);
    return {
      error: `An error occurred while fetching heatmap tiles: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting heatmap tiles from Google Maps Platform.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_heatmap_tiles',
      description: 'Get heatmap tiles from Google Maps Platform.',
      parameters: {
        type: 'object',
        properties: {
          mapType: {
            type: 'string',
            description: 'The type of map to request (e.g., "GRASS_UPI").'
          },
          x: {
            type: 'integer',
            description: 'The X coordinate of the tile.'
          },
          y: {
            type: 'integer',
            description: 'The Y coordinate of the tile.'
          },
          zoom: {
            type: 'integer',
            description: 'The zoom level for the tile.'
          }
        },
        required: ['mapType', 'x', 'y', 'zoom']
      }
    }
  }
};

export { apiTool };