import { auth } from "../firebaseConfig";

// Lấy ID Token của người dùng đã đăng nhập
const getToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// Gọi API Laravel có xác thực bằng Firebase Token
export const callSecureAPI = async () => {
  const token = await getToken();
  if (!token) throw new Error("User not logged in");

  const response = await fetch("http://localhost:8000/api/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};
