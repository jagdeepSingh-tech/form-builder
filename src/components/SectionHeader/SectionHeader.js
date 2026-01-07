import React from "react";
import "./SectionHeader.css";

export default function SectionHeader({ label, isSelected, onClick, onDelete }) {
  return (
    <div
      className={`section-header ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span>
        {label || "Untitled Section"}
        {isSelected && <span className="edit-hint">Click to edit</span>}
      </span>

      {isSelected && onDelete && (
        <button
          className="section-header-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete section"
        >
          🗑️
        </button>
      )}
    </div>
  );
}

