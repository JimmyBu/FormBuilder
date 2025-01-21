import axios from 'axios';

// Save Form
export const saveForm = async (formData) => {
  try {
    const response = await axios.post('/api/save-form', formData);
    return response.data;  // Make sure the data is returned
  } catch (error) {
    console.error(error);
    throw error;  // Rethrow error if needed
  }
};

// Get Forms
export const getForms = async () => {
  try {
    const response = await axios.get('/api/get-forms');
    return response.data;  // Return the data received from the API
  } catch (error) {
    console.error(error);
    throw error;  // Rethrow error if needed
  }
};
