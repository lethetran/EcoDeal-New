import { getAuth } from "firebase/auth";

export async function authFetch(url, options = {}) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Chưa đăng nhập");
  }

  const idToken = await user.getIdToken();

  const headers = {
    Authorization: `Bearer ${idToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
