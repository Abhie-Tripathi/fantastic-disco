import React from 'react'
import TrackerLarge from './TrackerLarge';
import Template from "/public/template.svg";
import People from "/public/ionPeople.svg";
import PeopleFinder from "/public/peopleFinder.svg";
import Competitor from "/public/competitor.svg";
import Speaking from "/public/speaking.svg";
import Audience from "/public/audience.svg";
import Customer from "/public/customer.svg";
import Keywords from "/public/keywords.svg";
import SocialCause from "/public/socialCause.svg";
import Brand from "/public/brand.svg";
import TrackerSmall from './TrackerSmall';
import TrackerSmaller from './TrackerSmaller';

interface TrackerData {
  id : string;
  location : string[]
  name : string;
  newCount : number;
  expiredCount : number; 
  activeCount : number;
  type :string;
}
interface Props {
  width: string, trackers : TrackerData[]
}

const data = [
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
    url: "T_RECRUITMENT",
    trackerName: "Recruitment",
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
    domain: "Brand & Cause Management",
    img: Brand,
    trackerName: "Brand Building",
    url:"T_BRAND_BUILDING",
    content:
      "Input designations and keywords, and upload job descriptions to identify relevant events effortles",
  },
];
const TrackerContainer = ({ width, trackers }: Props) => {
  return (
    <div className='w-full h-fit overflow-hidden'>
        {width === "large" ? <TrackerLarge trackers={trackers} templates={data}/> : width ==="small" ? <TrackerSmall trackers={trackers} templates={data}/> : <TrackerSmaller trackers={trackers}/>}
    </div>
  )
}

export default TrackerContainer