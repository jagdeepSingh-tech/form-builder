import React, { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";
import { nanoid } from "nanoid";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import FieldPalette from "./components/FieldPalette/FieldPalette";
import FormCanvas from "./components/FormCanvas/FormCanvas";
import FieldSettingsDrawer from "./components/FieldSettingsDrawer/FieldSettingsDrawer";
import FormMeta from "./components/FormMeta/FormMeta";
import { saveForm, updateForm, getFormById } from "./services/formService";
import { createField } from "./services/fieldFactory";
import { normalizeForm } from "./models/formSchema";
import { formBuilderTourSteps } from "./tour/formBuilderTour";
import "./root.component.css";

export default function Root(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [insertAfterId, setInsertAfterId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  useEffect(() => {
    const state = window.history.state;
    if (state && state.formId) {
      loadForm(state.formId);
    }
  }, []);

  async function loadForm(formId) {
    try {
      const form = await getFormById(formId);
      setTitle(form.title || "");
      setDescription(form.description || "");
      setFields(form.fields || []);
      setEditingFormId(formId);
    } catch (error) {
      console.error("Failed to load form:", error);
      toast.error("Failed to load form. Please try again.");
    }
  }

  function insertFieldAfter(fields, newField, afterId) {
    if (!afterId) return [...fields, newField];
    const index = fields.findIndex((f) => f.id === afterId);
    if (index === -1) return [...fields, newField];
    return [...fields.slice(0, index + 1), newField, ...fields.slice(index + 1)];
  }

  const handleAddField = (type) => {
    const newField = createField(type);
    setFields((prevFields) => {
      if (!selectedFieldId) return [...prevFields, newField];
      const index = prevFields.findIndex((f) => f.id === selectedFieldId);
      if (index === -1) return [...prevFields, newField];
      const updated = [...prevFields];
      updated.splice(index + 1, 0, newField);
      return updated;
    });
    setSelectedFieldId(newField.id);
    setValidationError(null);
  };

  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId);
    setInsertAfterId(fieldId);
  };

  const handleCloseDrawer = () => {
    setSelectedFieldId(null);
  };

  const handleDeleteField = (fieldId) => {
    setFields((prev) => {
      const index = prev.findIndex((f) => f.id === fieldId);
      if (index === -1) return prev;
      const field = prev[index];
      if (field.type !== "section") {
        toast.success("Field deleted");
        return prev.filter((f) => f.id !== fieldId);
      }
      const updated = [];
      let inSection = false;
      for (let i = 0; i < prev.length; i++) {
        if (i === index) {
          inSection = true;
          continue;
        }
        if (inSection && prev[i].type === "section") inSection = false;
        if (inSection && prev[i].sectionId === fieldId) continue;
        updated.push(prev[i]);
      }
      toast.success("Section deleted");
      return updated;
    });
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    setValidationError(null);
  };

  const handleDuplicateField = (fieldId) => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;
    const original = fields[index];
    const clone = { ...original, id: nanoid() };
    const updated = [...fields];
    updated.splice(index + 1, 0, clone);
    setFields(updated);
    setSelectedFieldId(clone.id);
    setInsertAfterId(clone.id);
    setValidationError(null);
  };

  const handleUpdateFields = (updatedFields) => {
    setFields(updatedFields);
    setValidationError(null);
  };

  const handleCreateFieldFromPalette = (type, afterId, position) => {
    const newField = createField(type);
    setFields((prevFields) => {
      if (position === "top") return [newField, ...prevFields];
      return insertFieldAfter(prevFields, newField, afterId);
    });
    setSelectedFieldId(newField.id);
    setInsertAfterId(newField.id);
    setValidationError(null);
  };

  const validateForm = () => {
    if (!title || title.trim() === "") return "Form title is required";
    if (fields.length === 0) return "Please add at least one field";
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
      if (editingFormId) {
        await updateForm(editingFormId, formData);
      } else {
        const id = await saveForm(formData);
        setEditingFormId(id);
      }
      toast.success("Form saved successfully");
      setValidationError(null);
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTourCallback = (data) => {
    const { status, action, index, type } = data;
    if (type === "step:after") {
      if (action === "next") setTourStepIndex(index + 1);
      if (action === "prev") setTourStepIndex(index - 1);
    }
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      setTourStepIndex(0);
    }
  };

  return (
    <div className="root-container">
      <Joyride
        steps={formBuilderTourSteps}
        run={runTour}
        stepIndex={tourStepIndex}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        disableOverlayClose={true}
        scrollToFirstStep={true}
        callback={handleTourCallback}
        styles={{
          options: {
            primaryColor: "#5b5cf6",
            zIndex: 10000,
          },
        }}
      />
      <Toaster position="top-right" />
      <Header
        onSave={handleSave}
        isSaving={isSaving}
        isFormValid={isFormValid}
        onRestartTour={() => {
          setTourStepIndex(0);
          setRunTour(true);
        }}
      />
      <div className="root-layout">
        <div className="left-panel field-palette">
          <FieldPalette onAddField={handleAddField} />
        </div>
        <div className="center-panel">
          {validationError && <div className="root-alert">{validationError}</div>}
          <FormMeta
            title={title}
            description={description}
            onChangeTitle={setTitle}
            onChangeDescription={setDescription}
          />
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            onDeleteField={handleDeleteField}
            onUpdate={handleUpdateFields}
            onCreateFieldFromPalette={handleCreateFieldFromPalette}
          />
        </div>
      </div>
      <FieldSettingsDrawer
        selectedField={selectedFieldId}
        fields={fields}
        onUpdate={handleUpdateFields}
        onClose={handleCloseDrawer}
        onDuplicate={handleDuplicateField}
      />
    </div>
  );
}
