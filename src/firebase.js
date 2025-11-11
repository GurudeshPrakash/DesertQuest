

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCSCJwPD7HNDuzWsioDR7ja6pt_DV9Fx-0",
  authDomain: "desert-quiz.firebaseapp.com",
  projectId: "desert-quiz",
  storageBucket: "desert-quiz.firebasestorage.app",
  messagingSenderId: "624860949415",
  appId: "1:624860949415:web:2ff6cdc4ff59a1effba482"
};


const app = initializeApp(firebaseConfig);

// ✅ Export singletons
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { app, auth, db,provider };