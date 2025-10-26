
import axios from "../../../../utils/axiosInstance.js";

export function createAuthHandler({ endpoint, payload, validate, onSuccess, showToast }) {
  return async function handleSubmit(e) {
    e.preventDefault();

    if (validate && !validate()) return;

    try {
      const { data } = await axios.post(endpoint, payload);
      console.log("Auth success:", data);
      showToast?.(data.message || "Logged in successfully", "success");
      onSuccess?.();
    } catch (err) {
      console.error("Auth error:", err);
      showToast?.(err.response?.data?.message || "Authentication failed", "error");
    }
  };
}
