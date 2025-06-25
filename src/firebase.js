// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDryic5M-20Nm0rt4oln1WZusmf08eUlOg",
    authDomain: "linklocker-25f6b.firebaseapp.com",
    projectId: "linklocker-25f6b",
    storageBucket: "linklocker-25f6b.firebasestorage.app",
    messagingSenderId: "299850157583",
    appId: "1:299850157583:web:8b32af237a8f1c4e6d5d7a"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
