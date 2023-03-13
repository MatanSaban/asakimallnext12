// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB4_GxQksmEu54z0HNXFIT8qPTv4xptcU",
  authDomain: "asakimall.firebaseapp.com",
  projectId: "asakimall",
  storageBucket: "asakimall.appspot.com",
  messagingSenderId: "856605662560",
  appId: "1:856605662560:web:6eca8028fc8219960f1205",
  measurementId: "G-ZTJ8G13CJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

