// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "vishy-school-of-yoga.firebaseapp.com",
  projectId: "vishy-school-of-yoga",
  storageBucket: "vishy-school-of-yoga.firebasestorage.app",
  messagingSenderId: "385779499110",
  appId: "1:385779499110:web:d1e4ed7ef59b9e734deda7",
  measurementId: "G-7MGQNSQF6F"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
const db = getFirestore(app);

// Export for use in other files
export { db, collection, addDoc };