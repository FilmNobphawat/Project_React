import firebase from 'firebase/compat/app'
import { } from 'firebase/compat/auth';
import { } from 'firebase/compat/firestore';
import { } from 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAZd61FI1ksJJ1QRvthwCE4m4tkkNoZagI",
    authDomain: "project-53430.firebaseapp.com",
    projectId: "project-53430",
    storageBucket: "project-53430.appspot.com",
    messagingSenderId: "134510976659",
    appId: "1:134510976659:web:d873bf25cdd491d6d7f766",
    measurementId: "G-ZP9BG3KL2R"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}