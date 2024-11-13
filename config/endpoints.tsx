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
  event: {
    count: `${BASE_URL}/event/search`,
    events: `${BASE_URL}/event/search`,
    eventDetailById: `${BASE_URL}/event`,
    eventEditionsDetailsById: `${BASE_URL}/event/editions`,
    eventPOCDetailById: `${BASE_URL}/event-poc`,
    savedEvents: `${BASE_URL}/me/saved-events`,
    recentSearches: `${BASE_URL}/me/recent-searches`,
  },
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
  locationSuggestion: `${BASE_URL}/location/suggestion`,
  designations: `${BASE_URL}/designation`,
  users: `${BASE_URL}/auth/users`,
  tracker: {
    commonUrl: `${BASE_URL}/tracker`,
    access: `${BASE_URL}/tracker/access`,
    shareAccess: `${BASE_URL}/access`,
    createNewAccess: `${BASE_URL}/tracker/invite`,
    create: `${BASE_URL}/tracker`,
    getTrackers: `${BASE_URL}/tracker`,
    getSavedEvents: `${BASE_URL}/tracker`,
    saveEvent: `${BASE_URL}/tracker/saved-events`,
    getNotes: `${BASE_URL}/comment?stage=INTERNAL&entityType=TRACKER`,
    saveNotes: `${BASE_URL}/comment`,
  },

  // ---------------------------GENI ENDPOINTS--------------------
  brandkit:{
    getKit:`${BASE_URL}/kit`,
    create:`${BASE_URL}/kit`,
  },
  widget:{
    draftWidget:`${BASE_URL}/widget`,
    activeWidget:`${BASE_URL}/widget?status=active`,
    deActiveWidget:`${BASE_URL}/widget?`,
    onlyDraftWidget:`${BASE_URL}/widget?status=draft`,
    widgetById:`${BASE_URL}/widget`,
    widget:`${BASE_URL}/widget`
  },
  events:{
    getEvents:`${BASE_URL}/event?sortBy=start_date&sortType=asc&limit=2`,
    getEventsByWidgetId:`${BASE_URL}/event`,
    getSortedEvents:`${BASE_URL}/event`,
    getEventById:`${BASE_URL}/event`,
    getEventByPublicAPI:`${BASE_URL}/public/widget`,
    deleteEvent:`${BASE_URL}/event`,
    addEvent:`${BASE_URL}/event`,
    addSpeakers:`${BASE_URL}/event/speaker`,
    addExhibitors:`${BASE_URL}/event/speaker`,
    updateEvent:`${BASE_URL}/event`
  },
  intend:{
    getGuest:`${BASE_URL}/intend/users`,
    updateStatus:`${BASE_URL}/intend`,
    addIntend:`${BASE_URL}/intend`,
  },
  invite:{
    getInviteCount:`${BASE_URL}/invite?invites=true`,
    getSuggestions:`${BASE_URL}/invite`,
    sendInvite:`${BASE_URL}/invite/send`,
  }
};
