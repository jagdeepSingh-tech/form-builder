import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTwVUI_RhIkhHxpKNu0fmZt4wavy8_ioo",
  authDomain: "mfe-form-platform.firebaseapp.com",
  databaseURL: "https://mfe-form-platform-default-rtdb.firebaseio.com",
  projectId: "mfe-form-platform",
  storageBucket: "mfe-form-platform.firebasestorage.app",
  messagingSenderId: "190589044088",
  appId: "1:190589044088:web:285573f9bfa86f6e9f348d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

export default app;

