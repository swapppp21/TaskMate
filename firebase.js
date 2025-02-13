import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDbPiZ1sOBs6_tc14_6Hc2Jgq_8gf3koo0",
  authDomain: "taskmate-6694e.firebaseapp.com",
  projectId: "taskmate-6694e",
  storageBucket: "taskmate-6694e.firebasestorage.app",
  messagingSenderId: "194015769539",
  appId: "1:194015769539:web:0f989901afbc929f7d8376",
  measurementId: "G-099MRC3YQR"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);
