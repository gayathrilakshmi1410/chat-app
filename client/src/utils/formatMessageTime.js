import moment from "moment";

export const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";

  const now = moment();
  const messageTime = moment(timestamp);

  if (messageTime.isSame(now, "day")) {
    // 📅 same day → show only time
    return messageTime.format("h:mm A");
  } else if (messageTime.isSame(moment().subtract(1, "day"), "day")) {
    // 📅 yesterday
    return "Yesterday";
  } else if (messageTime.isAfter(moment().subtract(7, "days"))) {
    // 📅 within last 7 days
    return messageTime.format("dddd"); // e.g., Monday
  } else {
    // 📅 older → show date
    return messageTime.format("MMM D");
  }
};
