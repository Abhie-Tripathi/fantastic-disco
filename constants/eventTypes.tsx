import arts from "/public/eventType/arts-outline.svg";
import community from "/public/eventType/community-outline.svg";
import conference from "/public/eventType/conference-outline.svg";
import concerts from "/public/eventType/concert-outline.svg";
import expo from "/public/eventType/expo-outline.svg";
import festivals from "/public/eventType/festival-outline.svg";
import sport from "/public/eventType/sport-outline.svg";
import workshop from "/public/eventType/workshop-outline.svg";
import earthquake from "/public/alert/earthquake.svg";
import fire from "/public/alert/fire.svg";
import flood from "/public/alert/flood.svg";
import tornado from "/public/alert/tornado.svg";
import tsunami from "/public/alert/tsunami.svg";
import volcano from "/public/alert/volcano.svg";
import holiday from "/public/eventType/holiday.svg";
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
  tradeshows: <Image src={expo} alt="tradeshows" className="w-4 h-4" />,
  holiday: <Image src={holiday} alt="holiday" className="w-4 h-4" />,
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
  holiday: "#444141",
  "": "#5055A3",
};

export const groupedEventTypes = {
  social: ["festival", "concert", "sport", "performing-arts", "community"],
  business: ["tradeshows", "conferences", "workshops"],
};


export const alertIcons: Record<string, JSX.Element> = {
  EARTHQUAKES: <Image src={earthquake} alt="earthquake" className="w-6 h-6" />,
  FOREST_FIRES: <Image src={fire} alt="fire" className="w-6 h-6" />,
  FLOODS: <Image src={flood} alt="flood" className="w-6 h-6" />,
  CYCLONES: <Image src={tornado} alt="tornado" className="w-6 h-6" />,
  TSUNAMIS: <Image src={tsunami} alt="tsunami" className="w-6 h-6" />,
  VOLCANIC_ERUPTIONS: <Image src={volcano} alt="volcano" className="w-6 h-6" />,
};

export const getAlertLevelBorderColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "green":
      return "border-[#398E4A]";
    case "orange":
      return "border-[#FF990A]";
    case "red":
      return "border-[#DA2F35]";
    default:
      return "border-gray-500";
  }
};

export const getAlertLevelBackgroundColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "green":
      return "bg-[#398E4A]";
    case "orange":
      return "bg-[#FF990A]";
    case "red":
      return "bg-[#DA2F35]";
    default:
      return "bg-gray-500";
  }
};
