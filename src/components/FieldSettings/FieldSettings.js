import React from "react";
import "./FieldSettings.css";

const Toggle = ({ value, onChange, label }) => {
  return (
    <div className="field-settings-toggle">
      <div
        className={`field-settings-toggle-switch ${value ? "field-settings-toggle-switch-active" : ""}`}
        onClick={() => onChange(!value)}
      >
        <div
          className={`field-settings-toggle-thumb ${value ? "field-settings-toggle-thumb-active" : ""}`}
        />
      </div>
      <label className="field-settings-toggle-label" onClick={() => onChange(!value)}>
        {label}
      </label>
    </div>
  );
};

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

  const handleRequiredChange = (value) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, required: value } : f
    );
    onUpdate(updatedFields);
  };

  const handleOptionsChange = (options) => {
    const updatedFields = fields.map((f) =>
      f.id === field.id ? { ...f, options } : f
    );
    onUpdate(updatedFields);
  };

  const isSection = field.type === "section";
  const needsOptions = field.type === "select";
  const needsPlaceholder = !needsOptions && !isSection;

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

          <div className="field-settings-group">
            <Toggle
              value={field.required || false}
              onChange={handleRequiredChange}
              label="Required field"
            />
          </div>

          {needsOptions && (
            <div className="field-settings-group">
              <label className="field-settings-label">Options</label>
              <OptionsEditor
                options={field.options || ["Option 1"]}
                onChange={handleOptionsChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FieldSettings;

