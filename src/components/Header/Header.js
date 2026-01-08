import React from "react";
import "./Header.css";

const Header = ({ onSave, isSaving = false, isFormValid = true, onRestartTour }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Form Builder</h1>
        <div className="header-actions">
          <button
            className="help-tour-btn"
            onClick={() => {
              if (onRestartTour) onRestartTour();
            }}
          >
            Take a tour
          </button>
          <button
            className="header-save-button save-form-button"
            onClick={onSave}
            disabled={isSaving || !isFormValid}
          >
            {isSaving ? "Saving..." : "Save Form"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

