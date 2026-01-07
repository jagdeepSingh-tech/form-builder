import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import FieldPalette from "./components/FieldPalette/FieldPalette";
import FormCanvas from "./components/FormCanvas/FormCanvas";
import FieldSettings from "./components/FieldSettings/FieldSettings";
import FormMeta from "./components/FormMeta/FormMeta";
import { saveForm, updateForm } from "./services/formService";
import { createField } from "./services/fieldFactory";
import { normalizeForm } from "./models/formSchema";
import "./root.component.css";

export default function Root(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (!props || !props.formToEdit) return;

    const form = props.formToEdit;
    setEditingFormId(form.id || null);
    setTitle(form.title || "");
    setDescription(form.description || "");

    const incomingFields = Array.isArray(form.fields) ? form.fields : [];
    setFields(incomingFields);

    if (incomingFields.length) {
      setSelectedFieldId(incomingFields[0].id);
    }
  }, [props.formToEdit]);

  const handleAddField = (type) => {
    const newField = createField(type);
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setValidationError(null);
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
    setValidationError(null);
  };

  const handleUpdateFields = (updatedFields) => {
    setFields(updatedFields);
    setValidationError(null);
  };

  const validateForm = () => {
    if (!title || title.trim() === "") return "Form title is required";

    if (fields.length === 0) return "Please add at least one field";

    for (let index = 0; index < fields.length; index += 1) {
      const field = fields[index];
      if (!field.label || field.label.trim() === "") {
        return "Each field must have a label";
      }

      if (field.type === "select" && (!field.options || field.options.length < 2)) {
        return "Select fields must have at least two options";
      }
    }

    return null;
  };

  const isFormValid = validateForm() === null;

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSaving(true);
    try {
      const formData = normalizeForm({ title, description, fields });

      let formId;
      if (editingFormId) {
        await updateForm(editingFormId, formData);
        formId = editingFormId;
      } else {
        formId = await saveForm(formData);
        setEditingFormId(formId);
      }

      alert(`Form ${editingFormId ? "updated" : "saved"} successfully! Form ID: ${formId}`);
      setValidationError(null);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please check your Firebase configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="root-container">
      <Header onSave={handleSave} isSaving={isSaving} isFormValid={isFormValid} />
      {validationError && <div className="root-alert">{validationError}</div>}
      <FormMeta
        title={title}
        description={description}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
      />
      <div className="root-layout">
        <div className="left-panel">
          <FieldPalette onAddField={handleAddField} />
        </div>
        <div className="center-panel">
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            onDeleteField={handleDeleteField}
          />
        </div>
        <div className="right-panel">
          <FieldSettings
            selectedField={selectedFieldId}
            fields={fields}
            onUpdate={handleUpdateFields}
          />
        </div>
      </div>
    </div>
  );
}
