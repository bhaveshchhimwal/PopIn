
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCHcIgMP9v84X9N_QiqSBvpdqMGWiGlLnI",
  authDomain: "popin-510f1.firebaseapp.com",
  projectId: "popin-510f1",
  storageBucket: "popin-510f1.firebasestorage.app",
  messagingSenderId: "527174974247",
  appId: "1:527174974247:web:e1b46ea5896e6d38d28702",
  measurementId: "G-FE1QYDDK8J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);