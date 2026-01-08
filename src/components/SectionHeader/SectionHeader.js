import React from "react";
import "./SectionHeader.css";

export default function SectionHeader({ label, isSelected, onClick, onDelete }) {
  return (
    <div
      className={`section-header ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span className="section-title">
        {label || "Untitled Section"}
      </span>

      {onDelete && (
        <button
          className="section-delete-btn"
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

