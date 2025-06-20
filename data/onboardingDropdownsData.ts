import { TeliIndustry } from "@/types/onboarding";
import Hospitality from "/public/teliAuthIcons/industryIcons/Hotel.svg";
import Local_Commerce from "/public/teliAuthIcons/industryIcons/Local_Commerce.svg";
import Retail from "/public/teliAuthIcons/subIndustryIcons/Retail.svg";
import Quick_Commerce from "/public/teliAuthIcons/subIndustryIcons/Quick_Commerce.svg";
import Parking from "/public/teliAuthIcons/subIndustryIcons/Parking.svg";
import Real_Estate from "/public/teliAuthIcons/industryIcons/Real_Estate.svg";
import Travel from "/public/teliAuthIcons/industryIcons/Travel.svg";
import Venue from "/public/teliAuthIcons/industryIcons/venue.svg";
import Event_Planner from "/public/teliAuthIcons/industryIcons/Event_Planner.svg";
import Event_Supplier from "/public/teliAuthIcons/industryIcons/Event_Supplier.svg";
import DMO from "/public/teliAuthIcons/industryIcons/DMO.svg";
import Activity_Planner from "/public/teliAuthIcons/industryIcons/Activity_Planner.svg";
import Activity_Planners from "/public/teliAuthIcons/industryIcons/Activity_Planners.svg";
import Transportation_and_Logistics from "/public/teliAuthIcons/industryIcons/Transportation_and_Logistics.svg";
import Local_Government from "/public/teliAuthIcons/industryIcons/Local_Government.svg";
import Media_and_Marketing from "/public/teliAuthIcons/industryIcons/media_marketing.svg";
import Corporate_and_Brands from "/public/teliAuthIcons/industryIcons/enterprises.svg";
import Others from "/public/teliAuthIcons/industryIcons/others.svg";

export const industryData: TeliIndustry[] = [
  {
    name: "Hospitality",
    slug: "Hospitality",
    image: Hospitality,
    radius: 20,
    unit: "kilometers",
    type: "center",
  },
  {
    name: "Local Commerce",
    slug: "Local_Commerce",
    image: Local_Commerce,
    radius: 20,
    unit: "kilometers",
    type: "center",
    subIndustries: [
      {
        name: "Retail",
        slug: "Retail",
        image: Local_Commerce,
        radius: 10,
        unit: "kilometers",
        type: "center",
      },
      {
        name: "Quick-commerce",
        slug: "Quick_Commerce",
        image: Quick_Commerce,
        radius: 10,
        unit: "kilometers",
        type: "center",
      },
      {
        name: "Parking",
        slug: "Parking",
        image: Parking,
        radius: 2,
        unit: "kilometers",
        type: "center",
      },
      {
        name: "Local Government",
        slug: "Local_Government",
        image: Local_Government,
        radius: 10,
        unit: "kilometers",
        type: "center",
      },
      {
        name: "Others",
        slug: "Others",
        image: Others,
        radius: 20,
        unit: "kilometers",
        type: "center",
      },
    ],
  },
  {
    name: "Transportation and Logistics",
    slug: "Transportation_Logistics",
    image: Transportation_and_Logistics,
    type: "city",
  },
  {
    name: "Venue and Real estate",
    slug: "Venue_Real_Estate",
    image: Venue,
    radius: 20,
    unit: "kilometers",
    type: "center",
  },
  {
    name: "Event Planners",
    slug: "Event_Planners",
    image: Event_Planner,
    type: "city",
  },
  {
    name: "Civic Commerce and Tourism",
    slug: "Civic_Commerce_Tourism",
    image: DMO,
    type: "city",
  },
  {
    name: "Activity Planners",
    slug: "Activity_Planners",
    image: Activity_Planners,
    type: "city",
  },
  {
    name: "Media and Marketing",
    slug: "Media_Marketing",
    image: Media_and_Marketing,
    type: "city",
  },
  {
    name: "Corporate and Brands",
    slug: "Corporate_Brands",
    image: Corporate_and_Brands,
    type: "city",
  },
  {
    name: "Others",
    slug: "Others",
    image: Others,
    type: "city",
  },
];

export const eventStatus = "active,cancelled,postponed,predicted";
export const eventType =
  "community,concert,performing-arts,sport,festival,workshops,tradeshows,conferences";
