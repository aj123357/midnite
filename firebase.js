// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection } = require("firebase/firestore");

// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3cWjz1_8GyFTPp4aZfhp8grJJAD3Rm5s",
  authDomain: "clone-fd5e9.firebaseapp.com",
  databaseURL: "https://clone-fd5e9.firebaseio.com",
  projectId: "clone-fd5e9",
  storageBucket: "clone-fd5e9.appspot.com",
  messagingSenderId: "274991683884",
  appId: "1:274991683884:web:3055b81b2a306d0279b489",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

module.exports = db;
