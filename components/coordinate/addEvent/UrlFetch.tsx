import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import EventCard from "./EventCard";
import SimilarEventCard from "./SimilarEventCard";
// import NullState from "@/app/components/trackers/nullState";
import NullImage from "@/public/addEventNullState.svg";
import NullState from "./NullState";
import { useEffect, useState } from "react";
import { useCoordinateService } from "@/services/coordinateService";

const eventData = {
  name: "Arab Health",
  logo: "https://login.10times.com/upload/event/11281/eventlogo-22-1552279989.jpg",
  organizer: "Informa Middle East & Africa",
  startDate: "2019-01-28",
  endDate: "2019-01-31",
  venue: "Dubai International Convention & Exhibition Centre",
  state: "Dubai",
  city: "Dubai",
  country: "UAE",
  eventType: "Tradeshow",
};

interface Props {
  url: string;
}

const UrlFetch = ({ url }: Props) => {
  const [websiteUrl, setWebsiteUrl] = useState<string>(url ?? "");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const coordinateService = useCoordinateService();
  const [fetchedEvents, setFetchedEvents] = useState<any>([]);

  const hadleFetch = async () => {
    if (!websiteUrl) return;
    setIsFetching(true);

    const data = await coordinateService.fetchEvents(websiteUrl);

    setTimeout(() => {
      setIsFetching(false);
      if (data.totalCount > 0) {
        setFetchedEvents(data.events);
      }
    }, 1000);
  };

  const handleUrlChange = (name: string) => {
    setWebsiteUrl(name);
  };

  useEffect(() => {
    hadleFetch();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 bg-[var(--background-secondary-color)] px-3 py-4 border border-[var(--border-color)] rounded-sm">
        <Input
          id="name"
          className="rounded-sm bg-background focus-visible:border-none"
          placeholder="Enter web URL"
          value={websiteUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          // aria-invalid={error ? "true" : "false"}
          aria-describedby="name-error"
        />
        <Button onClick={hadleFetch} disabled={isFetching || websiteUrl.trim() === ""}>
          {isFetching ? "Fetching..." : "Fetch"}
        </Button>
      </div>

      {isFetching ? (
        <LoadingSkeleton />
      ) : fetchedEvents.length > 0 ? (
        <>
          <div className="my-2">
            <div className="flex gap-1 mb-1">
              <Image src={fetchIcon} height={18} width={18} alt="loading" />
              <span className="font-medium text-base">
                All set! Your events have been successfully fetched
              </span>
            </div>
            <div className="text-sm text-[var(--secondary-text-color)]">
              Here&apos;s What We Found for You! Choose from the events below and add
              them
            </div>
          </div>

          {fetchedEvents.map((item: any, index: number) => (
            <EventCard {...item} key={index} />
          ))}
          {/* <SimilarEventCard {...eventData} /> */}
        </>
      ) : (
        <NullState />
      )}
    </div>
  );
};

export default UrlFetch;
