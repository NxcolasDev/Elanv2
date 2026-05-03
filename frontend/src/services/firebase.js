import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhusPZlc8j4jJS6hBcGkHdIIvmiaBVEGk",
  authDomain: "elan-app-4e1fa.firebaseapp.com",
  projectId: "elan-app-4e1fa",
  storageBucket: "elan-app-4e1fa.firebasestorage.app",
  messagingSenderId: "213295968045",
  appId: "1:213295968045:web:29288b23942646f034ada4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

