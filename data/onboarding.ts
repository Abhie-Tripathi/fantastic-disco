import { Industry, SettingResearchData } from "@/types/onboarding";
import Media_Agency from "/public/authIcons/media_agency.svg";
import Research from "/public/authIcons/research.svg";
import IndustryPartners from "/public/authIcons/industry_partners.svg";
import EventParticipant from "/public/authIcons/event_participant.svg";
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
    name: "Media & Agency",
    slug: "media_agency",
    image: Media_Agency,
    type: "category",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: true,
  },
  {
    name: "Research",
    slug: "research",
    image: Research,
    type: "category",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: true,
  },
  {
    name: "Industry Partners",
    slug: "industry_partners",
    image: IndustryPartners,
    type: "location",
    mappedSettingResearch: mediaAgencyResearchData,
    subCategory: false,
  },
  {
    name: "Event Participant",
    slug: "event_participant",
    image: EventParticipant,
    type: "location",
    mappedSettingResearch: settingResearchData,
    subCategory: false,
  },
  {
    name: "Others",
    slug: "others",
    image: Others,
    type: "category",
    mappedSettingResearch: settingResearchData,
    subCategory: true,
  },
];
