export function groupFieldsBySection(fields) {
  const sections = [];
  let currentSection = { title: "General", fields: [] };

  fields.forEach((field) => {
    if (field.type === "section") {
      sections.push(currentSection);
      currentSection = {
        title: field.label || "Untitled Section",
        fields: [],
      };
    } else {
      currentSection.fields.push(field);
    }
  });

  sections.push(currentSection);

  return sections.filter((section) => section.fields.length > 0);
}

