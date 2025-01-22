import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchForm, updateForm, fetchAllForms, saveForm } from './api';

const initialFields = [
  { id: "field-1", label: "Text Input", type: "text", placeholder: "Enter text", required: false, maxLength: "", minLength: "" },
  { id: "field-2", label: "Textarea", type: "textarea", placeholder: "Enter your message", required: false, maxLength: "", minLength: "" },
  { 
    id: "field-3", 
    label: "Select Dropdown", 
    type: "select", 
    options: ["Option 1", "Option 2", "Option 3"], 
    required: false 
  },
  { id: "field-4", label: "Checkbox", type: "checkbox", required: false },
  { id: "field-5", label: "Radio Button", type: "radio", options: ["Option A", "Option B"], required: false },
  { id: "field-6", label: "Date Picker", type: "date", required: false },
  { id: "field-7", label: "File Upload", type: "file", required: false },
];

const FormBuilder = () => {
  const [fields, setFields] = useState(initialFields);
  const [containerFields, setContainerFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [formList, setFormList] = useState([]);
  const [formId, setFormId] = useState(null);

  const inputRefs = useRef({});

  // Fetch all forms on component mount
  useEffect(() => {
    fetchAllForms().then((forms) => {
      setFormList(forms);
    });
  }, []);

  // Focus logic
  useEffect(() => {
    if (selectedField) {
      const inputElement = inputRefs.current[selectedField.id];
      if (inputElement && document.activeElement !== inputElement) {
        inputElement.focus();
      }
    }
  }, [selectedField]);

  // Handle drag end for fields
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === "fields" && destination.droppableId === "container") {
      const draggedField = fields[source.index];
      const newField = {
        ...draggedField,
        id: `${draggedField.id}-${Date.now()}`,
      };
      setContainerFields((prev) => [...prev, newField]);
    } else if (source.droppableId === "container" && destination.droppableId === "container") {
      const reorderedFields = Array.from(containerFields);
      const [moved] = reorderedFields.splice(source.index, 1);
      reorderedFields.splice(destination.index, 0, moved);
      setContainerFields(reorderedFields);
    } else if (source.droppableId === "container" && destination.droppableId === "fields") {
      const updatedContainerFields = Array.from(containerFields);
      updatedContainerFields.splice(source.index, 1);
      setContainerFields(updatedContainerFields);

      const removedField = containerFields[source.index];
      if (selectedField && selectedField.id === removedField.id) {
        setSelectedField(null);
      }
    }
  };

  // Update field in both fields and containerFields
  const handleFieldUpdate = (id, key, value) => {
    const updateFields = (fieldsList) =>
      fieldsList.map((field) =>
        field.id === id ? { ...field, [key]: key === "required" ? !field.required : value } : field
      );

    setFields(updateFields(fields));
    setContainerFields(updateFields(containerFields));
    setSelectedField((prev) => (prev?.id === id ? { ...prev, [key]: value } : prev));
  };

  // Field editor component for updating a field
  const FieldEditor = ({ field }) => {
    const [localField, setLocalField] = useState(field);

    const handleLocalChange = (key, value) => {
      setLocalField((prev) => ({ ...prev, [key]: value }));
      handleFieldUpdate(field.id, key, value);
    };

    return (
      <div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "10px" }}>
        <h4>Edit Field</h4>
        <label>
          Label:
          <input
            type="text"
            value={localField.label}
            onChange={(e) => handleLocalChange("label", e.target.value)}
          />
        </label>
        <br />
        {localField.type === "text" && (
          <>
            <label>
              Placeholder:
              <input
                type="text"
                value={localField.placeholder}
                onChange={(e) => handleLocalChange("placeholder", e.target.value)}
              />
            </label>
            <br />
            <label>
              Max Length:
              <input
                type="number"
                value={localField.maxLength}
                onChange={(e) => handleLocalChange("maxLength", e.target.value)}
              />
            </label>
            <br />
            <label>
              Min Length:
              <input
                type="number"
                value={localField.minLength}
                onChange={(e) => handleLocalChange("minLength", e.target.value)}
              />
            </label>
            <br />
          </>
        )}
        {localField.type === "textarea" && (
          <>
            <label>
              Placeholder:
              <input
                type="text"
                value={localField.placeholder}
                onChange={(e) => handleLocalChange("placeholder", e.target.value)}
              />
            </label>
            <br />
            <label>
              Max Length:
              <input
                type="number"
                value={localField.maxLength}
                onChange={(e) => handleLocalChange("maxLength", e.target.value)}
              />
            </label>
            <br />
            <label>
              Min Length:
              <input
                type="number"
                value={localField.minLength}
                onChange={(e) => handleLocalChange("minLength", e.target.value)}
              />
            </label>
            <br />
          </>
        )}
        {localField.type === "select" && (
          <>
            <label>
              Options (comma separated):
              <input
                type="text"
                value={localField.options.join(", ")}
                onChange={(e) =>
                  handleLocalChange("options", e.target.value.split(",").map((opt) => opt.trim()))
                }
              />
            </label>
            <br />
          </>
        )}
        {localField.type === "radio" && (
          <>
            <label>
              Options (comma separated):
              <input
                type="text"
                value={localField.options.join(", ")}
                onChange={(e) =>
                  handleLocalChange("options", e.target.value.split(",").map((opt) => opt.trim()))
                }
              />
            </label>
            <br />
          </>
        )}
        <label>
          Required:
          <input
            type="checkbox"
            checked={localField.required}
            onChange={() => handleLocalChange("required", !localField.required)}
          />
        </label>
      </div>
    );
  };

  // Floating Label Field Component
  const FloatingLabelField = React.forwardRef(({ field, onClick }, ref) => {
    const inputRef = useRef(null);
  
    useEffect(() => {
      inputRefs.current[field.id] = inputRef.current;
      console.log("Field reference updated:", field.id);
    }, [field.id]);
  
    const renderInput = () => {
      switch (field.type) {
        case "text":
        case "textarea":
          return (
            <input
              ref={inputRef}
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
              minLength={field.minLength}
              onClick={onClick}
              className="input-field"
              style={{
                padding: "10px",
                width: "100%",
                minWidth: "200px",
                transition: "all 0.2s",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          );
  
        case "select":
          return (
            <select
              ref={inputRef}
              id={field.id}
              required={field.required}
              onClick={onClick}
              style={{
                padding: "10px",
                width: "100%",
                minWidth: "200px",
                transition: "all 0.2s",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            >
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
  
        case "checkbox":
          return (
            <input
              ref={inputRef}
              id={field.id}
              type="checkbox"
              required={field.required}
              onClick={onClick}
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid #ccc",
              }}
            />
          );
  
        case "radio":
          return (
            <div>
              {field.options?.map((option, index) => (
                <label key={index}>
                  <input
                    ref={inputRef}
                    type="radio"
                    name={field.id}
                    value={option}
                    required={field.required}
                    onClick={onClick}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          );
  
        case "date":
          return (
            <input
              ref={inputRef}
              id={field.id}
              type="date"
              required={field.required}
              onClick={onClick}
              style={{
                padding: "10px",
                width: "100%",
                minWidth: "200px",
                transition: "all 0.2s",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          );
  
        case "file":
          return (
            <input
              ref={inputRef}
              id={field.id}
              type="file"
              required={field.required}
              onClick={onClick}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          );
  
        default:
          return null;
      }
    };
  
    return (
      <div style={{ position: "relative", marginBottom: "20px" }}>
        {renderInput()}
        <label
          htmlFor={field.id}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "16px",
            transition: "all 0.2s",
            transform: "translateY(-20px)",
            pointerEvents: "none",
            opacity: field.value || field.placeholder ? "0.7" : "1",
          }}
        >
          {field.label}
        </label>
      </div>
    );
  });  

  // Handle form submission
  const [formName, setFormName] = useState("");
  const handleSubmit = () => {
    const formData = containerFields.reduce((acc, field) => {
      const fieldElement = inputRefs.current[field.id];
      console.log("Container fields just before submission:", containerFields);
      console.log(`Field ${field.id} value:`, fieldElement);
      console.log(inputRefs.current)
      if (fieldElement) {
        acc[field.id] = fieldElement.value;
      }
      return acc;
    }, {});
  
    const payload = {
      form_name: formName,
      form_data: formData,
    };
  
    saveForm(formId, payload).then((response) => {
      console.log("Form submitted successfully", response);
    }).catch((error) => {
      console.log("Form data being submitted:", formData);
      console.error("Error submitting form", error);
    });
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h2>Form Builder</h2>
      <input
        type="text"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        placeholder="Enter Form Name"
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
  
      <select
        value={formId}
        onChange={(e) => {
          const selectedForm = formList.find((form) => form.id === e.target.value);
          setFormId(selectedForm?.id);
          setContainerFields(selectedForm?.form_data || []);
        }}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      >
        <option value="">Select Form</option>
        {formList.map((form) => (
          <option key={form.id} value={form.id}>
            {form.form_name}
          </option>
        ))}
      </select>
  
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: "45%",
                  minHeight: "400px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <h3>Available Fields</h3>
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          padding: "10px",
                          margin: "10px 0",
                          background: "#f9f9f9",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "move",
                        }}
                      >
                        {field.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
  
          <Droppable droppableId="container">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: "45%",
                  minHeight: "400px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <h3>Form Builder</h3>
                {containerFields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setSelectedField(field)}
                        style={{
                          ...provided.draggableProps.style,
                          padding: "10px",
                          margin: "10px 0",
                          background: "#f9f9f9",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {field.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
  
      {selectedField && <FieldEditor field={selectedField} />}
  
      <button onClick={handleSubmit} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Submit Form
      </button>
    </div>
  );
};

export default FormBuilder;
