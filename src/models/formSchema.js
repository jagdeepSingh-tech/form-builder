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

          return {
            id: field.id,
            type: field.type,
            label: field.label || "",
            placeholder: field.placeholder || "",
            required: Boolean(field.required),
            options: field.type === "select" ? (field.options || []) : undefined,
          };
        })
      : [],
  };
}


