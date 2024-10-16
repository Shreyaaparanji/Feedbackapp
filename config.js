// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import 'firebase/compat/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7dCqiKXCT3FdzB2a1E1zZhhgDa_7EG58",
  authDomain: "feedbackapp2-c81e3.firebaseapp.com",
  projectId: "feedbackapp2-c81e3",
  storageBucket: "feedbackapp2-c81e3.appspot.com",
  messagingSenderId: "266289936821",
  appId: "1:266289936821:web:f8ddfa5b9636e4b1bdc1fc",
  measurementId: "G-ZGNND0F6M3"
};




// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const storage = firebase.storage();
export { firebase, firestore, storage};