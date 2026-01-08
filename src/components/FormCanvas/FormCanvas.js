import React, { useState } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import { reorderFields, getDragBoundaries } from "../../utils/dragUtils";
import "./FormCanvas.css";

const FormCanvas = ({ fields, selectedFieldId, onSelectField, onDeleteField, onUpdate, onCreateFieldFromPalette }) => {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragSourceIndex, setDragSourceIndex] = useState(null);
  const [wasDragging, setWasDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState(null);

  const handleDragStart = (e, index, fieldId) => {
    setDraggingId(fieldId);
    setDragSourceIndex(index);
    setWasDragging(false);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", fieldId);
    e.dataTransfer.setData("source", "canvas");

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

    const source = e.dataTransfer.getData("source");

    // Handle drop from palette (creating new field)
    if (source === "palette") {
      const fieldType = e.dataTransfer.getData("fieldType");
      if (fieldType && onCreateFieldFromPalette) {
        const afterId = targetIndex === -1 ? null : (fields[targetIndex]?.id || null);
        onCreateFieldFromPalette(fieldType, afterId);
      }
      setActiveDropZone(null);
      return;
    }

    // Handle reordering existing fields
    if (draggingId === null || dragSourceIndex === null) {
      resetDrag();
      setActiveDropZone(null);
      return;
    }

    // Verify boundaries
    const boundaries = getDragBoundaries(fields, dragSourceIndex);
    if (!boundaries) {
      resetDrag();
      setActiveDropZone(null);
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
    setActiveDropZone(null);
  };

  const resetDrag = () => {
    setDraggingId(null);
    setDragSourceIndex(null);
    setDragOverIndex(null);
    setActiveDropZone(null);
    // Reset wasDragging flag after a short delay to allow click events to be prevented
    setTimeout(() => setWasDragging(false), 100);
  };

  const handleDropZoneDragOver = (e, dropZoneId) => {
    e.preventDefault();
    e.stopPropagation();
    const source = e.dataTransfer.getData("source");

    // Only show active state for palette drags
    if (source === "palette") {
      e.dataTransfer.dropEffect = "copy";
      setActiveDropZone(dropZoneId);
    } else if (source === "canvas") {
      e.dataTransfer.dropEffect = "move";
      // Don't set active drop zone for field reordering
    }
  };

  const handleDropZoneDragLeave = (e) => {
    // Only clear if we're actually leaving the drop zone (not just moving to a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActiveDropZone(null);
    }
  };

  const handleDragEnd = () => {
    resetDrag();
  };

  // Helper to get children of a section
  const getSectionChildren = (sectionId) => {
    const sectionIndex = fields.findIndex((f) => f.id === sectionId);
    if (sectionIndex === -1) return [];

    const children = [];
    for (let i = sectionIndex + 1; i < fields.length; i++) {
      if (fields[i].type === "section") break;
      if (fields[i].sectionId === sectionId) {
        children.push(fields[i]);
      }
    }
    return children;
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
        <div className="form-canvas-content">
          <div
            className={`drop-zone drop-zone-empty ${activeDropZone === "empty" ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const source = e.dataTransfer.getData("source");
              if (source === "palette") {
                e.dataTransfer.dropEffect = "copy";
                setActiveDropZone("empty");
              }
            }}
            onDragLeave={handleDropZoneDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const fieldType = e.dataTransfer.getData("fieldType");
              if (fieldType && onCreateFieldFromPalette) {
                onCreateFieldFromPalette(fieldType, null, "top");
              }
              setActiveDropZone(null);
            }}
          >
            <div className="form-canvas-empty">
              <div className="form-canvas-empty-icon">📋</div>
              <h2 className="form-canvas-empty-title">Start building your form</h2>
              <p className="form-canvas-empty-subtitle">
                Drag a field type from the left to add it here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-canvas">
      <div className="form-canvas-content">
        {/* Drop zone at top of form */}
        <div
          className={`drop-zone ${activeDropZone === "top" ? "active" : ""}`}
          onDragOver={(e) => handleDropZoneDragOver(e, "top")}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const fieldType = e.dataTransfer.getData("fieldType");
            if (fieldType && onCreateFieldFromPalette) {
              onCreateFieldFromPalette(fieldType, null, "top");
            }
            setActiveDropZone(null);
          }}
        />

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
            <React.Fragment key={field.id}>
              {/* Drop zone before this field */}
              <div
                className={`drop-zone ${activeDropZone === `before-${field.id}` ? "active" : ""}`}
                onDragOver={(e) => handleDropZoneDragOver(e, `before-${field.id}`)}
                onDragLeave={handleDropZoneDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const source = e.dataTransfer.getData("source");

                  if (source === "palette") {
                    const fieldType = e.dataTransfer.getData("fieldType");
                    if (fieldType && onCreateFieldFromPalette) {
                      // Insert before this field
                      if (index === 0) {
                        // First field - insert at top
                        onCreateFieldFromPalette(fieldType, null, "top");
                      } else {
                        // Insert after previous field
                        const prevField = fields[index - 1];
                        onCreateFieldFromPalette(fieldType, prevField.id);
                      }
                    }
                  } else {
                    handleDrop(e, index);
                  }
                  setActiveDropZone(null);
                }}
              />

              <div
                className="field-wrapper"
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Show drop indicator when dragging over */}
                {dragOverIndex === index && draggingId !== field.id && (
                  <div className="drop-indicator" />
                )}

                {field.type === "section" ? (
                  <>
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

                    {/* Empty section placeholder */}
                    {getSectionChildren(field.id).length === 0 && (
                      <div
                        className={`section-empty-state ${activeDropZone === `section-${field.id}` ? "drag-over" : ""}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropZone(`section-${field.id}`);
                        }}
                        onDragLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setActiveDropZone(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const source = e.dataTransfer.getData("source");

                          if (source === "palette") {
                            const fieldType = e.dataTransfer.getData("fieldType");
                            if (fieldType && onCreateFieldFromPalette) {
                              onCreateFieldFromPalette(fieldType, field.id);
                            }
                          }
                          setActiveDropZone(null);
                        }}
                      >
                        Drop fields here
                      </div>
                    )}
                  </>
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
            </React.Fragment>
          );
        })}
        {/* Indicator for dropping at the very end */}
        {dragOverIndex === fields.length && <div className="drop-indicator" />}

        {/* Drop zone at bottom of form */}
        {fields.length > 0 && (
          <div
            className={`drop-zone ${activeDropZone === "bottom" ? "active" : ""}`}
            onDragOver={(e) => handleDropZoneDragOver(e, "bottom")}
            onDragLeave={handleDropZoneDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const fieldType = e.dataTransfer.getData("fieldType");
              if (fieldType && onCreateFieldFromPalette) {
                const lastField = fields[fields.length - 1];
                onCreateFieldFromPalette(fieldType, lastField.id);
              }
              setActiveDropZone(null);
            }}
          />
        )}

        {/* Invisible drop target for end of list (for field reordering) */}
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

