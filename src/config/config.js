import firebase from 'firebase/compat/app'
import { } from 'firebase/compat/auth';
import { } from 'firebase/compat/firestore';
import { } from 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC0IFxYeJFz3dSurFrbjug1LWSJD40V9MA",
  authDomain: "project-e8d31.firebaseapp.com",
  projectId: "project-e8d31",
  storageBucket: "project-e8d31.appspot.com",
  messagingSenderId: "1025968870290",
  appId: "1:1025968870290:web:ccecda50824aaf45a5274b",
  measurementId: "G-F55G5YTB69"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}