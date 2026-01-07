import { ref, push, set, update, get } from "firebase/database";
import { database } from "./firebase";

const normalizeField = (field) => {
  if (!field) return null;
  return {
    id: String(field.id || ""),
    type: String(field.type || ""),
    label: field.label ? String(field.label) : "",
    placeholder: field.placeholder ? String(field.placeholder) : "",
    required: Boolean(field.required),
    ...(Array.isArray(field.options) && field.options.length
      ? { options: field.options.map((option) => String(option)) }
      : {}),
  };
};

const normalizeForm = (form, { formId, isNew }) => {
  const now = new Date().toISOString();
  const normalizedFields = Array.isArray(form.fields)
    ? form.fields
        .map((field) => normalizeField(field))
        .filter((field) => field && field.type)
    : [];

  return {
    id: formId || String(form.id || ""),
    title: form.title ? String(form.title) : "",
    description: form.description ? String(form.description) : "",
    fields: normalizedFields,
    createdAt: isNew ? now : form.createdAt || now,
    updatedAt: now,
  };
};

export const saveForm = async (form) => {
  try {
    const formsRef = ref(database, "forms");
    const newFormRef = push(formsRef);
    const formId = newFormRef.key;

    const formData = normalizeForm(form, { formId, isNew: true });
    await set(newFormRef, formData);
    return formId;
  } catch (error) {
    console.error("Error saving form:", error);
    throw error;
  }
};

export const updateForm = async (formId, form) => {
  try {
    const formRef = ref(database, `forms/${formId}`);

    const existingSnapshot = await get(formRef);
    const existing = existingSnapshot.exists() ? existingSnapshot.val() : {};

    const normalized = normalizeForm(
      {
        ...existing,
        ...form,
      },
      { formId, isNew: false },
    );

    await update(formRef, normalized);
  } catch (error) {
    console.error("Error updating form:", error);
    throw error;
  }
};

export const getFormById = async (formId) => {
  try {
    const formRef = ref(database, `forms/${formId}`);
    const snapshot = await get(formRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.val();
  } catch (error) {
    console.error("Error fetching form by id:", error);
    throw error;
  }
};


