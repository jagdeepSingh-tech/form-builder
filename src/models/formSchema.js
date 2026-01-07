export function normalizeForm(form) {
  return {
    title: form.title || "Untitled Form",
    description: form.description || "",
    fields: Array.isArray(form.fields)
      ? form.fields.map((field) => {
          if (field.type === "section") {
            return {
              id: field.id,
              type: "section",
              label: field.label || "Untitled Section",
            };
          }

          const normalizedField = {
            id: field.id,
            type: field.type,
            label: field.label || "",
            placeholder: field.placeholder || "",
            options: field.type === "select" ? (field.options || []) : undefined,
          };

          // Include conditions if they exist
          if (Array.isArray(field.conditions) && field.conditions.length > 0) {
            normalizedField.conditions = field.conditions.map((condition) => ({
              fieldLabel: condition.fieldLabel || "",
              operator: condition.operator,
              value: condition.value !== undefined ? condition.value : "",
            }));
          }

          // Include validations if they exist
          // Also migrate legacy field.required to field.validations.required
          const validations = field.validations || {};
          const hasLegacyRequired = field.required !== undefined && !validations.hasOwnProperty('required');
          
          if (hasLegacyRequired || (validations && Object.keys(validations).length > 0)) {
            const cleanedValidations = {};
            
            // Migrate legacy required field
            if (hasLegacyRequired) {
              cleanedValidations.required = Boolean(field.required);
            } else if (validations.required !== undefined) {
              cleanedValidations.required = Boolean(validations.required);
            }
            
            if (validations.minLength !== undefined) {
              cleanedValidations.minLength = Number(validations.minLength);
            }
            if (validations.maxLength !== undefined) {
              cleanedValidations.maxLength = Number(validations.maxLength);
            }
            if (validations.min !== undefined) {
              cleanedValidations.min = validations.min;
            }
            if (validations.max !== undefined) {
              cleanedValidations.max = validations.max;
            }
            if (validations.pattern) {
              cleanedValidations.pattern = String(validations.pattern);
            }
            if (validations.errorMessage) {
              cleanedValidations.errorMessage = String(validations.errorMessage);
            }
            if (Object.keys(cleanedValidations).length > 0) {
              normalizedField.validations = cleanedValidations;
            }
          }

          return normalizedField;
        })
      : [],
  };
}


