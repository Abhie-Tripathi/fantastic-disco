/**
 * Constructs a URL with query parameters based on the provided restrictions.
 *
 * @param {string} redirectTo - The base URL to which the restricted parameters will be appended.
 * If an empty string is provided, the function defaults to the origin of the current window.
 *
 * @param {any} restrictedData - An object containing restriction criteria with possible fields such as:
 *    - eventCategory: { enabledValue: [{ slug: string }] } - Specifies the event categories to restrict.
 *    - locationIds: { enabledValue: [{ id: string }] } - Specifies the location IDs to restrict.
 *    - durations: { startDate: string, endDate: string } - Defines the date range restrictions.
 *    - eventStatus: { enabledValue: string[] } - Defines the statuses to restrict.
 *
 * @returns {string} - A new URL containing the specified query parameters based on the restrictions.
 * Example parameters added to the URL include:
 *    - categories: A comma-separated list of event category slugs.
 *    - locationIds: A comma-separated list of location IDs.
 *    - status: A comma-separated list of lowercase event statuses.
 */

export const getRestrictedUrl = (redirectTo: string, restrictedData: any): string => {
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
