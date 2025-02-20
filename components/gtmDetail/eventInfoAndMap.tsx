"use client";
import { Event, TTabs } from "@/types/events";
import { DetailMapComponent } from "../trendsWeather";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { CircleSlash, TriangleAlert } from "lucide-react";
import Text from "../new-ui/Text";
import { differenceInDays } from "date-fns";
import { capitalize } from "lodash";
// import TicketDetails from "../eventDetail/tickets";
// import DetailDialog from "../eventDetail/modal";
import { Button } from "@/components/ui/button";
import { numberWithCommas } from "@/utils/formater";
import { useInView } from "react-intersection-observer";
import CircularProgress from "../gtmDetailRelevanceScore/circularProgress";
import { Badge } from "../ui/badge";
import Link from "next/link";
import _ from "lodash";
import { useFilterContext } from "@/context/filterContext";
import { useRouter } from "next/navigation";
interface Props {
  eventDetails: Event["basic"];
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

export const EventInfoAndMap = ({
  eventDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
  const params = new URLSearchParams();
  const router = useRouter();
  const { enabledFilters } = useFilterContext();
  const currentDate = new Date().toISOString().split("T")[0];
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
  const {
    description,
    categories,
    startDateTime,
    endDateTime,
    eventLocation,
    tags,
    format,
    // tickets,
    entryType,
    website,
  } = eventDetails;

  const filteredTags = tags;

  const generateSearchEventsParams = (): string => {
    const enabledCategories =
      enabledFilters &&
      enabledFilters.eventCategory &&
      enabledFilters.eventCategory.enabledValue &&
      enabledFilters.eventCategory.enabledValue.length > 0
        ? enabledFilters.eventCategory.enabledValue
            .map((category) => category.slug)
            .join(",")
        : categories && categories.length > 0
        ? (() => {
            const groupedCategories = categories.filter(
              (category) => category.isGroup === true
            );
            return groupedCategories.length > 0
              ? groupedCategories
                  .slice(0, 2)
                  .map((category) => category.slug)
                  .join(",")
              : null;
          })()
        : null;

    const locationIds =
      (format === "offline" || format === "hybrid") && venueLocation
        ? venueLocation.country.id ||
          venueLocation.state.id ||
          venueLocation.city.id ||
          venueLocation.venue.id ||
          null
        : null;

    enabledCategories && params.set("categories", enabledCategories);
    locationIds && params.set("locationIds", locationIds);

    return params.toString();
  };

  return (
    <div className={`flex flex-col gap-6 ${scrollSection}`} ref={ref}>
      {/* <div className="flex gap-2 justify-center bg-[var(--negative-light-color)] border border-[#FDD8D8] p-2 rounded-sm text-sm">
        <TriangleAlert fill="#DA2F35" color="#FFEBEB" width={20} height={20} />
        <span>
          Possibility of
          <span className="text-[var(--negative-color)] font-semibold">
            {" "}
            Thuderstorms{" "}
          </span>
          and
          <span className="text-[var(--negative-color)] font-semibold">
            {" "}
            Heavy Rainfall{" "}
          </span>
          on event days
        </span>
      </div> */}
      <div className="flex flex-row gap-6 max-xl:flex-col w-full">
        <div className="flex flex-1 flex-col gap-5 max-xl:flex-none bg-[var(--primary-foreground)] border border-[var( --neutral-light-color)] dark:border-[var(--border-color)] p-6 rounded-sm max-xl:h-96 max-h-[831px] overflow-y-auto scrollbar">
          {
            <div>
              <h1 className="text-[1rem] mb-2 font-medium">
                Event Description
              </h1>
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
                  <CircleSlash width={15} height={15} />
                  No data available
                </span>
              )}
            </div>
          }
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
          {
            <div>
              <h1 className="text-[1rem] mb-2 font-medium">Event Keywords</h1>
              <ExpandableTags tags={filteredTags ?? []} />
            </div>
          }
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
          <div className={"gap-8 flex flex-col"}>
            <div className={"flex justify-between items-center"}>
              <span style={{ fontSize: "var(--font-size-default)" }}>
                Tracker Relevance Score
              </span>
              {/* <Link className={styles.addTrackerBtn} href={'/internal/trackers'} >Add to Tracker</Link> */}
              <Badge
                variant={"outline"}
                className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none h-fit"
              >
                Demo
              </Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress
                percentages={[80, 50, 70]}
                relevanceScore={"89"}
              />
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: "var(--font-size-large)" }}>80</div>
                <div
                  style={{
                    fontSize: "var(--font-size-default)",
                    padding: "4px 0",
                    color: "#646BDC",
                  }}
                >
                  People
                </div>
                <div
                  style={{
                    height: "13px",
                    background: "#646BDC",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: "var(--font-size-large)" }}>50</div>
                <div
                  style={{
                    fontSize: "var(--font-size-default)",
                    padding: "4px 0",
                    color: "#E99CD4",
                  }}
                >
                  Purpose
                </div>
                <div
                  style={{
                    height: "13px",
                    background: "#E99CD4",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: "var(--font-size-large)" }}>70</div>
                <div
                  style={{
                    fontSize: "var(--font-size-default)",
                    padding: "4px 0",
                    color: "#9B86D4",
                  }}
                >
                  Prospect
                </div>
                <div
                  style={{
                    height: "13px",
                    background: "#9B86D4",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <DetailMapComponent
            eventDetails={eventDetails}
            venueLocation={eventLocation}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
          />
          <div className="flex items-center justify-between bg-[#F6F6FF] dark:bg-[#2E2E2E] border border-[#E6E6F9] dark:border-[#2E2E2E] px-4 py-2 rounded-sm">
            <Text variant="noMargin" color="primary">
              Start searching similar events
            </Text>
            <Button
              className="w-fit max-lg:shadow-none max-lg:font-medium"
              onClick={() =>
                router.push(
                  `/internal/search/events?${generateSearchEventsParams()}`
                )
              }
            >
              Search Events
            </Button>
          </div>
          {/* <div className="flex gap-6">
            <div className="flex flex-col bg-[#FAFAFA] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
              <h1 className="text-[1rem] font-medium border-b pb-2 w-full">
                Predicted Attendance
              </h1>
              {estimatedAttendance ? (
                <p className="text-[#6750A4] font-semibold text-lg">
                  {numberWithCommas(estimatedAttendance)}
                </p>
              ) : (
                <span className="text-[#666666] text-sm flex items-center gap-2">
                  <CircleSlash width={15} height={15} />
                  No data available
                </span>
              )}
            </div>
            <div className="flex flex-col bg-[#FAFAFA] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
              <h1 className="text-[1rem] font-medium border-b pb-2 w-full">
                Predicted Spend
              </h1>
              <p className="text-[#6750A4] font-semibold text-lg">$3759K</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 bg-[#F6F6FF] border border-[#E6E6F9] px-4 py-6 rounded-sm">
            <Text variant="noMargin" color="primary" className="line-clamp-2">
              Create an event tracker for, real-time updates of upcoming and
              past events
            </Text>
            <Button className="cursor-not-allowed">Add to Tracker</Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
