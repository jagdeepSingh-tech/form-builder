import React from "react";
import "./SectionHeader.css";

export default function SectionHeader({ label, isSelected, onClick, onDelete }) {
  return (
    <div
      className={`section-header ${isSelected ? "section-header-selected" : ""}`}
      onClick={onClick}
    >
      <div className="section-header-content">
        <h3 className="section-header-title">{label || "Untitled Section"}</h3>
        {onDelete && (
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
      <div className="section-header-divider"></div>
    </div>
  );
}

