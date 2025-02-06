import { Industry, SettingResearchData } from "@/types/onboarding";
import Media_Agency from "/public/authIcons/media_marketing.svg";
import Research from "/public/authIcons/research_consultancy.svg";
import IndustryPartners from "/public/authIcons/eventPlanners.svg";
import EventParticipant from "/public/authIcons/enterprises.svg";
import InfraAndTechnology from "/public/authIcons/infra_technology.svg";
import Venue from "/public/authIcons/venue.svg";
import Others from "/public/authIcons/others.svg";

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
