import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaeMoziKWIhd1GWTKJ_zsqumx9sm3osl8",
  authDomain: "visualtech-93d37.firebaseapp.com",
  projectId: "visualtech-93d37",
  storageBucket: "visualtech-93d37.appspot.com",
  messagingSenderId: "427088238457",
  appId: "1:427088238457:web:5bd0fd428f2ac2cc2381a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export default app;
