import React from "react";
import "./Header.css";

const Header = ({ onSave, isSaving = false }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Form Builder</h1>
        <button
          className="header-save-button"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Form"}
        </button>
      </div>
    </header>
  );
};

export default Header;

