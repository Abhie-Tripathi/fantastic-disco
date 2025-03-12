import { Event, EventParticipantsDetails } from "@/types/events";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import Text from "../new-ui/Text";
import { Badge } from "../ui/badge";

const sponsorsData = [
  {
    id: "516cba2c-169f-46a5-a198-59e17564548f",
    name: "@ Home Accommodation Services Ltd",
    logo: "/gtmDetailIcons/home.png",
    details: "",
    type: "sponsor",
  },
  {
    id: "51b8de39-81dc-402e-81da-7440c391b50c",
    name: "RSS EXPRESS LTD T/A Ledbury Fuel Service Station",
    logo: "/gtmDetailIcons/rss.png",
    details: "",
    type: "sponsor",
  },
  {
    id: "2eb8bc9c-29af-4083-96ec-4cd239c6e99d",
    name: "Women's Association United",
    logo: "/gtmDetailIcons/women.png",
    details: "",
    type: "sponsor",
  },
];

const ListCard = ({
  participant,
}: {
  participant: EventParticipantsDetails;
}) => {
  return (
    <li className="flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-3 rounded-sm gap-3 w-fill h-20">
      <div className="flex flex-row justify-between">
        <div className="flex gap-4">
          <img
            src={
              participant.logo ||
              `https://img.10times.com/userimages/${
                participant.name.match(/[a-zA-Z]/)?.[0]?.toLowerCase() ||
                "default"
              }.jpg`
            }
            alt="Logo"
            className="aspect-square rounded-sm w-12 h-12"
          />
          <div className="flex flex-col justify-between">
            <p className="text-sm line-clamp-2 text-[var(--primary-text-color)] mb-1">
              {participant.name || ""}
            </p>
            <p className="text-sm line-clamp-2 text-[var(--secondary-text-color)]">
              {participant.type === "exhibitor"
                ? participant.details
                  ? `Booth - ${participant.details}`
                  : ""
                : participant.details}
            </p>
          </div>
        </div>
        {participant.type === "sponsor" && (
          <Badge
            variant={"outline"}
            className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none h-fit"
          >
            Demo
          </Badge>
        )}
      </div>
    </li>
  );
};

const BadgeCount = ({ value }: { value: number | string }) => {
  return (
    <span className="bg-[var(--primary-color)] text-white dark:text-[#131313] text-sm font-semibold py-1 px-3 rounded-full">
      {value}
    </span>
  );
};

const NullState = ({ nullState }: { nullState: any }) => {
  const { logo, text, linkText, redirectLink } = nullState;
  return (
    <div className="flex flex-col items-center gap-4 w-fit px-4 my-auto">
      <Image src={logo} width={60} height={60} alt={"Participant Logo"} />
      <p className="text-center text-[#8F8F8F] font-medium break-normal">
        {text}
      </p>
      <Link
        href={redirectLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#6750A4] underline font-medium"
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
  eventPageUrl,
  nullState,
}: {
  count: number | null;
  heading: string;
  participantData: any;
  eventPageUrl: string | null;
  nullState: any;
}) => {
  return (
    <div className="flex flex-col border border-[var(--neutral-light-color)] p-3 rounded-sm gap-6 w-full h-full relative dark:bg-transparent dark:border-[var(--border-color)]">
      <div className="flex gap-4 items-center">
        <Text variant="noMargin" fontWeight="medium">
          {heading}
        </Text>
        {count !== null && count !== 0 && (
          <BadgeCount value={_.padStart(String(count), 2, "0")} />
        )}
      </div>
      <ul className="flex flex-col gap-2 items-center h-full">
        {count !== null && count > 0 ? (
          participantData &&
          participantData.length > 0 &&
          participantData
            .slice(0, count)
            .map((participant: EventParticipantsDetails, index: number) => (
              <ListCard participant={participant} key={participant.id} />
            ))
        ) : (
          <NullState nullState={nullState} />
        )}
        {count !== null && count > 3 && (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={eventPageUrl ? `https://10times.com/${eventPageUrl}` : ""}
            className="border border-[var(--neutral-light-color)] w-full text-[var(--primary-color)] py-2 px-3 rounded-sm font-medium text-center dark:bg-transparent dark:border-[var(--border-color)]"
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
  eventExhibitorData,
  eventSpeakerData,
}: // eventSponsorData,
{
  eventDetails: Event;
  eventExhibitorData: EventParticipantsDetails[];
  eventSpeakerData: EventParticipantsDetails[];
  // eventSponsorData: EventParticipantsDetails[];
}) => {
  const { exhibitorsCount, speakersCount, sponsorsCount } =
    (eventDetails && eventDetails.insights) || {};
  const { "10timesEventPageUrl": eventPageUrl } =
    (eventDetails && eventDetails.basic) || {};

  const participantData = [
    {
      heading: "Exhibitors",
      count: exhibitorsCount,
      data: eventExhibitorData,
      nullState: {
        logo: "/exhibitorsIcon.svg",
        text: "No Exhibitor mapped to this event. Are you interested to Exhibit ?",
        linkText: "Exhibit Request",
        redirectLink: `https://10times.com/${eventPageUrl || ""}`,
      },
    },
    {
      heading: "Speakers",
      count: speakersCount,
      data: eventSpeakerData,
      nullState: {
        logo: "/speakersIcon.svg",
        text: "No Speakers mapped to this event. Are you interested to attend as a speaker?",
        linkText: "Speaker Request",
        redirectLink: `https://10times.com/${eventPageUrl || ""}`,
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
        redirectLink: `https://10times.com/${eventPageUrl || ""}`,
      },
    },
  ];
  return (
    ((exhibitorsCount ?? 0) > 0 ||
      (speakersCount ?? 0) > 0 ||
      (sponsorsCount ?? 0) > 0) && (
      <div className="flex flex-row gap-6 max-xl:flex-col h-96 max-xl:h-full">
        {participantData.map((participant) => {
          const { count, data, heading, nullState } = participant;
          return (
            <ParticipantContainer
              key={heading}
              count={count || 0}
              heading={heading}
              participantData={data}
              eventPageUrl={eventPageUrl}
              nullState={nullState}
            />
          );
        })}
      </div>
    )
  );
};
