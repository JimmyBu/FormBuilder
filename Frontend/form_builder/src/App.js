import React, { useState, useEffect } from "react";
import FormBuilder from "./form_builder";
import { saveForm, getForms } from './api';

const App = () => {
  const [fields, setFields] = useState([
    { id: 'field-1', label: 'First Name' },
    { id: 'field-2', label: 'Email' },
    { id: 'field-3', label: 'Date of Birth' },
  ]);
  const [forms, setForms] = useState([]);

  // Fetch the saved forms when the component mounts
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await getForms();
        setForms(fetchedForms);  // Save the fetched forms in state
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []); // Empty dependency array means it runs only once, on component mount

  const handleSaveForm = async () => {
    try {
      const formData = {
        title: "My Custom Form",  // Add form metadata if needed
        fields: fields,  // Send the form fields to the backend
      };
      const result = await saveForm(formData);
      console.log('Form saved:', result);
      alert('Form saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save form');
    }
  };

  return (
    <div>
      <h1>Form Builder</h1>
      <FormBuilder
        fields={fields}
        setFields={setFields}
        saveForm={handleSaveForm}  // Pass the save function to FormBuilder
      />
      <button onClick={handleSaveForm}>Save Form</button>

      <h2>Saved Forms</h2>
      <ul>
        {forms.map((form, index) => (
          <li key={index}>{form.title}</li>  // Assuming forms have a 'title' property
        ))}
      </ul>
    </div>
  );
};

export default App;
