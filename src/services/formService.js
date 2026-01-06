import { ref, push, set, update } from "firebase/database";
import { database } from "./firebase";

/**
 * Save a new form to Firebase
 * @param {Object} form - Form object containing fields array and metadata
 * @returns {Promise<string>} - Returns the form ID
 */
export const saveForm = async (form) => {
  try {
    const formsRef = ref(database, "forms");
    const newFormRef = push(formsRef);
    const formId = newFormRef.key;

    const formData = {
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(newFormRef, formData);
    return formId;
  } catch (error) {
    console.error("Error saving form:", error);
    throw error;
  }
};

/**
 * Update an existing form in Firebase
 * @param {string} formId - The ID of the form to update
 * @param {Object} form - Updated form object
 * @returns {Promise<void>}
 */
export const updateForm = async (formId, form) => {
  try {
    const formRef = ref(database, `forms/${formId}`);
    const formData = {
      ...form,
      updatedAt: new Date().toISOString(),
    };

    await update(formRef, formData);
  } catch (error) {
    console.error("Error updating form:", error);
    throw error;
  }
};

