export const formatDateTime = (dateTime) => {
    const now = new Date();
    const date = new Date(dateTime);
  
    const isToday = now.toDateString() === date.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();
  
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    if (isToday) return date.toLocaleTimeString(undefined, timeOptions);
    if (isYesterday) return "Yesterday";
  
    const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;

    return `${Math.floor(daysAgo / 365)} years ago`;
  };