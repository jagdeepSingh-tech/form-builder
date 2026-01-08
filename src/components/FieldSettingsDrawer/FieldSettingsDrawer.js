import React, { useEffect } from "react";
import FieldSettings from "../FieldSettings/FieldSettings";
import "./FieldSettingsDrawer.css";

export default function FieldSettingsDrawer({ selectedField, fields, onUpdate, onClose, onDuplicate }) {
  useEffect(() => {
    if (selectedField) {
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedField]);

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
      <div className="field-settings-drawer field-settings-panel open">
        <div className="drawer-header">
          <h3 className="drawer-title">Field Settings</h3>
          <div className="drawer-header-actions">
            {onDuplicate && (
              <button
                type="button"
                className="drawer-action drawer-action-duplicate"
                onClick={() => onDuplicate(selectedField)}
                title="Duplicate field (Cmd/Ctrl+D)"
              >
                Duplicate
              </button>
            )}
            <button
              type="button"
              className="drawer-close"
              onClick={onClose}
              title="Close (Esc)"
            >
              ×
            </button>
          </div>
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

