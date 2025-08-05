export const companiesFilters = [
  "eventCategorySlugs",
  "companyLocationIds",
  "eventProductIds",
  "eventParticipationType",
  "communitySize",
  "eventLocationIds",
  "eventFollowers",
  "userNames",
  "userSocialLink",
  "userJobTitle",
];

export const basicFilters = [
  "status",
  "locationIds",
  "entryType",
  "eventFormats",
  "categories",
  "eventTypes",
  "ratings",
];

export const advancedFilter = [
  "onlyBranded",
  "onlySeries",
  "maturity",
  "trust_score_lte",
  "trust_score_gte",
  "top",
  "international_score_lte",
  "international_score_gte",
  "inbound_score_lte",
  "inbound_score_gte",
  "estimatedExhibitors",
  "excludeKeywords",
  "includeKeywords",
  "frequencies",
  "estimatedVisitorRangeTag",
  "designations",
  "audienceSpread",
];

export const filterGroups = [
  ["onlyBranded", "onlySeries"],
  ["includeKeywords", "excludeKeywords"],
  ["trust_score_lte", "trust_score_gte"],
  [
    "international_score_lte",
    "international_score_gte",
    "inbound_score_lte",
    "inbound_score_gte",
  ],
];

export function countFilters(localFilters: any, filterKeys: string[]) {
  let count = 0;
  const usedKeys = new Set<string>();
  for (const group of filterGroups) {
    if (
      group.some(
        (key) =>
          filterKeys.includes(key) &&
          localFilters[key] &&
          localFilters[key] !== "" &&
          localFilters[key] !== "[]"
      )
    ) {
      count++;
      group.forEach((key) => usedKeys.add(key));
    }
  }
  for (const key of filterKeys) {
    if (usedKeys.has(key)) continue;
    const value = localFilters[key];
    if (value && value !== "" && value !== "[]") {
      count++;
    }
  }
  return count;
}
