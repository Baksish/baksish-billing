export const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return formattedDate.replace(",", " - ");
  };