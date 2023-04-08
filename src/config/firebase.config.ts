import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeb5sBGeXHLlgwVP-JiP_dchbiYNsdptI",
  authDomain: "double-six-f7530.firebaseapp.com",
  projectId: "double-six-f7530",
  storageBucket: "double-six-f7530.appspot.com",
  messagingSenderId: "588879892244",
  appId: "1:588879892244:web:75eecdd8478fe73b88fc01",
  measurementId: "G-5SXKPGVW5N",
};

const FirebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(FirebaseApp);
export const auth = getAuth(FirebaseApp);

export default FirebaseApp;
