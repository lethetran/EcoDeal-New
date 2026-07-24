import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Đảm bảo import đúng từ "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSrL_fPhL8z0j3yqYQSJP-Mpc0G1TSr0k",
  authDomain: "ecodeal-5e9fe.firebaseapp.com",
  projectId: "ecodeal-5e9fe",
  storageBucket: "ecodeal-5e9fe.firebasestorage.app",
  messagingSenderId: "686983155427",
  appId: "1:686983155427:web:a54813f229f3941e5fffd6",
  measurementId: "G-SEFEPDZEH3",
};

// Khởi tạo Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

// Khởi tạo Firebase Authentication và Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Xuất đối tượng auth và firestore để sử dụng ở các tệp khác
export { app, auth, firestore, storage, analytics };