export const generateTicketNumber = () => {
  const randomPart = Math.random().toString(16).substring(2, 10).toUpperCase();
  return `TCK-${randomPart}`;
}
