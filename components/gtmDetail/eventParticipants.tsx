import Text from "../new-ui/Text";
import Image from "next/image";
import Link from "next/link";
import { GTMEventDetail } from "@/types/events";
import { Badge } from "@/components/ui/badge";

const exhibitorsData = [
  {
    name: "Hotbox",
    logo: "/gtmDetailIcons/hotbox.png",
    boothNo: "Stand - 4/C54",
  },
  {
    name: "Future Software",
    logo: "/gtmDetailIcons/future.png",
    boothNo: "Stand - 4/C2",
  },
  {
    name: "P & I Generators limited",
    logo: "/gtmDetailIcons/p&i.png",
    boothNo: "Stand - 4/A12",
  },
];

const speakersData = [
  {
    name: "Daniel Azar",
    logo: "/gtmDetailIcons/daniel.png",
    designation: "Chief Design officer at Zillow",
  },
  {
    name: "Jenny Arden",
    logo: "/gtmDetailIcons/jenny.png",
    designation: "Chief Design officer at Zillow",
  },
  {
    name: "John Smith",
    logo: "/gtmDetailIcons/john.png",
    designation: "Chief Design officer at Zillow",
  },
];

const sponsorsData = [
  {
    name: "@ Home Accommodation Services Ltd",
    logo: "/gtmDetailIcons/home.png",
  },
  {
    name: "RSS EXPRESS LTD T/A Ledbury Fuel Service Station",
    logo: "/gtmDetailIcons/rss.png",
  },
  {
    name: "Women's Association United",
    logo: "/gtmDetailIcons/women.png",
  },
];

const ListCard = ({ participant }: { participant: any }) => {
  return (
    <li className="flex flex-col bg-[#FAFAFA] border border-[var(--neutral-light-color)] p-3 rounded-sm gap-3 w-fill h-auto">
      <div className="flex flex-row justify-between">
        <div className="flex gap-4">
          <Image
            src={participant.logo}
            width={50}
            height={50}
            alt="Logo"
            className="aspect-square"
          />
          <p className="flex flex-col justify-between">
            <Text color="primary">{participant.name}</Text>
            {participant.boothNo && (
              <Text variant="noMargin" color="secondary">
                {participant.boothNo}
              </Text>
            )}
            {participant.designation && (
              <Text variant="noMargin" color="secondary">
                {participant.designation}
              </Text>
            )}
          </p>
        </div>
        <Badge variant={"secondary"} className="rounded-full h-fit">
          Tech Demo
        </Badge>
      </div>
    </li>
  );
};

const BadgeCount = ({ value }: { value: number | string }) => {
  return (
    <span className="bg-[var(--primary-color)] text-white text-sm font-semibold py-1 px-3 rounded-full">
      {value}
    </span>
  );
};

const NullState = ({ nullState }: { nullState: any }) => {
  const { logo, text, linkText } = nullState;
  return (
    <div className="flex flex-col items-center gap-4 justify-between">
      <Image src={logo} width={60} height={60} alt={"Participant Logo"} />
      <p className="text-center text-[#8F8F8F] font-medium">{text}</p>
      <Link
        href={""}
        className="text-[#6750A4] underline font-medium cursor-not-allowed"
      >
        {linkText}
      </Link>
    </div>
  );
};

const ParticipantContainer = ({
  count,
  heading,
  participantData,
  nullState,
}: {
  count: number | null;
  heading: string;
  participantData: any;
  nullState: any;
}) => {
  return (
    <div className="flex flex-col border border-[var(--neutral-light-color)] p-3 rounded-sm gap-6 w-full h-auto">
      <div className="flex gap-4 items-center">
        <Text variant="noMargin" fontWeight="medium">
          {heading}
        </Text>
        {count !== null && count !== 0 && (
          <BadgeCount value={count >= 3 ? 3 : count} />
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {count !== null && count > 0 ? (
          participantData
            .slice(0, count)
            .map((participant: any, index: number) => (
              <ListCard
                participant={participant}
                key={`paricipant-${participant.name}-${index}`}
              />
            ))
        ) : (
          <NullState nullState={nullState} />
        )}
        {count !== null && count > 3 && (
          <Link
            href={""}
            className="border border-[var(--neutral-light-color)] text-[var(--primary-color)] py-2 px-3 rounded-sm font-medium text-center cursor-not-allowed"
          >
            Show {count - 3} more
          </Link>
        )}
      </ul>
    </div>
  );
};

export const EventParticipants = ({
  eventDetails,
}: {
  eventDetails: GTMEventDetail;
}) => {
  const { exhibitorsCount, speakersCount, sponsorsCount } = eventDetails;
  const participantData = [
    {
      heading: "Exhibitors",
      count: exhibitorsCount,
      data: exhibitorsData,
      nullState: {
        logo: "/exhibitorsIcon.svg",
        text: "No Exhibitor mapped to this event. Want to Exhibit?",
        linkText: "Book a Booth",
      },
    },
    {
      heading: "Speakers",
      count: speakersCount,
      data: speakersData,
      nullState: {
        logo: "/speakersIcon.svg",
        text: "No Speakers mapped to this event. Are you interested to attend as a speaker?",
        linkText: "Speaker Request",
      },
    },
    {
      heading: "Sponsors",
      count: sponsorsCount,
      data: sponsorsData,
      nullState: {
        logo: "/sponsorsIcon.svg",
        text: "No Sponsors mapped to this event. Interested in sponsoring this event?",
        linkText: "Sponsor Request",
      },
    },
  ];
  return (
    <div className="flex flex-row gap-6">
      {participantData.map((participant) => {
        const { count, data, heading, nullState } = participant;
        return (
          <ParticipantContainer
            key={heading}
            count={count}
            heading={heading}
            participantData={data}
            nullState={nullState}
          />
        );
      })}
    </div>
  );
};
