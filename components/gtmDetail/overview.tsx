"use client";
import { isEventeli } from "@/config";
import { Event, TTabs } from "@/types/events";
import { differenceInDays } from "date-fns";
import _, { capitalize } from "lodash";
import { CircleSlash } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import Text from "../new-ui/Text";
import { DetailMapComponent } from "../trendsWeather";
import AlertList from "./alertsList";
import SearchEventsCTAButton from "./searchEventsCTAButton";
import TrackerRelevanceScore from "./trackerRelevanceScore";

interface Props {
  eventDetails: Event;
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}

const TagList = ({
  tags,
  isExpanded,
}: {
  tags: Event["basic"]["tags"];
  isExpanded: boolean;
}) => {
  const displayedTags = isExpanded ? tags : tags.slice(0, tags.length);
  return displayedTags.map((tag) => (
    <li key={tag.slug}>
      <span className="text-[var(--primary-text-color)] text-sm py-1 px-3 border-[#C9C9C9] border rounded-full w-fit bg-[var(--primary-foreground)]">
        {capitalize(tag.name)}
      </span>
    </li>
  ));
};
const ExpandableTags = ({ tags }: { tags: Event["basic"]["tags"] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasTags = tags?.length > 0;

  if (!hasTags)
    return (
      <span className="text-[#666666] text-sm flex items-center gap-2">
        <CircleSlash width={15} height={15} />
        No data available
      </span>
    );

  const remainingTagsCount = tags.length - 20;

  return (
    <ul className="flex flex-row flex-wrap gap-3 items-center">
      <TagList tags={tags} isExpanded={isExpanded} />
      {remainingTagsCount > 0 && (
        <p
          className="text-[#6750A4] font-semibold text-sm cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : `+${remainingTagsCount} more`}
        </p>
      )}
    </ul>
  );
};

export const Overview = ({
  eventDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
  const [isExpandDescription, setisExpandDescription] =
    useState<boolean>(false);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  useMemo(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);
  const { alerts } = eventDetails || {};
  const {
    description,
    categories,
    startDateTime,
    endDateTime,
    eventLocation,
    tags,
    format,
    entryType,
    website,
  } = eventDetails.basic || {};

  const filteredTags = tags;

  const height = !isEventeli
    ? format === "online"
      ? "h-[486px]"
      : "h-[831px]"
    : isEventeli
    ? format === "online"
      ? ""
      : ""
    : "";
  return (
    <div className={`flex flex-col gap-6 ${scrollSection}`} ref={ref}>
      <AlertList alerts={alerts} />
      <div className="flex flex-row gap-6 max-xl:flex-col w-full">
        <div
          className={`flex flex-1 flex-col gap-5 max-xl:flex-none bg-[var(--primary-foreground)] border border-[var( --neutral-light-color)] dark:border-[var(--border-color)] p-6 rounded-sm max-xl:h-[410px] ${height} overflow-y-auto scrollbar`}
        >
          <div>
            <h1 className="text-[1rem] mb-2 font-medium">Event Description</h1>
            {description !== null && description !== undefined ? (
              <Text variant="noMargin" color="secondary">
                {isExpandDescription ? (
                  description === null || description === undefined ? (
                    <span className="text-[#666666] text-sm flex items-center gap-2">
                      <CircleSlash width={15} height={15} />
                      No data available
                    </span>
                  ) : (
                    description
                  )
                ) : description === null || description === undefined ? (
                  <span className="text-[#666666] text-sm flex items-center gap-2">
                    <CircleSlash width={15} height={15} />
                    No data available
                  </span>
                ) : (
                  description?.slice(0, 200)
                )}
                <span
                  className="font-semibold underline cursor-pointer ml-2"
                  onClick={() => setisExpandDescription(!isExpandDescription)}
                >
                  {description !== null &&
                  description !== undefined &&
                  description.length > 200
                    ? isExpandDescription
                      ? "Show Less"
                      : "Read More"
                    : ""}
                </span>
              </Text>
            ) : (
              <span className="text-[#666666] text-sm flex items-center gap-2">
                Description will appear here
              </span>
            )}
          </div>
          {categories && categories.length > 0 && (
            <div>
              <h1 className="text-[1rem] mb-2 font-medium">Category</h1>
              <ul className="flex flex-row flex-wrap gap-3">
                {categories.map((category: any) => (
                  <li key={category.id}>
                    <span className="text-[var(--primary-text-color)] text-sm py-1 px-3 border-[#C9C9C9] border rounded-full w-fit bg-[var(--primary-foreground)]">
                      {category.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {filteredTags.length > 0 && (
            <div>
              <h1 className="text-[1rem] mb-2 font-medium">Event Keywords</h1>
              <ExpandableTags tags={filteredTags ?? []} />
            </div>
          )}

          <div className="flex flex-row gap-6">
            <div className="flex flex-col border border-[var(--neutral-light-color)] bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] p-3 rounded-sm w-fill">
              <h1 className="text-[1rem] mb-2 font-medium border-b-[1px] pb-2">
                Entry Fees
              </h1>

              {entryType ? (
                <span className="text-[var(--primary-color)] font-semibold">
                  {_.startCase(_.toLower(_.replace(entryType, /_/g, " ")))}
                </span>
              ) : website ? (
                <Link
                  href={website}
                  target="_blank"
                  className="text-[var(--primary-color)] cursor-pointer font-medium"
                >
                  Check website
                </Link>
              ) : (
                <span className="text-[#666666] text-sm flex items-center gap-2">
                  <CircleSlash width={15} height={15} />
                  No data available
                </span>
              )}
              {/* {entryType && tickets && tickets.length > 0 && (
                <DetailDialog
                  title={"Entry Fees"}
                  triggerText={"View Details"}
                  className="text-xs text-[#666666] pt-4 underline cursor-pointer"
                >
                  <TicketDetails tickets={tickets ?? []} />
                </DetailDialog>
              )} */}
              {/* <span className="text-xs text-[#666666] pt-2 underline cursor-not-allowed">
                View details
              </span> */}
            </div>
            {startDateTime && endDateTime && (
              <div className="flex flex-col border border-[var(--neutral-light-color)] bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] p-3 rounded-sm w-fill">
                <h1 className="text-[1rem] mb-2 font-medium border-b-[1px] pb-2">
                  Event Timings
                </h1>
                <span className="text-[var(--primary-color)] font-semibold">
                  {differenceInDays(
                    new Date(endDateTime),
                    new Date(startDateTime)
                  ) === 0
                    ? 1
                    : differenceInDays(
                        new Date(endDateTime),
                        new Date(startDateTime)
                      ) + 1}
                  -day event
                </span>
                {/* <span className="text-xs text-[#666666] pt-2 underline cursor-not-allowed">
                  View details
                </span> */}
                {/* {differenceInDays(
                  new Date(endDateTime),
                  new Date(startDateTime)
                ) >= 1 &&
                  timings && (
                    <DetailDialog
                      title={"Event Timings"}
                      triggerText={"View Details"}
                      className="text-xs text-[#666666] pt-4 underline cursor-pointer"
                    >
                      <EventDates eventDetails={eventDetails} />
                    </DetailDialog>
                  )} */}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-8 max-xl:flex-none max-xl:h-fit w-auto bg-[var(--primary-foreground)] border border-[var( --neutral-light-color)] dark:border-[var(--border-color)] p-6 rounded-sm h-full">
          {!isEventeli && <TrackerRelevanceScore />}
          <DetailMapComponent
            eventDetails={eventDetails}
            venueLocation={eventLocation}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
          />
          {!isEventeli && (
            <SearchEventsCTAButton
              categories={categories}
              format={format}
              eventLocation={eventLocation}
            />
          )}
        </div>
      </div>
    </div>
  );
};
