import arts from "/public/eventType/arts-outline.svg";
import community from "/public/eventType/community-outline.svg";
import conference from "/public/eventType/conference-outline.svg";
import concerts from "/public/eventType/concert-outline.svg";
import expo from "/public/eventType/expo-outline.svg";
import festivals from "/public/eventType/festival-outline.svg";
import sport from "/public/eventType/sport-outline.svg";
import workshop from "/public/eventType/workshop-outline.svg";
import Image from "next/image";

export const eventTypeIcons: Record<string, JSX.Element> = {
  conferences: <Image src={conference} alt="conference" className="w-4 h-4" />,
  expos: <Image src={expo} alt="expo" className="w-4 h-4" />,
  concert: <Image src={concerts} alt="concerts" className="w-4 h-4" />,
  sport: <Image src={sport} alt="sport" className="w-4 h-4" />,
  workshops: <Image src={workshop} alt="workshop" className="w-4 h-4" />,
  community: <Image src={community} alt="community" className="w-4 h-4" />,
  "performing-arts": <Image src={arts} alt="arts" className="w-4 h-4" />,
  festival: <Image src={festivals} alt="fests" className="w-4 h-4" />,
  tradeshows: <Image src={conference} alt="conference" className="w-4 h-4" />,
};  

export const eventTypeColors: Record<string, string> = {
  conferences: "#5055A3",
  expos: "#5055A3",
  concert: "#9D50A3",
  sport: "#9D50A3",
  "performing-arts": "#9D50A3",
  workshops: "#5055A3",
  community: "#9D50A3",
  arts: "#9D50A3",
  festival: "#9D50A3",
  tradeshows: "#5055A3",
  "": "#5055A3",
};

export const groupedEventTypes = {
  social: ["festival", "concert", "sport", "performing-arts", "community"],
  business: ["tradeshows", "conferences", "workshops"],
};
