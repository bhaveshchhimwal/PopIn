export const formatIST = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const eventIsActive = (ev) => {
  if (!ev) return false;
  if (ev.status && ev.status !== "upcoming") return false;
  if (!ev.date) return false;

  return new Date(ev.date).getTime() >= Date.now();
};