import { Ranking } from "@/types/events";

export function getLeastRank(response: Ranking) {
  let minRank = {
    rank: Infinity,
    name: "",
    type: "",
  };

  if (response?.globalRank !== undefined) {
    minRank.rank = response.globalRank;
    minRank.name = "";
    minRank.type = "Global";
  } else if (response?.countryRank !== undefined) {
    minRank.rank = response.countryRank;
    minRank.name = "";
    minRank.type = "Country";
  } else if (response?.categoryRank) {
    const c_ranks = response.categoryRank;
    for (const category in c_ranks) {
      if (c_ranks[category] < minRank.rank) {
        minRank.rank = c_ranks[category];
        minRank.name = category;
        minRank.type = "Category";
      }
    }
  } else if (response?.countryCategoryRank) {
    const c_ranks = response.countryCategoryRank;
    for (const category in c_ranks) {
      if (c_ranks[category] < minRank.rank) {
        minRank.rank = c_ranks[category];
        minRank.name = category;
        minRank.type = "Country Category";
      }
    }
  }

  if (minRank.type === "") {
    return "-";
  }
  return getEventRank(minRank);
}

interface rankTag {
  rank: number;
  type: string;
  name: string;
}

export function getForecastedStatus(data: any) {
  if (!data && data === "") return "-";

  const forecastDate = new Date(data);
  const today = new Date();

  if (forecastDate >= today) {
    return forecastDate.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } else return "-";
}

export function getEventRating(item: string) {
  let averageRating = parseFloat(item);
  if (averageRating !== undefined && averageRating !== null) {
    if (averageRating >= 4.5) {
      return "4.5 - 5.0";
    } else if (averageRating >= 4 && averageRating < 4.5) {
      return "4.0 - 4.5";
    } else if (averageRating >= 3 && averageRating < 4) {
      return "3.0 - 4.0";
    } else if (averageRating < 3 && averageRating > 0) {
      return "<3";
    }
  }
  return "";
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}
