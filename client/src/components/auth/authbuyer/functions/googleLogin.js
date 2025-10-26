import { auth, googleProvider } from "/src/utils/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "/src/utils/axiosInstance.js";

export const handleGoogleLogin = async (showToast) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const { data } = await axios.post(
      "/user/google",
      { token },
      { withCredentials: true }
    );

    // Update user state
   // setUser?.(data);

    showToast?.("Logged in successfully!", "success");
  } catch (err) {
    console.error("Google login error:", err);
    showToast?.(err.response?.data?.message || "Google login failed", "error");
  }
};
