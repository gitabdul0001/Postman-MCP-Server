/**
 * Function to provide validation feedback to the Google Address Validation API.
 *
 * @param {Object} args - Arguments for providing validation feedback.
 * @param {string} args.conclusion - The conclusion of the validation (e.g., "USER_VERSION_USED").
 * @param {string} args.responseId - The response ID from the address validation request.
 * @returns {Promise<Object>} - The result of the validation feedback submission.
 */
const executeFunction = async ({ conclusion, responseId }) => {
  const baseUrl = 'https://addressvalidation.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL for the API endpoint
    const url = `${baseUrl}/v1:provideValidationFeedback?key=${apiKey}`;

    // Prepare the request body
    const body = JSON.stringify({
      conclusion,
      responseId
    });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
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
    console.error('Error providing validation feedback:', error);
    return {
      error: `An error occurred while providing validation feedback: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for providing validation feedback to the Google Address Validation API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'provide_validation_feedback',
      description: 'Provide validation feedback to the Google Address Validation API.',
      parameters: {
        type: 'object',
        properties: {
          conclusion: {
            type: 'string',
            description: 'The conclusion of the validation.'
          },
          responseId: {
            type: 'string',
            description: 'The response ID from the address validation request.'
          }
        },
        required: ['conclusion', 'responseId']
      }
    }
  }
};

export { apiTool };