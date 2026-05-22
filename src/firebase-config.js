import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Đảm bảo import đúng từ "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQTfFKnyhaDLGERPp5dvd5SNoNRAP50hk",
  authDomain: "phenifood-2e33d.firebaseapp.com",
  projectId: "phenifood-2e33d",
  storageBucket: "phenifood-2e33d.firebasestorage.app",
  messagingSenderId: "139082170079",
  appId: "1:139082170079:web:2e12f70c5562333383336a",
  measurementId: "G-CGD5XD0JLR"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Authentication và Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Xuất đối tượng auth và firestore để sử dụng ở các tệp khác
export { auth, firestore };