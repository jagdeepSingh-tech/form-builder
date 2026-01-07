import React from "react";
import "./ValidationRules.css";

const Toggle = ({ value, onChange, label }) => {
  return (
    <div className="validation-toggle">
      <div
        className={`validation-toggle-switch ${value ? "validation-toggle-switch-active" : ""}`}
        onClick={() => onChange(!value)}
      >
        <div
          className={`validation-toggle-thumb ${value ? "validation-toggle-thumb-active" : ""}`}
        />
      </div>
      <label className="validation-toggle-label" onClick={() => onChange(!value)}>
        {label}
      </label>
    </div>
  );
};

export default function ValidationRules({ field, onUpdate }) {
  if (!field || field.type === "section") {
    return null;
  }

  const validations = field.validations || {};
  const fieldType = field.type;

  const handleValidationChange = (key, value) => {
    const updatedValidations = {
      ...validations,
      [key]: value === "" || value === null || value === undefined ? undefined : value,
    };
    // Remove undefined values
    Object.keys(updatedValidations).forEach((k) => {
      if (updatedValidations[k] === undefined) {
        delete updatedValidations[k];
      }
    });
    onUpdate({ ...field, validations: updatedValidations });
  };

  const isTextField = ["text", "email", "textarea"].includes(fieldType);
  const isNumberField = fieldType === "number";
  const isDateField = fieldType === "date";
  const isCheckboxField = fieldType === "checkbox";
  const isSelectField = fieldType === "select";

  // Validation warnings
  const minLength = validations.minLength ? Number(validations.minLength) : null;
  const maxLength = validations.maxLength ? Number(validations.maxLength) : null;
  const minValue = validations.min ? Number(validations.min) : null;
  const maxValue = validations.max ? Number(validations.max) : null;
  const hasMinMaxWarning =
    (isTextField && minLength !== null && maxLength !== null && minLength > maxLength) ||
    ((isNumberField || isDateField) && minValue !== null && maxValue !== null && minValue > maxValue);

  let regexError = null;
  if (validations.pattern) {
    try {
      new RegExp(validations.pattern);
    } catch (e) {
      regexError = "Invalid regex pattern";
    }
  }

  return (
    <div className="validation-block">
      <div className="validation-header">
        <h3 className="validation-title">Validation Rules</h3>
      </div>

      <div className="validation-content">
        {/* Required - shown for all field types */}
        <div className="validation-row">
          <Toggle
            value={validations.required || false}
            onChange={(value) => handleValidationChange("required", value)}
            label="Required field"
          />
        </div>

        {/* Text field validations */}
        {isTextField && (
          <>
            <div className="validation-row">
              <div className="validation-input-group">
                <label className="validation-label">Min length</label>
                <input
                  type="number"
                  className={`validation-input ${hasMinMaxWarning && minLength !== null ? "validation-input-warning" : ""}`}
                  value={validations.minLength || ""}
                  onChange={(e) =>
                    handleValidationChange("minLength", e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="e.g. 3"
                  min="0"
                />
              </div>
              <div className="validation-input-group">
                <label className="validation-label">Max length</label>
                <input
                  type="number"
                  className={`validation-input ${hasMinMaxWarning && maxLength !== null ? "validation-input-warning" : ""}`}
                  value={validations.maxLength || ""}
                  onChange={(e) =>
                    handleValidationChange("maxLength", e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="e.g. 100"
                  min="0"
                />
              </div>
            </div>
            {hasMinMaxWarning && (
              <div className="validation-warning">
                Min length cannot be greater than max length
              </div>
            )}

            <div className="validation-row">
              <div className="validation-input-group validation-input-group-full">
                <label className="validation-label">Regex pattern</label>
                <input
                  type="text"
                  className={`validation-input ${regexError ? "validation-input-error" : ""}`}
                  value={validations.pattern || ""}
                  onChange={(e) => handleValidationChange("pattern", e.target.value)}
                  placeholder="e.g. ^[A-Za-z]+$"
                />
                {regexError && <div className="validation-error-text">{regexError}</div>}
              </div>
            </div>
          </>
        )}

        {/* Number field validations */}
        {isNumberField && (
          <>
            <div className="validation-row">
              <div className="validation-input-group">
                <label className="validation-label">Min value</label>
                <input
                  type="number"
                  className={`validation-input ${hasMinMaxWarning && minValue !== null ? "validation-input-warning" : ""}`}
                  value={validations.min !== undefined ? validations.min : ""}
                  onChange={(e) =>
                    handleValidationChange("min", e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="e.g. 0"
                />
              </div>
              <div className="validation-input-group">
                <label className="validation-label">Max value</label>
                <input
                  type="number"
                  className={`validation-input ${hasMinMaxWarning && maxValue !== null ? "validation-input-warning" : ""}`}
                  value={validations.max !== undefined ? validations.max : ""}
                  onChange={(e) =>
                    handleValidationChange("max", e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            {hasMinMaxWarning && (
              <div className="validation-warning">
                Min value cannot be greater than max value
              </div>
            )}
          </>
        )}

        {/* Date field validations */}
        {isDateField && (
          <>
            <div className="validation-row">
              <div className="validation-input-group">
                <label className="validation-label">Min date</label>
                <input
                  type="date"
                  className={`validation-input ${hasMinMaxWarning && minValue !== null ? "validation-input-warning" : ""}`}
                  value={validations.min || ""}
                  onChange={(e) => handleValidationChange("min", e.target.value)}
                />
              </div>
              <div className="validation-input-group">
                <label className="validation-label">Max date</label>
                <input
                  type="date"
                  className={`validation-input ${hasMinMaxWarning && maxValue !== null ? "validation-input-warning" : ""}`}
                  value={validations.max || ""}
                  onChange={(e) => handleValidationChange("max", e.target.value)}
                />
              </div>
            </div>
            {hasMinMaxWarning && (
              <div className="validation-warning">
                Min date cannot be greater than max date
              </div>
            )}
          </>
        )}

        {/* Error message - shown for all field types except checkbox/select (which only have required) */}
        {(isTextField || isNumberField || isDateField) && (
          <div className="validation-row">
            <div className="validation-input-group validation-input-group-full">
              <label className="validation-label">Custom error message</label>
              <input
                type="text"
                className="validation-input"
                value={validations.errorMessage || ""}
                onChange={(e) => handleValidationChange("errorMessage", e.target.value)}
                placeholder="e.g. This field is required"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

