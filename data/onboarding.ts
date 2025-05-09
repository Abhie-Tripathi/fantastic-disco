import { Industry, SettingResearchData } from "@/types/onboarding";
import EventParticipant from "/public/authIcons/enterprises.svg";
import IndustryPartners from "/public/authIcons/eventPlanners.svg";
import InfraAndTechnology from "/public/authIcons/infra_technology.svg";
import Media_Agency from "/public/authIcons/media_marketing.svg";
import Others from "/public/authIcons/others.svg";
import Research from "/public/authIcons/research_consultancy.svg";
import Venue from "/public/authIcons/venue.svg";

export const settingResearchData: SettingResearchData[] = [
  { label: "Bookmark", source: "research", status: "BOOKMARK", position: 0 },
  { label: "Attend", source: "research", status: "ATTENDEE", position: 0 },
  { label: "Speak", source: "research", status: "SPEAKER", position: 0 },
  { label: "Sponsor", source: "research", status: "SPONSOR", position: 0 },
  { label: "Exhibit", source: "research", status: "EXHIBITOR", position: 0 },
];

export const mediaAgencyResearchData: SettingResearchData[] = [
  { label: "Bookmark", source: "research", status: "BOOKMARK", position: 0 },
  { label: "Top", source: "research", status: "ATTENDEE", position: 0 },
  { label: "High", source: "research", status: "SPEAKER", position: 0 },
  { label: "Medium", source: "research", status: "SPONSOR", position: 0 },
  { label: "Low", source: "research", status: "EXHIBITOR", position: 0 },
];

export const industryData: Industry[] = [
  {
    name: "Media and Marketing",
    slug: "Media_Marketing",
    image: Media_Agency,
    type: "category",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: true,
  },
  {
    name: "Research and M&A",
    slug: "Research_MA",
    image: Research,
    type: "category",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: true,
  },
  {
    name: "Event Planners",
    slug: "Event_Planners",
    image: IndustryPartners,
    type: "category",
    mappedSettingResearch: settingResearchData,
    subCategory: true,
  },
  {
    name: "Corporates and Brands",
    slug: "Corporate_Brands",
    image: EventParticipant,
    type: "category",
    mappedSettingResearch: settingResearchData,
    subCategory: true,
  },
  {
    name: "Infra and Technology",
    slug: "Infra_Technology",
    image: InfraAndTechnology,
    type: "category",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: true,
  },
  {
    name: "Venue and Real Estate",
    slug: "Venue_Real_Estate",
    image: Venue,
    type: "category",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: true,
  },
  {
    name: "Others",
    slug: "Others",
    image: Others,
    type: "category",
    mappedSettingResearch: settingResearchData,
    subCategory: true,
  },
];

export const sessionKeys = [
  "flow",
  "categories",
  "subIndustry",
  "industry",
  "redirect",
];

export const dynamicPathPatterns = [
  // Namespace-based paths
  (p: string) => /^\/\[namespace\]\/settings$/.test(p),
  (p: string) => /^\/\[namespace\]\/settings\/notifications$/.test(p),
  (p: string) => /^\/\[namespace\]\/settings\/product$/.test(p),
  (p: string) => /^\/\[namespace\]\/settings\/profile$/.test(p),
  (p: string) => /^\/\[namespace\]\/settings\/rolesandpermission$/.test(p),
  (p: string) => /^\/\[namespace\]\/settings\/users$/.test(p),

  // Auth paths
  (p: string) => /^\/api\/auth\/\[\.\.\.nextauth\]$/.test(p),
  (p: string) => /^\/reset\/\[\.\.\.token\]$/.test(p),

  // ID-based paths
  (p: string) => /^\/detailpage\/\[id\]$/.test(p),
  (p: string) => /^\/employee\/\[eventDetail\]$/.test(p),
  (p: string) => /^\/company\/\[companyId\]$/.test(p),
  (p: string) => /^\/event\/\[eventId\]$/.test(p),
  (p: string) => /^\/user\/\[userId\]$/.test(p),
  (p: string) => /^\/widget\/edit\/\[id\]$/.test(p),

  // Tracker paths
  (p: string) => /^\/trackers\/\[trackerId\]$/.test(p),
  (p: string) => /^\/trackers\/\[trackerId\]\/editTracker$/.test(p),
  (p: string) => /^\/trackers\/\[trackerId\]\/manageAccess$/.test(p),
  (p: string) => /^\/trackers\/\[trackerId\]\/notesDiscussion$/.test(p),
  (p: string) => /^\/trackers\/\[trackerId\]\/savedEvents$/.test(p),
  (p: string) => /^\/trackers\/\[trackerId\]\/trackedConfiguration$/.test(p),
  (p: string) => /^\/trackers\/\[trackerId\]\/trackedEvents$/.test(p),

  // Widget event management paths
  (p: string) => /^\/widget\/events\/manage\/\[id\]$/.test(p),
  (p: string) => /^\/widget\/events\/manage\/\[id\]\/blasts$/.test(p),
  (p: string) => /^\/widget\/events\/manage\/\[id\]\/guests$/.test(p),
  (p: string) => /^\/widget\/events\/manage\/\[id\]\/overview$/.test(p),
  (p: string) => /^\/widget\/events\/manage\/\[id\]\/settings$/.test(p),

  // Other dynamic paths
  (p: string) => /^\/detailpage$/.test(p),
  (p: string) => /^\/forgot-password$/.test(p),
  (p: string) => /^\/location$/.test(p),
  (p: string) => /^\/login$/.test(p),
  (p: string) => /^\/signin$/.test(p),
  (p: string) => /^\/signup$/.test(p),
  (p: string) => /^\/verify-otp$/.test(p),
];

export const staticPathPatterns = [
  // Root paths
  (p: string) => p === "/",
  (p: string) => p === "/_not-found",

  // Employee paths
  (p: string) => p === "/employee",

  // Coordinate/Outreach paths
  (p: string) => p === "/coordinate",
  (p: string) => p === "/outreach",
  (p: string) => p === "/prospect",

  // Search paths
  (p: string) => p === "/search/companies",
  (p: string) => p === "/search/events",
  (p: string) => p === "/search/people",

  // Tracker paths
  (p: string) => p === "/trackers",
  (p: string) => p === "/trackers/create",
  (p: string) => p === "/trackers/savedevents",

  // Trends/Profile paths
  (p: string) => p === "/trends",
  (p: string) => p === "/profile",

  // Settings paths
  (p: string) => p === "/settings",
  (p: string) => p === "/settings/billingdetails",
  (p: string) => p === "/settings/company",
  (p: string) => p === "/settings/configurations",
  (p: string) => p === "/settings/pricingplans",
  (p: string) => p === "/settings/usermanagement",

  // Widget paths
  (p: string) => p === "/widget",
  (p: string) => p === "/widget/add",
  (p: string) => p === "/widget/brandkit",
  (p: string) => p === "/widget/dashboard",
  (p: string) => p === "/widget/events",
  (p: string) => p === "/widget/list",
  (p: string) => p === "/widget/setting",
  (p: string) => p === "/widget/setting/notifications",
];
