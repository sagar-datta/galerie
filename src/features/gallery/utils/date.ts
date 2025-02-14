export const formatDateTime = (dateTimeStr: string | undefined | null) => {
  if (!dateTimeStr) return "";

  // Input format: "2024:12:27 13:44:49"
  const [date, time] = dateTimeStr.split(" ");
  const [year, month, day] = date.split(":");

  // Create a date object
  const dateObj = new Date(`${year}-${month}-${day}T${time}`);

  // Format the date in a more readable way
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time in 12-hour format
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${formattedDate} at ${formattedTime}`;
};
