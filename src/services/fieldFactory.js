import { nanoid } from "nanoid";

export function createField(type) {
  if (type === "section") {
    return {
      id: nanoid(),
      type: "section",
      label: "Section title",
    };
  }

  const base = {
    id: nanoid(),
    type,
    label: "",
    placeholder: "",
    required: false,
  };

  if (type === "select") {
    return {
      ...base,
      options: ["Option 1", "Option 2"],
    };
  }

  return base;
}


