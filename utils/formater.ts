// export function numberWithCommas(x: string | number) {
//   console.log(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

export function numberWithCommas(range: string) {
  if (range === "0" || !range) {
    return "--";
  }
  const parts = range.split("-").map((part) => part.trim());
  const formattedParts = parts.map((part) => {
    const number = parseInt(part, 10);
    if (number >= 1000) {
      return Number((number / 1000).toPrecision(2)) + "k";
    } else {
      return number.toString();
    }
  });

  return formattedParts.join(" - ");
}

export function normalizeLat(lat: number) {
  lat = ((lat + 90) % 180) - 90;

  return lat;
}

export function normalizeLon(lon: number) {
  lon = ((lon + 180) % 360) - 180;

  return lon;
}
