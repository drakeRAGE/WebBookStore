// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_kEY,
  authDomain: 'book-mern-4dcf8.firebaseapp.com',
  projectId: 'book-mern-4dcf8',
  storageBucket: 'book-mern-4dcf8.appspot.com',
  messagingSenderId: '541561517868',
  appId: '1:541561517868:web:1a80c227a2b9eba7e71e89',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
