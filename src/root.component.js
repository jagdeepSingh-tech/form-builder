import React, { useState } from "react";
import Header from "./components/Header/Header";
import FieldPalette from "./components/FieldPalette/FieldPalette";
import FormCanvas from "./components/FormCanvas/FormCanvas";
import FieldSettings from "./components/FieldSettings/FieldSettings";
import { saveForm, updateForm } from "./services/formService";
import "./root.component.css";

export default function Root(props) {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFormId, setSavedFormId] = useState(null);

  const handleAddField = (type) => {
    const newField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: "",
      placeholder: "",
      required: false,
      ...(type === "select" ? { options: ["Option 1"] } : {}),
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId);
  };

  const handleDeleteField = (fieldId) => {
    const newFields = fields.filter((f) => f.id !== fieldId);
    setFields(newFields);
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleUpdateFields = (updatedFields) => {
    setFields(updatedFields);
  };

  const handleSave = async () => {
    if (fields.length === 0) {
      alert("Please add at least one field to save the form.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = {
        fields,
        metadata: {
          fieldCount: fields.length,
        },
      };

      let formId;
      if (savedFormId) {
        // Update existing form
        await updateForm(savedFormId, formData);
        formId = savedFormId;
      } else {
        // Save new form
        formId = await saveForm(formData);
        setSavedFormId(formId);
      }

      alert(`Form ${savedFormId ? "updated" : "saved"} successfully! Form ID: ${formId}`);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please check your Firebase configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="root-container">
      <Header onSave={handleSave} isSaving={isSaving} />
      <div className="root-layout">
        <FieldPalette onAddField={handleAddField} />
        <FormCanvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={handleSelectField}
          onDeleteField={handleDeleteField}
        />
        <FieldSettings
          selectedField={selectedFieldId}
          fields={fields}
          onUpdate={handleUpdateFields}
        />
      </div>
    </div>
  );
}
