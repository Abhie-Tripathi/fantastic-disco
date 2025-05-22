import Text from "@/components/new-ui/Text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Buildings, Location, Plus, Users } from "geist-icons";
import { Button } from "@/components/ui/button";
import { CircleSlash } from "lucide-react";
import { formatEventDates } from "@/utils/dateFormat";
import WorldMap from "../prospectDetail/worldMap";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/events";
import { useState } from "react";
import { useCompanyService } from "@/services/companyService";
import { formatLocationParts } from "@/utils/locationFormat";

interface Props {
  userId: string;
  upcomingEventsData: (Event & { association: string })[];
  upcomingEventsCount: number;
  pastEventsData: (Event & { association: string })[];
  pastEventsCount: number;
}

const getMonthFromDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = date.getMonth();
  return months[monthIndex];
};

function getDayFromDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  return day < 10 ? `0${day}` : `${day}`;
}

export const EventCalendar = ({
  userId,
  upcomingEventsData,
  upcomingEventsCount,
  pastEventsData,
  pastEventsCount,
}: // loadMoreEvents,
Props) => {
  const [pastEvents, setPastEvents] = useState<any[]>(pastEventsData);

  const [upcomingEvents, setUpcomingEvents] =
    useState<any[]>(upcomingEventsData);

  const { getUserEvents } = useCompanyService();

  const loadMoreEvents = async (type: string) => {
    if (type === "past") {
      const moreEvents = await getUserEvents(userId, "past", pastEvents.length);
      setPastEvents((prev) => [...prev, ...moreEvents?.events]);
    } else if (type === "upcoming") {
      const moreEvents = await getUserEvents(
        userId,
        "upcomming",
        upcomingEvents.length
      );
      setUpcomingEvents((prev) => [...prev, ...moreEvents?.events]);
    }
  };

  const activeTab = upcomingEventsCount > 0 ? "upcoming" : "past";
  return (
    <div className="flex gap-6 max-xl:flex-col">
      <div className="flex flex-1 flex-col gap-4 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 w-full">
        <div className="flex justify-between">
          <Text
            color="primary"
            fontWeight="medium"
            variant="noMargin"
            size="large"
          >
            Event Calendar
          </Text>
        </div>

        <div>
          <Tabs
            defaultValue={activeTab}
            className="h-full overflow-y-auto w-full"
          >
            <div className="flex w-full justify-between">
              <TabsList className="grid grid-cols-2 h-auto px-2">
                <TabsTrigger
                  value="upcoming"
                  className="text-xs flex gap-2 items-center p-2"
                >
                  <Buildings
                    color="var(--muted-foreground)"
                    width="12px"
                    height="12px"
                  />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="text-xs flex gap-2 items-center p-2"
                  // disabled={true}
                >
                  <Users color="#666666" width="12px" height="12px" />
                  Past
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="upcoming"
              className="max-h-80 overflow-y-auto w-full"
            >
              {upcomingEvents.map((event) => (
                <div
                  className="flex flex-row gap-6 p-2 my-4"
                  key={event.basic.id}
                >
                  <div className="flex flex-col rounded-lg shadow-md h-14 w-14 border border-[var(--border-color)]">
                    <span className="bg-[var(--primary-light-color)] text-xs font-semibold text-primary text-center py-1 rounded-tl-md rounded-tr-md">
                      {getMonthFromDate(event.basic.startDateTime)}
                    </span>
                    <span className="text-xs font-semibold text-center py-2">
                      {getDayFromDate(event.basic.startDateTime)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 flex-wrap">
                    <Link
                      href={`/internal/event/${event.basic.id}`}
                      target="_blank"
                    >
                      <Text fontWeight="medium" variant="noMargin">
                        {event.basic.name}
                      </Text>
                    </Link>
                    <p className="flex items-center gap-1 text-[12px]">
                      <Location
                        color="var(--muted-foreground)"
                        width="12px"
                        height="12px"
                      />
                      <span>
                        {formatLocationParts(event.basic.eventLocation, true)}
                      </span>
                    </p>

                    <p className="flex gap-2 items-center text-[#666666] text-[12px]">
                      <span
                        className={`${
                          event.basic.status === "postponed" ||
                          event.basic.status === "cancelled"
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {formatEventDates(
                          event.basic.startDateTime,
                          event.basic.endDateTime
                        )}
                      </span>
                      {event.basic.status === "cancelled" && (
                        <Badge
                          variant="outline"
                          className="border-destructive text-destructive px-1"
                        >
                          Cancelled
                        </Badge>
                      )}
                      {event.basic.status === "postponed" && (
                        <Badge
                          variant="outline"
                          className="border-[#FF990A] text-[#FF990A]"
                        >
                          Postponed
                        </Badge>
                      )}
                    </p>

                    {/* <p className="flex items-center gap-2 text-[12px] text-[#666666]">
                      <Plus
                        width="12px"
                        height="12px"
                        color="var(--muted-foreground)"
                      />
                      <span className="underline underline-offset-2">
                        Add to my calendar
                      </span>
                    </p> */}

                    <Badge
                      variant="outline"
                      className="border-[#FF990A] text-[#FF990A] w-fit"
                    >
                      {event.association}
                    </Badge>
                  </div>
                </div>
              ))}

              {upcomingEventsCount > upcomingEvents.length && (
                <Button
                  variant="outline"
                  onClick={() => loadMoreEvents("upcoming")}
                  className="w-full text-primary my-2"
                >
                  See {upcomingEventsCount - upcomingEvents.length} more events
                </Button>
              )}

              {upcomingEvents.length === 0 && (
                <span className="text-[#666666] text-sm flex items-center gap-2 my-4">
                  <CircleSlash width={15} height={15} />
                  Events spoken and attended by user will be listed here
                </span>
              )}
            </TabsContent>

            <TabsContent
              value="past"
              className="max-h-80 overflow-y-auto w-full"
            >
              {pastEvents.map((event) => (
                <div
                  className="flex flex-row gap-6 p-2 my-4"
                  key={event.basic.id}
                >
                  <div className="flex flex-col rounded-lg shadow-md h-14 w-14 border border-[var(--border-color)]">
                    <span className="bg-[var(--primary-light-color)] text-xs font-semibold text-primary text-center py-1 rounded-tl-md rounded-tr-md">
                      {getMonthFromDate(event.basic.startDateTime)}
                    </span>
                    <span className="text-xs font-semibold text-center py-2">
                      {getDayFromDate(event.basic.startDateTime)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 flex-wrap">
                    <Link
                      href={`/internal/event/${event.basic.id}`}
                      target="_blank"
                    >
                      <Text fontWeight="medium" variant="noMargin">
                        {event.basic.name}
                      </Text>
                    </Link>
                    <p className="flex items-center gap-1 text-[12px]">
                      <Location
                        color="var(--muted-foreground)"
                        width="12px"
                        height="12px"
                      />
                      <span>
                        {formatLocationParts(event.basic.eventLocation, true)}
                      </span>
                    </p>

                    <p className="flex gap-2 items-center text-[#666666] text-[12px]">
                      <span
                        className={`${
                          event.basic.status === "postponed" ||
                          event.basic.status === "cancelled"
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {formatEventDates(
                          event.basic.startDateTime,
                          event.basic.endDateTime
                        )}
                      </span>
                      {event.basic.status === "cancelled" && (
                        <Badge
                          variant="outline"
                          className="border-destructive text-destructive px-1"
                        >
                          Cancelled
                        </Badge>
                      )}
                      {event.basic.status === "postponed" && (
                        <Badge
                          variant="outline"
                          className="border-[#FF990A] text-[#FF990A]"
                        >
                          Postponed
                        </Badge>
                      )}
                    </p>

                    {/* <p className="flex items-center gap-2 text-[12px] text-[#666666]">
                      <Plus
                        width="12px"
                        height="12px"
                        color="var(--muted-foreground)"
                      />
                      <span className="underline underline-offset-2">
                        Add to my calendar
                      </span>
                    </p> */}

                    <Badge
                      variant="outline"
                      className="border-[#FF990A] text-[#FF990A] w-fit"
                    >
                      {event.association}
                    </Badge>
                  </div>
                </div>
              ))}

              {pastEventsCount > pastEvents.length && (
                <Button
                  variant="outline"
                  onClick={() => loadMoreEvents("past")}
                  className="w-full text-primary my-2"
                >
                  See {pastEventsCount - pastEvents.length} more events
                </Button>
              )}

              {pastEvents.length === 0 && (
                <span className="text-[#666666] text-sm flex items-center gap-2 my-4">
                  <CircleSlash width={15} height={15} />
                  Events spoken and attended by user will be listed here
                </span>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">
        <div className="flex justify-between">
          <Text
            color="primary"
            fontWeight="medium"
            variant="noMargin"
            size="large"
          >
            Events Participation
          </Text>
        </div>

        <WorldMap companyId={userId} source={"userDetail"} />

        {/* <div className="flex justify-between">
          <Text
            color="primary"
            fontWeight="medium"
            variant="noMargin"
            size="large"
          >
            Industry Interests
          </Text>
        </div>
        <div className="flex gap-3 items-center text-base font-medium text-[var(--primary-color)] bg-[var(--background-secondary-color)] p-2 rounded-md">
          <Tag
            color="#6E6F89"
            width="16px"
            height="16px"
            style={{ fill: "red" }}
          />
          <span>Pharma</span>
          <span>Hospital</span>
          <span>Medicines</span>
        </div> */}
      </div>
    </div>
  );
};
