import { Industry } from "@/types/onboarding";
import Media_Agency from "/public/authIcons/media_agency.svg";
import Research from "/public/authIcons/research.svg";
import IndustryPartners from "/public/authIcons/industry_partners.svg";
import EventParticipant from "/public/authIcons/event_participant.svg";
import Others from "/public/authIcons/others.svg";

export const settingsData = [
  { label: "Hot Lead" },
  { label: "Warm Lead" },
  { label: "Cold Lead" },
  { label: "Intent" },
];

export const industryData: Industry[] = [
  {
    name: "Media & Agency",
    slug: "media_agency",
    image: Media_Agency,
    type: "category",
    subCategory: true,
  },
  {
    name: "Research",
    slug: "research",
    image: Research,
    type: "category",
    subCategory: true,
  },
  {
    name: "Industry Partners",
    slug: "industry_partners",
    image: IndustryPartners,
    type: "location",
    subCategory: false,
  },
  {
    name: "Event Participant",
    slug: "event_participant",
    image: EventParticipant,
    type: "location",
    subCategory: false,
  },
  {
    name: "Others",
    slug: "others",
    image: Others,
    type: "category",
    subCategory: true,
  },
];
