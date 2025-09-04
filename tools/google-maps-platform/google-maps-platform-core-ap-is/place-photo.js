/**
 * Function to retrieve a place photo from the Google Maps API.
 *
 * @param {Object} args - Arguments for the photo retrieval.
 * @param {string} args.photo_reference - A string identifier that uniquely identifies a photo.
 * @param {number} [args.maxheight] - Specifies the maximum desired height, in pixels, of the image.
 * @param {number} [args.maxwidth] - Specifies the maximum desired width, in pixels, of the image.
 * @returns {Promise<Buffer>} - The image data of the place photo.
 */
const executeFunction = async ({ photo_reference, maxheight, maxwidth }) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('photo_reference', photo_reference);
    if (maxheight) url.searchParams.append('maxheight', maxheight.toString());
    if (maxwidth) url.searchParams.append('maxwidth', maxwidth.toString());
    url.searchParams.append('key', apiKey);

    // Set up headers for the request
    const headers = {
      'Accept': 'image/*'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Return the image data as a Buffer
    const imageBuffer = await response.buffer();
    return imageBuffer;
  } catch (error) {
    console.error('Error retrieving place photo:', error);
    throw new Error(`An error occurred while retrieving the place photo: ${error.message}`);
  }
};

/**
 * Tool configuration for retrieving place photos from the Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_place_photo',
      description: 'Retrieve a place photo from the Google Maps API.',
      parameters: {
        type: 'object',
        properties: {
          photo_reference: {
            type: 'string',
            description: 'A string identifier that uniquely identifies a photo.'
          },
          maxheight: {
            type: 'integer',
            description: 'Specifies the maximum desired height, in pixels, of the image.'
          },
          maxwidth: {
            type: 'integer',
            description: 'Specifies the maximum desired width, in pixels, of the image.'
          }
        },
        required: ['photo_reference']
      }
    }
  }
};

export { apiTool };