import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-qkNBCzUvQlVOLIh_oQNs_KGW85Nw-YQ",
  authDomain: "pepsa-userapp.firebaseapp.com",
  projectId: "pepsa-userapp",
  storageBucket: "pepsa-userapp.appspot.com",
  messagingSenderId: "791902017949",
  appId: "1:791902017949:web:775c939a3f65c5750eb774",
  measurementId: "G-RXR5ZVZ0PH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
