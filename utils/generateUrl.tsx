// export const getRestrictedUrl = (redirectTo: string, restrictedData: any) => {
//   const url = new URL(redirectTo || "", window.location.origin);
//   const params = new URLSearchParams(url.search);

//   if (restrictedData) {
//     if (
//       restrictedData.eventCategory &&
//       restrictedData.eventCategory.enabledValue.length > 0
//     ) {
//       params.delete("categories");
//     }
//     if (
//       restrictedData.locationIds &&
//       restrictedData.locationIds.enabledValue.length > 0
//     ) {
//       params.delete("locationIds");
//     }

//     if (
//       restrictedData.durations &&
//       restrictedData.durations.startDate &&
//       restrictedData.durations.endDate
//     ) {
//       params.delete("active_gte");
//       params.delete("active_lte");
//     }
//     if (
//       restrictedData.eventStatus &&
//       restrictedData.eventStatus.enabledValue.length > 0
//     ) {
//       params.delete("status");
//     }
//   }
//   return `${url.pathname}?${params.toString()}`;
// };

export const getRestrictedUrl = (redirectTo: string, restrictedData: any) => {
  const url = new URL(redirectTo || "", window.location.origin);
  const params = new URLSearchParams(url.search);
  if (restrictedData) {
    if (
      restrictedData.eventCategory &&
      restrictedData.eventCategory.enabledValue.length > 0
    ) {
      const categories = restrictedData.eventCategory.enabledValue
        .map((value: { slug: string }) => value.slug)
        .join(",");
      params.set("categories", categories);
    }
    if (
      restrictedData.locationIds &&
      restrictedData.locationIds.enabledValue.length > 0
    ) {
      const locationIds = restrictedData.locationIds.enabledValue
        .map((value: { id: string }) => value.id)
        .join(",");
      params.set("locationIds", locationIds);
    }

    if (
      restrictedData.durations &&
      restrictedData.durations.startDate &&
      restrictedData.durations.endDate
    ) {
      params.delete("active_gte");
      params.delete("active_lte");
    }
    if (
      restrictedData.eventStatus &&
      restrictedData.eventStatus.enabledValue.length > 0
    ) {
      const eventStatus = restrictedData.eventStatus.enabledValue
        .join(",")
        .toLowerCase();
      params.set("status", eventStatus);
    }
  }
  return `${url.pathname}?${params.toString()}`;
};
