import React, { useState } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import { reorderFields, getDragBoundaries } from "../../utils/dragUtils";
import "./FormCanvas.css";

const FormCanvas = ({ fields, selectedFieldId, onSelectField, onDeleteField, onUpdate }) => {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragSourceIndex, setDragSourceIndex] = useState(null);
  const [wasDragging, setWasDragging] = useState(false);

  const handleDragStart = (e, index, fieldId) => {
    setDraggingId(fieldId);
    setDragSourceIndex(index);
    setWasDragging(false);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", fieldId);
    
    // Create a transparent 1x1 pixel image to hide the default drag image
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    if (draggingId === null || dragSourceIndex === null) return;

    // Optimization: don't update if index hasn't changed
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggingId === null || dragSourceIndex === null) {
      resetDrag();
      return;
    }

    // Verify boundaries
    const boundaries = getDragBoundaries(fields, dragSourceIndex);
    if (!boundaries) {
      resetDrag();
      return;
    }

    const sourceItem = fields[dragSourceIndex];
    let isValid = true;

    // Check if target is within valid range
    if (sourceItem.type !== "section") {
      // For regular fields, ensure target is within section boundaries
      if (targetIndex < boundaries.min || targetIndex > boundaries.max) {
        isValid = false;
      }
    }
    // Sections can be moved anywhere

    if (isValid && dragSourceIndex !== targetIndex) {
      const newFields = reorderFields(fields, dragSourceIndex, targetIndex);
      onUpdate(newFields);
      setWasDragging(true);
    }

    resetDrag();
  };

  const resetDrag = () => {
    setDraggingId(null);
    setDragSourceIndex(null);
    setDragOverIndex(null);
    // Reset wasDragging flag after a short delay to allow click events to be prevented
    setTimeout(() => setWasDragging(false), 100);
  };

  const handleDragEnd = () => {
    resetDrag();
  };

  const renderInput = (field) => {
    const baseInputClass = "form-canvas-input";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
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
      case "textarea":
        return (
          <textarea className={baseInputClass} disabled placeholder={field.placeholder || ""} />
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
          const isDragging = draggingId === field.id;
          const isDragOver = dragOverIndex === index && draggingId !== field.id;

          const dragProps = {
            draggable: true,
            onDragStart: (e) => {
              e.stopPropagation();
              handleDragStart(e, index, field.id);
            },
            onDragEnd: (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragEnd();
            },
          };

          const renderPlaceholder = () => {
            if (dragOverIndex === index && draggingId !== field.id) {
              return <div className="drag-placeholder" />;
            }
            return null;
          };

          return (
            <div
              key={field.id}
              className="field-wrapper"
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              {renderPlaceholder()}
              {field.type === "section" ? (
                <div
                  {...dragProps}
                  className={`field-item${isSelected ? " selected" : ""} ${isDragging ? "dragging" : ""}`}
                  onClick={(e) => {
                    // Only select if not dragging and wasn't just dragging
                    if (!draggingId && !wasDragging) {
                      onSelectField(field.id);
                    }
                  }}
                >
                  <SectionHeader
                    label={field.label}
                    isSelected={isSelected}
                    onClick={() => onSelectField(field.id)}
                    onDelete={() => onDeleteField(field.id)}
                  />
                </div>
              ) : (
                <div
                  {...dragProps}
                  className={`field-item ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""}`}
                  onClick={(e) => {
                    // Only select if not dragging and wasn't just dragging
                    if (!draggingId && !wasDragging) {
                      onSelectField(field.id);
                    }
                  }}
                >
                  <div
                    className={`form-canvas-field ${isSelected ? "form-canvas-field-selected" : ""
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
                      className={`form-canvas-field-label ${field.validations?.required ? "form-canvas-field-label-required" : ""}`}
                    >
                      {field.label || "Untitled Field"}
                      {field.validations?.required && " *"}
                    </label>
                    {renderInput(field)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* Placeholder for dropping at the very end */}
        {dragOverIndex === fields.length && <div className="drag-placeholder" />}

        {/* Invisible drop target for end of list */}
        <div
          className="drop-target-end"
          onDragOver={(e) => handleDragOver(e, fields.length)}
          onDrop={(e) => handleDrop(e, fields.length)}
        />
      </div>
    </div>
  );
};

export default FormCanvas;

