import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Function to fetch all forms
export const fetchAllForms = async () => {
  try {
    const response = await axios.get(`${API_URL}/forms/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
};

// Function to fetch a specific form
export const fetchForm = async (formId) => {
  try {
    const response = await axios.get(`${API_URL}/forms/${formId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching form:", error);
    throw error;
  }
};

// Function to save a form
export const saveForm = async (formId, formData) => {
  try {
    const response = await axios.post(`${API_URL}/forms/${formId}/submit`, formData);
    return response.data;
  } catch (error) {
    console.error("Error saving form:", error);
    throw error;
  }
};

// Function to update a form
export const updateForm = async (formId, formData) => {
  try {
    const response = await axios.put(`${API_URL}/forms/${formId}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating form:", error);
    throw error;
  }
};
