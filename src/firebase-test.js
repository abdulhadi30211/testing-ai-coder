import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

console.log("Firebase imports working");

const firebaseConfig = {
  apiKey: "AIzaSyD0vbhxp_xv-qA-EVBbxrX8bIZQEq9x0q0",
  authDomain: "bolt-platform-clone.firebaseapp.com",
  projectId: "bolt-platform-clone",
  storageBucket: "bolt-platform-clone.firebasestorage.app",
  messagingSenderId: "382922903531",
  appId: "1:382922903531:web:5cdae922ce30481bc893ae",
};

console.log("Firebase config created");

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized");

export const auth = getAuth(app);
console.log("Firebase auth exported");