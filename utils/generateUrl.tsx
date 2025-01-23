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
        .map((value: { id: any }) => value.id)
        .join(",");
      params.delete("categories");
      params.set("eventCategory", categories);
    }
    if (
      restrictedData.locationIds &&
      restrictedData.locationIds.enabledValue.length > 0
    ) {
      const locationIds = restrictedData.locationIds.enabledValue
        .map((value: { id: any }) => value.id)
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
      params.set("startDate", restrictedData.durations.startDate);
      params.set("endDate", restrictedData.durations.endDate);
    }
    if (
      restrictedData.eventType &&
      restrictedData.eventType.enabledValue.length > 0
    ) {
      const eventTypes = restrictedData.eventType.enabledValue
        .join(",")
        .toLowerCase();
      params.set("eventType", eventTypes);
    }
    if (
      restrictedData.eventFormat &&
      restrictedData.eventFormat.enabledValue.length > 0
    ) {
      const eventFormat = restrictedData.eventType.enabledValue
        .join(",")
        .toLowerCase();
      params.set("eventFormat", eventFormat);
    }
    if (
      restrictedData.eventStatus &&
      restrictedData.eventStatus.enabledValue.length > 0
    ) {
      const eventStatus = restrictedData.eventStatus.enabledValue
        .join(",")
        .toLowerCase();
      params.set("eventStatus", eventStatus);
    }
    if (
      restrictedData.eventEntry &&
      restrictedData.eventEntry.enabledValue.length > 0
    ) {
      const eventEntry = restrictedData.eventEntry.enabledValue.join(",");
      params.set("eventEntry", eventEntry);
    }
    if (
      restrictedData.eventRating &&
      restrictedData.eventRating.enabledValue.length > 0
    ) {
      const eventRating = restrictedData.eventRating.enabledValue
        .join(",")
        .toLowerCase();
      params.set("eventRating", eventRating);
    }
  }
  return `${url.pathname}?${params.toString()}`;
};
