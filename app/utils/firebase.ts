import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpx-e4ONO-TCh1QFPE5GjP5imLn91Hfxw",
  authDomain: "jkcup-9744d.firebaseapp.com",
  projectId: "jkcup-9744d",
  storageBucket: "jkcup-9744d.firebasestorage.app",
  messagingSenderId: "975525093183",
  appId: "1:975525093183:web:9e1422be5df929d7fb3d8a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth };
