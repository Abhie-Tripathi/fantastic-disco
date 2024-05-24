export function convertISOToOriginalFormat(isoString: string) {
    const dateObject = new Date(isoString);
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString("default", { month: "short" });
    const year = dateObject.getFullYear();
    return `${day} ${month}`;
  }