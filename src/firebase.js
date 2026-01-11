// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUFmTNHzuIytoCmOeaBjs1ApZ8wmmqlGI",
  authDomain: "task-manager-2a5fb.firebaseapp.com",
  projectId: "task-manager-2a5fb",
  storageBucket: "task-manager-2a5fb.firebasestorage.app",
  messagingSenderId: "135984705738",
  appId: "1:135984705738:web:c80d2ae16770d12af38433",
  measurementId: "G-DQ7DMHJKMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);