import axios from "../../../../utils/axiosInstance.js";

export function createAuthHandler({
  endpoint,
  getPayload,
  validate,
  onSuccess,
  onError,
  showToast,
}) {
  return async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (validate && !validate()) return;

      const payload = getPayload ? getPayload() : {};
      
      console.log('Sending request:', { endpoint, payload }); // Debug log
      
      const { data, status } = await axios.post(endpoint, payload);

      if (![200, 201].includes(status)) {
        showToast?.(data?.message || "Something went wrong", "error");
        return;
      }

      showToast?.(data?.message || "Success!", "success");
      onSuccess?.(data);
    } catch (err) {
      console.error("Auth error:", err);
     // console.error("Response data:", err.response?.data);
      const message = err.response?.data?.message || "Authentication failed. Please try again.";
      showToast?.(message, "error");
      onError?.(err);
    }
  };
}