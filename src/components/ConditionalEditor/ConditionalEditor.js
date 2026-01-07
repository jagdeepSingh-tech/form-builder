import React, { useRef, useEffect } from "react";
import "./ConditionalEditor.css";

const OPERATORS = [
  { value: "checked", label: "Is checked", needsValue: false },
  { value: "not_checked", label: "Is not checked", needsValue: false },
  { value: "equals", label: "Equals", needsValue: true },
  { value: "not_equals", label: "Does not equal", needsValue: true },
  { value: "greater_than", label: "Greater than", needsValue: true },
  { value: "less_than", label: "Less than", needsValue: true },
];

function requiresValue(operator) {
  return !["checked", "not_checked"].includes(operator);
}

function getOperatorForField(fieldLabel, fields) {
  const field = fields.find((f) => f.label === fieldLabel);
  if (!field) {
    return OPERATORS;
  }

  if (field.type === "checkbox") {
    return OPERATORS.filter((op) => op.value === "checked" || op.value === "not_checked");
  }

  if (field.type === "number") {
    return OPERATORS.filter(
      (op) =>
        op.value === "equals" ||
        op.value === "not_equals" ||
        op.value === "greater_than" ||
        op.value === "less_than"
    );
  }

  return OPERATORS.filter((op) => op.value === "equals" || op.value === "not_equals");
}

function ConditionRow({ condition, index, fields, onUpdate, onRemove }) {
  const availableOperators = getOperatorForField(condition.fieldLabel, fields);
  const needsValue = requiresValue(condition.operator);
  const valueInputRef = useRef(null);

  // Auto-focus value input when operator changes to one requiring value
  useEffect(() => {
    if (needsValue && valueInputRef.current) {
      const timer = setTimeout(() => {
        valueInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [condition.operator, needsValue]);

  // Determine placeholder based on operator
  const getValuePlaceholder = () => {
    if (condition.operator === "greater_than" || condition.operator === "less_than") {
      return "e.g. 18";
    }
    return "e.g. India";
  };

  return (
    <div className="condition-row">
      <div className="condition-line">
        <span className="condition-label">If</span>
        <input
          type="text"
          className="condition-input"
          value={condition.fieldLabel || ""}
          onChange={(e) =>
            onUpdate(index, {
              fieldLabel: e.target.value,
              operator: "checked",
              value: "",
            })
          }
          placeholder="Enter field label"
        />
      </div>

      <div className="condition-line">
        <span className="condition-label">Is</span>
        <select
          className="condition-select"
          value={condition.operator || "checked"}
          onChange={(e) => {
            const newOperator = e.target.value;
            onUpdate(index, {
              operator: newOperator,
              value: requiresValue(newOperator) ? condition.value : "",
            });
          }}
        >
          {availableOperators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
        <div className={`condition-value-wrapper ${!needsValue ? "hidden" : ""}`}>
          <input
            ref={valueInputRef}
            type="text"
            className="condition-input condition-value-input"
            value={condition.value || ""}
            onChange={(e) => onUpdate(index, { value: e.target.value })}
            placeholder={getValuePlaceholder()}
          />
        </div>
      </div>

      <button
        type="button"
        className="remove-condition"
        onClick={() => onRemove(index)}
        title="Remove condition"
      >
        ×
      </button>
    </div>
  );
}

export default function ConditionalEditor({ conditions = [], fields, currentFieldId, onChange }) {
  const handleAddCondition = () => {
    const newCondition = {
      fieldLabel: "",
      operator: "checked",
      value: "",
    };
    onChange([...conditions, newCondition]);
  };

  const handleRemoveCondition = (index) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const handleUpdateCondition = (index, updates) => {
    const updated = conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );
    onChange(updated);
  };

  return (
    <div className="conditional-editor">
      <div className="conditional-editor__header">
        <h3 className="conditional-editor__title">Conditional Logic</h3>
        <p className="conditional-editor__subtitle">Show this field only when conditions are met</p>
      </div>

      {conditions.length === 0 ? (
        <div className="conditional-editor__empty">
          <p className="conditional-editor__empty-text">No conditions set</p>
          <button
            type="button"
            className="conditional-editor__add-button"
            onClick={handleAddCondition}
          >
            + Add Condition
          </button>
        </div>
      ) : (
        <div className="conditional-editor__list">
          {conditions.map((condition, index) => (
            <ConditionRow
              key={index}
              condition={condition}
              index={index}
              fields={fields}
              onUpdate={handleUpdateCondition}
              onRemove={handleRemoveCondition}
            />
          ))}
          <button
            type="button"
            className="conditional-editor__add-button"
            onClick={handleAddCondition}
          >
            + Add Another Condition
          </button>
        </div>
      )}
    </div>
  );
}

