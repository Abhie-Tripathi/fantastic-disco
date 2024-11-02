import { Editions, Event, EventEditionDetailResponse } from "@/types/events";
import { differenceInDays, formatDate } from "date-fns";
import Text from "@/components/new-ui/Text";
import { useQuery } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { renderFormattedDates } from "@/utils/dateFormat";
interface IProps {
  eventId: string;
  eventEditionData: EventEditionDetailResponse;
}
interface LoadMoreProps {
  eventId: string;
  setEventEditionDetails: Dispatch<SetStateAction<Editions[] | undefined>>;
}
const take = 10;

const LoadMore = ({ eventId, setEventEditionDetails }: LoadMoreProps) => {
  console.log("Load More");
  const { getEventEditionDetails } = useEventsService();
  const [ref, inView] = useInView();
  const [skip, setSkip] = useState<number>(take);
  const { data: eventEditionData, isLoading } = useQuery<any>({
    queryKey: ["editionDetails", skip],
    queryFn: async () => getEventEditionDetails(eventId, take, skip),
    enabled: inView,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });
  useEffect(() => {
    if (inView) {
      console.log(inView);
      setSkip((prev) => prev + take);
    }
  }, [inView]);
  useEffect(() => {
    console.log("Getting data");
    if (eventEditionData) {
      setEventEditionDetails((prev = []) => [
        ...prev,
        ...eventEditionData.editions,
      ]);
    }
  }, [eventEditionData]);
  return (
    <li ref={ref} className="flex justify-center">
      {isLoading && (
        <Loader2 className="w-6 h-w-6 animate-spin self-center mt-4" />
      )}
    </li>
  );
};

const PastEditions = ({ eventId, eventEditionData }: IProps) => {
  // const { getEventEditionDetails } = useEventsService();
  const [eventEditionDetails, setEventEditionDetails] = useState<Editions[]>();
  const { count, editions } = eventEditionData;
  // const { data: eventEditionData, isLoading } = useQuery<any>({
  //   queryKey: ["eventEditionDetails", eventId],
  //   queryFn: async () => getEventEditionDetails(eventId, take, 0),
  // });
  // const count: number = eventEditionData && eventEditionData.count;
  useEffect(() => {
    if (editions) {
      setEventEditionDetails(editions);
    }
  }, [editions]);
  console.log(eventEditionData);
  if (!eventEditionDetails) return null;
  return (
    <ul className="h-[200px] flex flex-col gap-4 max-h-[200px] overflow-y-auto scrollbar pr-4 w-[400px] max-w-[400px]">
      <>
        <span className="text-[var(--primary-color)] font-semibold">
          {count}
        </span>
        {eventEditionDetails &&
          eventEditionDetails.map((pastEdition) => {
            const {
              edition_id,
              edition_start_date,
              edition_end_date,
              edition_venue_city_name,
              edition_venue_country_name,
            } = pastEdition;
            return (
              <li
                key={edition_id}
                className={`flex flex-col gap-2 bg-[#FAFAFA] border-[var(--neutral-light-color)]" border py-3 px-6 rounded-sm`}
              >
                <Text color="primary" fontWeight="medium">
                  {edition_start_date && edition_end_date
                    ? renderFormattedDates(edition_start_date, edition_end_date)
                    : "Date information not available"}
                </Text>
                <Text color="secondary" fontWeight="medium">
                  {[edition_venue_city_name, edition_venue_country_name]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </li>
            );
          })}
        {eventEditionDetails && eventEditionDetails.length > 5 && (
          <LoadMore
            eventId={eventId}
            setEventEditionDetails={setEventEditionDetails}
          />
        )}
      </>
    </ul>
  );
};
export default PastEditions;
