import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const inputRefs = useRef({});

  // Focus logic
  useEffect(() => {
    if (selectedField) {
      const inputElement = inputRefs.current[selectedField.id];
      if (inputElement) {
        // Ensuring that we focus the input only if it's not already focused
        if (document.activeElement !== inputElement) {
          inputElement.focus();
        }
      }
    }
  }, [selectedField]); // Only trigger focus when selectedField changes

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

  const handleFieldUpdate = (id, key, value) => {
    const updateFields = (fieldsList) =>
      fieldsList.map((field) =>
        field.id === id ? { ...field, [key]: key === "required" ? !field.required : value } : field
      );

    setFields(updateFields(fields));
    setContainerFields(updateFields(containerFields));
    setSelectedField((prev) => (prev?.id === id ? { ...prev, [key]: value } : prev));
  };

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

  const FloatingLabelField = React.forwardRef(({ field, onClick }, ref) => {
    return (
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          ref={ref}
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

  return (
    <div>
      <h2>Form Builder</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              ref={provided.innerRef}
              style={{ padding: "10px", backgroundColor: "#f4f4f4", borderRadius: "5px" }}
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        margin: "10px 0",
                        padding: "10px",
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <div
                        onClick={() => setSelectedField(field)}
                        style={{ cursor: "pointer", marginBottom: "10px" }}
                      >
                        {field.label}
                      </div>
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
              style={{ padding: "10px", backgroundColor: "#e9e9e9", borderRadius: "5px" }}
            >
              {containerFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        margin: "10px 0",
                        padding: "10px",
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <FloatingLabelField
                        ref={(ref) => {
                          if (field.id === selectedField?.id) {
                            inputRefs.current[field.id] = ref;
                          }
                        }}
                        field={field}
                        onClick={() => setSelectedField(field)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedField && (
        <FieldEditor field={selectedField} />
      )}
    </div>
  );
};

export default FormBuilder;
