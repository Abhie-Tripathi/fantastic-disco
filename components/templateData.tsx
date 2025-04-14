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
import { TemplateItem, StandardTemplateGroup } from "@/types/trackers";
type TemplateData = TemplateItem[] | StandardTemplateGroup[];
const data: TemplateData = isEventeli ?
  [
    {
      type: "template",
      domain: "",
      img: Location,
      url: "T_LOCATION",
      isEnabled: true,
      trackerName: "Location Tracker",
      content:
        "Keep a close eye on event activity within a specific city, state, or country to identify trends in new or canceled events.",
    },
    {
      type: "template",
      domain: "",
      isEnabled: true,
      img: Venue,
      url:"T_VENUE",
      trackerName: "Venue Tracker",
      content:
        "Define a specific venue's latitude and longitude, and track events within a set radius to capture nearby activity.",
    },
    {
      type: "template",
      domain: "",
      isEnabled: true,
      img: LocationDate,
      url: "T_GEOTIME",
      trackerName: "Location and Date Tracker",
      content:
        "Track events happening at a specific location over a defined date range to analyze both geographical and temporal trends.",
    }
  ]:
  [
    
      {
          heading: "Companies",
          subHeading: "From networking to results – Capture, track, and convert prospects seamlessly",
          templates:[
            {
                type: "template",
                domain: "Market Research",
                img: Competitor,
                isEnabled: true,
                url: "T_COMPETITOR",
                trackerName: "Competitor",
                content:
                  "Track your competitor experts, influencers and where they might be participating in events",
              },
              {
                  type: "template",
                  domain: "Market Research",
                  img: Customer,
                  url:"T_CUSTOMER_ICP",
                  isEnabled: true,
                  trackerName: "Customer ICP",
                  content:
                    "Input ideal customer profile details like company, location or websites to track their interests",
                },
                {
                  type: "template",
                  domain: "Market Research",
                  img: Customer,
                  isEnabled: false,
                  url:"",
                  trackerName: "Customer",
                  content:
                    "Discover events with highest customer matching effortlessly",
                },
          ]
      },
      {
          heading: "People",
          subHeading: "Effortlessly track and stay updated on where your people are.",
          templates:[
              {
                  type: "template",
                  domain: "Networking & Outreach",
                  img: PeopleFinder,
                  isEnabled: true,
                  url: "T_PEOPLE_FINDER",
                  trackerName: "People Finder",
                  content:
                    "Track experts, influencers and where they might be participating in various events",
                },
                {
                    type: "template",
                    domain: "Networking & Outreach",
                    img: Speaking,
                    isEnabled: true,
                    url: "T_SPEAKING_OPPORTUNITY",
                    trackerName: "Speaking Opportunity",
                    content:
                      "Input team members and their details to keep track of the events with speaking opportunities.",
                  },
                  {
                    type: "template",
                    domain: "Market Research",
                    img: Competitor,
                    isEnabled: false,
                    url: "",
                    trackerName: "Ideal Audience Designation",
                    content:
                      "Find relevant events based on your target audience profile",
                  }
                
          ]
      },
      {
        heading: "Purpose",
        subHeading: "Track your purpose, maximize impact and make every event count.",
        templates:[
          {
              type: "template",
              domain: "Market Research",
              img: Keywords,
              isEnabled: true,
              url:"T_PRODUCT_KEYWORDS",
              trackerName: "Product and Topics",
              content:
                "List all the events which belongs to given industry or associated with keywords.",
            },
            {
                type: "template",
                domain: "Networking & Outreach",
                isEnabled: false,
                img: PeopleFinder,
                url: "",
                trackerName: "Event Participation",
                content:
                  "Effortlessly track & Identify events similar to ones you already attend",
              },
              {
                  type: "template",
                  domain: "Networking & Outreach",
                  isEnabled: false,
                  img: Speaking,
                  url: "",
                  trackerName: "Event Goals",
                  content:
                    "Define your event goal and track relevant events",
                },
              ]  
      }
]

  export default data;