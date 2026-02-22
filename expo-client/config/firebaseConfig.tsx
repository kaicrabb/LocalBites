// @ts-nocheck
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiwARV5sctCT9OSjFNJMmaB5Jkvb47HxQ",
  authDomain: "localbites-c3696.firebaseapp.com",
  projectId: "localbites-c3696",
  storageBucket: "localbites-c3696.firebasestorage.app",
  messagingSenderId: "1002500513104",
  appId: "1:1002500513104:web:5193906c42e30778cee055"
};

// 1. Initialize App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth with Persistence check
let auth;
if (getApps().length > 0) {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export const storage = getStorage(app);
export { auth };