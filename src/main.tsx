import React from 'react'
import ReactDOM from 'react-dom/client'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import App from './App'
import './index.css'

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("Not logged in");
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
