import React from "react";
import "./FieldPalette.css";

const PALETTE_ITEMS = [
  { id: "section", label: "Section", icon: "📁", isSection: true },
  { id: "text", label: "Text", icon: "📝", isSection: false },
  { id: "email", label: "Email", icon: "✉️", isSection: false },
  { id: "number", label: "Number", icon: "🔢", isSection: false },
  { id: "select", label: "Select", icon: "📋", isSection: false },
  { id: "checkbox", label: "Checkbox", icon: "☑️", isSection: false },
  { id: "date", label: "Date", icon: "📅", isSection: false },
];

const FieldPalette = ({ onAddField }) => {
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("fieldType", fieldType);
    e.dataTransfer.setData("source", "palette");
  };

  return (
    <div className="field-palette">
      <h2 className="field-palette-title">Field Palette</h2>
      <div className="field-palette-list">
        {PALETTE_ITEMS.map((fieldType) => (
          <div
            key={fieldType.id}
            draggable
            className={`field-palette-item ${fieldType.isSection ? "field-palette-item-section" : ""}`}
            onDragStart={(e) => handleDragStart(e, fieldType.id)}
          >
            <span className="field-palette-icon">{fieldType.icon}</span>
            <span className="field-palette-label">{fieldType.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldPalette;

