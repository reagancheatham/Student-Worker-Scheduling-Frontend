// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_SECURE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_SECURE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_SECURE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_SECURE_STORAGE_BUCKER,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SECURE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_SECURE_APP_ID,
};



// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig)
