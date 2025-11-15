import { auth, googleProvider } from "/src/utils/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "/src/utils/axiosInstance.js";

export const handleGoogleLogin = async (showToast, navigate) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const { data } = await axios.post(
      "/user/google",
      { token },
      { withCredentials: true }
    );

    showToast?.("Logged in successfully!", "success");
    
    // Redirect to events page after successful login
    navigate?.("/events", { replace: true });
  } catch (err) {
    console.error("Google login error:", err);
    showToast?.(err.response?.data?.message || "Google login failed", "error");
  }
};