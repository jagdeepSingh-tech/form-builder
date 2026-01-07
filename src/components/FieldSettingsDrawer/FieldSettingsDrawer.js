import React, { useEffect } from "react";
import FieldSettings from "../FieldSettings/FieldSettings";
import "./FieldSettingsDrawer.css";

export default function FieldSettingsDrawer({ selectedField, fields, onUpdate, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedField) {
        onClose();
      }
    };

    if (selectedField) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedField, onClose]);

  if (!selectedField) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="field-settings-drawer-overlay"
        onClick={handleOverlayClick}
      />
      <div className="field-settings-drawer open">
        <div className="drawer-header">
          <h3 className="drawer-title">Field Settings</h3>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="drawer-content">
          <FieldSettings
            selectedField={selectedField}
            fields={fields}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </>
  );
}

