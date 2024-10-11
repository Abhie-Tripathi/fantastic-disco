const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export const endpoints = {
//   auth: {
//     me: `${BASE_URL}/me`,
//     signIn: `${BASE_URL}/auth/sign-in`,
//     signUp: `${BASE_URL}/auth/sign-up`,
//     logout: `${BASE_URL}/auth/logout`,
//     verifyOtp: `${BASE_URL}/auth/customer/verify`,
//     generateOtp: `${BASE_URL}/auth/customer/verify/generate`,
//   },
//   event: {
//     count: `${BASE_URL}/count`,
//     events: `${BASE_URL}/events`,
//     savedEvents: `${BASE_URL}/me/saved-events`,
//     recentSearches: `${BASE_URL}/me/recent-searches`,
//   },
//   designations: `${BASE_URL}/designations`,
//   categories: `${BASE_URL}/categories`,
//   exports: `${BASE_URL}/exports`,
//   tags: `${BASE_URL}/tags`,
//   trackers: `${BASE_URL}/trackers`,
//   regions: `${BASE_URL}/regions`,
//   locations: `${BASE_URL}/locations`,
//   savedLocations: `${BASE_URL}/me/saved-locations`,
//   savedLocationsV1: `${BASE_URL}/me/v1/saved-locations`,
//   savedLocationsInsights: `${BASE_URL}/me/saved-locations`,
//   trends: {
//     eventTrends: `${BASE_URL}/trends`,
//     predictedAttendance: `${BASE_URL}/trends/predicted-attendance`,
//     predictedEvents: `${BASE_URL}/trends/predicted-number-of-events`,
//     eventTypes: `${BASE_URL}/trends/event-types`,
//   },
locations: `${BASE_URL}/location/country`,
designations: `${BASE_URL}/designation`,
tracker:{
    create:`${BASE_URL}/tracker`,
    getTrackers: `${BASE_URL}/tracker`,
    getSavedEvents: `${BASE_URL}/tracker`,
    getNotes:`${BASE_URL}/comment?stage=INTERNAL&entityType=TRACKER`
}
};