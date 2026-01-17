import React from "react";
import ConditionalEditor from "../ConditionalEditor/ConditionalEditor";
import ValidationRules from "../ValidationRules/ValidationRules";
import "./FieldSettings.css";

const OptionsEditor = ({ options, onChange }) => {
  const handleAddOption = () => {
    onChange([...options, `Option ${options.length + 1}`]);
  };

  const handleRemoveOption = (index) => {
    onChange(options.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  return (
    <div className="field-settings-options-editor">
      {options.map((option, index) => (
        <div key={index} className="field-settings-option-item">
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="field-settings-option-input"
            placeholder="Option text"
          />
          <button
            className="field-settings-option-remove"
            onClick={() => handleRemoveOption(index)}
            title="Remove option"
          >
            ×
          </button>
        </div>
      ))}
      <button className="field-settings-option-add" onClick={handleAddOption}>
        + Add Option
      </button>
    </div>
  );
};

const FieldSettings = ({ selectedField, fields, onUpdate }) => {
  if (!selectedField) {
    return (
      <div className="field-settings">
        <h2 className="field-settings-title">Field Settings</h2>
        <p className="field-settings-empty">Select a field to edit its settings</p>
      </div>
    );
  }

  const field = fields.find((f) => f.id === selectedField);
  if (!field) {
    return (
      <div className="field-settings">
        <h2 className="field-settings-title">Field Settings</h2>
        <p className="field-settings-empty">Select a field to edit its settings</p>
      </div>
    );
  }

  const handleLabelChange = (value) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, label: value } : f
    );
    onUpdate(updatedFields);
  };

  const handlePlaceholderChange = (value) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, placeholder: value } : f
    );
    onUpdate(updatedFields);
  };

  const handleOptionsChange = (options) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, options } : f
    );
    onUpdate(updatedFields);
  };

  const handleConditionsChange = (conditions) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, conditions } : f
    );
    onUpdate(updatedFields);
  };

  const handleValidationChange = (updatedField) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? updatedField : f
    );
    onUpdate(updatedFields);
  };

  const handleRequiredChange = (value) => {
    const updatedValidations = {
      ...(field.validations || {}),
      required: value,
    };
    // Remove required if false to keep data clean
    if (!value) {
      delete updatedValidations.required;
    }
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, validations: updatedValidations } : f
    );
    onUpdate(updatedFields);
  };

  const isSection = field.type === "section";
  const needsOptions = field.type === "select";
  const needsPlaceholder = !needsOptions && !isSection;
  const isRequired = field.validations?.required || false;

  return (
    <div className="field-settings">
      <h2 className="field-settings-title">Field Settings</h2>

      <div className="field-settings-group">
        <label className="field-settings-label">
          {isSection ? "Section Title" : "Label"}
        </label>
        <input
          type="text"
          value={field.label || ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="field-settings-input"
          placeholder={isSection ? "Section title" : "Field label"}
        />
      </div>

      {!isSection && (
        <>
          {/* Required Toggle - First-class property */}
          <div className="field-settings-group">
            <div className="field-settings-toggle">
              <div
                className={`field-settings-toggle-switch ${isRequired ? "field-settings-toggle-switch-active" : ""}`}
                onClick={() => handleRequiredChange(!isRequired)}
              >
                <div
                  className={`field-settings-toggle-thumb ${isRequired ? "field-settings-toggle-thumb-active" : ""}`}
                />
              </div>
              <label
                className="field-settings-toggle-label"
                onClick={() => handleRequiredChange(!isRequired)}
              >
                Required field
              </label>
            </div>
          </div>

          {needsPlaceholder && (
            <div className="field-settings-group">
              <label className="field-settings-label">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => handlePlaceholderChange(e.target.value)}
                className="field-settings-input"
                placeholder="Placeholder text"
              />
            </div>
          )}

          {needsOptions && (
            <div className="field-settings-group">
              <label className="field-settings-label">Options</label>
              <OptionsEditor
                options={field.options || ["Option 1"]}
                onChange={handleOptionsChange}
              />
            </div>
          )}

          <ConditionalEditor
            conditions={field.conditions || []}
            fields={fields}
            currentFieldId={field.id}
            onChange={handleConditionsChange}
          />

          <ValidationRules
            field={field}
            onUpdate={handleValidationChange}
          />
        </>
      )}
    </div>
  );
};

export default FieldSettings;

