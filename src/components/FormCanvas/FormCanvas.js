import React from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import "./FormCanvas.css";

const FormCanvas = ({ fields, selectedFieldId, onSelectField, onDeleteField }) => {
  const renderInput = (field) => {
    const baseInputClass = "form-canvas-input";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder || ""}
            className={baseInputClass}
            disabled
          />
        );
      case "select":
        return (
          <select className={baseInputClass} disabled>
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="form-canvas-checkbox-wrapper">
            <input type="checkbox" disabled />
            <span className="form-canvas-checkbox-label">
              {field.placeholder || "Check this option"}
            </span>
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            placeholder={field.placeholder || ""}
            className={baseInputClass}
            disabled
          />
        );
      default:
        return null;
    }
  };

  if (fields.length === 0) {
    return (
      <div className="form-canvas">
        <div className="form-canvas-empty">
          <div className="form-canvas-empty-icon">📋</div>
          <h2 className="form-canvas-empty-title">Start building your form</h2>
          <p className="form-canvas-empty-subtitle">
            Choose a field type from the left to add it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-canvas">
      <div className="form-canvas-content">
        {fields.map((field, index) => {
          const isSelected = selectedFieldId === field.id;

          if (field.type === "section") {
            return (
              <div
                key={field.id}
                className={`field-item${isSelected ? " selected" : ""}`}
                onClick={() => onSelectField(field.id)}
              >
                <SectionHeader
                  label={field.label}
                  isSelected={isSelected}
                  onClick={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              </div>
            );
          }

          return (
            <div
              key={field.id}
              className={`field-item${isSelected ? " selected" : ""}`}
              onClick={() => onSelectField(field.id)}
            >
              <div
                className={`form-canvas-field ${
                  isSelected ? "form-canvas-field-selected" : ""
                }`}
              >
                <div className="form-canvas-field-actions">
                  <button
                    className="form-canvas-field-action form-canvas-field-action-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteField(field.id);
                    }}
                    title="Delete field"
                  >
                    🗑️
                  </button>
                </div>
                <label
                  className={`form-canvas-field-label ${field.required ? "form-canvas-field-label-required" : ""}`}
                >
                  {field.label || "Untitled Field"}
                  {field.required && " *"}
                </label>
                {renderInput(field)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormCanvas;

