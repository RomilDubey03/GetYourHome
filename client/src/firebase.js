// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-1ed64.firebaseapp.com",
  projectId: "mern-real-estate-1ed64",
  storageBucket: "mern-real-estate-1ed64.appspot.com",
  messagingSenderId: "136987771547",
  appId: "1:136987771547:web:bcf87a3e4454b820713c3e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

