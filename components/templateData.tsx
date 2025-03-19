import People from "/public/ionPeople.svg";
import PeopleFinder from "/public/peopleFinder.svg";
import Competitor from "/public/competitor.svg";
import Speaking from "/public/speaking.svg";
import Audience from "/public/audience.svg";
import Customer from "/public/customer.svg";
import Keywords from "/public/keywords.svg";
import SocialCause from "/public/socialCause.svg";
import Brand from "/public/brand.svg";
import Location from "/public/locationTracker.svg"
import Venue from '/public/venueTracker.svg';
import LocationDate from '/public/locationTracker.svg'
import { isEventeli } from "@/config";
const data = isEventeli ?
  [
    {
      type: "template",
      domain: "",
      img: Location,
      url: "T_LOCATION",
      trackerName: "Location Tracker",
      content:
        "Keep a close eye on event activity within a specific city, state, or country to identify trends in new or canceled events.",
    },
    {
      type: "template",
      domain: "",
      img: Venue,
      url:"T_VENUE",
      trackerName: "Venue Tracker",
      content:
        "Define a specific venue's latitude and longitude, and track events within a set radius to capture nearby activity.",
    },
    {
      type: "template",
      domain: "",
      img: LocationDate,
      url: "T_GEOTIME",
      trackerName: "Location and Date Tracker",
      content:
        "Track events happening at a specific location over a defined date range to analyze both geographical and temporal trends.",
    }
  ]:
  [
    {
      type: "template",
      domain: "Market Research",
      img: Competitor,
      url: "T_COMPETITOR",
      trackerName: "Competitor",
      content:
        "Track your competitor experts, influencers and where they might be participating in events",
    },
    {
      type: "template",
      domain: "Market Research",
      img: Keywords,
      url:"T_PRODUCT_KEYWORDS",
      trackerName: "Product and Topics",
      content:
        "List all the events which belongs to given industry or associated with keywords.",
    },
    {
      type: "template",
      domain: "Networking & Outreach",
      img: Speaking,
      url: "T_SPEAKING_OPPORTUNITY",
      trackerName: "Speaking Opportunity",
      content:
        "Input team members and their details to keep track of the events with speaking opportunities.",
    },
    {
      type: "template",
      domain: "Networking & Outreach",
      img: PeopleFinder,
      url: "T_PEOPLE_FINDER",
      trackerName: "People Finder",
      content:
        "Track experts, influencers and where they might be participating in various events",
    },
    {
      type: "template",
      domain: "Talent Acquisition",
      img: People,
      trackerName: "Recruitment",
      url: "T_RECRUITMENT",
      content:
        "Input designations and keywords, and upload job descriptions to identify relevant events effortlessly...",
    },
    {
      type: "template",
      domain: "Audience Analysis",
      img: Audience,
      url:"T_AUDIENCE_DEPT_PROFILE",
      trackerName: "Audience Dept. & Profiles",
      content:
        "Track events for the specific organizational departments or audience profiles",
    },
    {
      type: "template",
      domain: "Market Research",
      img: Customer,
      url:"T_CUSTOMER_ICP",
      trackerName: "Customer ICP",
      content:
        "Input ideal customer profile details like company, location or websites to track their interests",
    },
    {
      type: "template",
      domain: "Brand & Cause Management",
      img: SocialCause,
      trackerName: "Social Cause",
      url:"T_SOCIAL_CAUSE",
      content:
        "Track social cause events that interests audience to be socially active and enhance their reach",
    },
    {
      type: "template",
      img: Brand,
      domain: "Brand & Cause Management",
      trackerName: "Brand Building",
      url:"T_BRAND_BUILDING",
      content:
        "Input designations and keywords, and upload job descriptions to identify relevant events effortles",
    },
  ];

  export default data;