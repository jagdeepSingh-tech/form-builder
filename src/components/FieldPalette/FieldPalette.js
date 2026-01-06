import React from "react";
import "./FieldPalette.css";

const FIELD_TYPES = [
  { id: "text", label: "Text", icon: "📝" },
  { id: "email", label: "Email", icon: "✉️" },
  { id: "number", label: "Number", icon: "🔢" },
  { id: "select", label: "Select", icon: "📋" },
  { id: "checkbox", label: "Checkbox", icon: "☑️" },
  { id: "date", label: "Date", icon: "📅" },
];

const FieldPalette = ({ onAddField }) => {
  return (
    <div className="field-palette">
      <h2 className="field-palette-title">Field Palette</h2>
      <div className="field-palette-list">
        {FIELD_TYPES.map((fieldType) => (
          <div
            key={fieldType.id}
            className="field-palette-item"
            onClick={() => onAddField(fieldType.id)}
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

