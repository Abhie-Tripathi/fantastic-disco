import { Badge } from "@/components/ui/badge";
import { formattedDateRange } from "@/utils/date";
import { Calendar, Check, Cross } from "geist-icons";
import { useToast } from "@/hooks/use-toast";
import InterestSelector from "./InterestSelector";
import { useEffect, useState } from "react";
import { useConfiguration } from "@/hooks/useConfiguration";
import { InterestConfiguration } from "@/types/configuration";
import { useIntent } from "@/hooks/useIntent";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  logo?: string | null;
  organizer?: string;
  startDate: string;
  endDate: string;
  venue?: string | null;
  state?: string | null;
  city?: string | null;
  country?: string | null;
  eventType: string;
  participationType?: string | null;
  isProductEvent?: boolean;
  isEventAdded?: boolean;
}

const EventCard = (eventData: Props) => {
  const { toast } = useToast();
  const [eventRejected, setEventRejected] = useState<boolean>(false);

  const [eventAdded, setEventAdded] = useState<boolean>(eventData.isEventAdded || false);

  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error,
  } = useConfiguration.interest();

  const [selectedAction, setSelectedAction] = useState<InterestConfiguration>({
    status: "",
    label: "",
  });

  const event = {
    id: eventData.id,
    name: eventData.name,
    logoUrl: eventData.logo,
    organizer: eventData.organizer,
    startDateTime: eventData.startDate,
    endDateTime: eventData.endDate,
    address: [
      eventData.venue,
      eventData.city,
      eventData.state !== eventData.city ? eventData.state : null,
      eventData.country !== eventData.city ? eventData.country : null,
    ]
      .filter(Boolean)
      .join(", "),
    eventType: eventData.eventType,
  };

  const { createUserEventInterest, isLoading: isSubmitting } =
    useIntent.createUserEventInterest();

  const handleReject = (eventId: string) => {
    setEventRejected(true);
  };

  const handleSelect = (eventId: string, action: string) => {
    if (selectedAction.status === "") {
      toast({
        // title: "Success",
        description: "Please select action",
        variant: "destructive",
      });
      return;
    } else {
      // mark enquiry status
      createUserEventInterest(
        {
          eventId,
          interest: selectedAction.status,
          sourceModule: "RESEARCH",
        },
        {
          onSuccess: (response: any) => {
            toast({
              title: "Success",
              description: "Event added successfully!",
              variant: "default",
            });
            setEventAdded(true);
          },
          onError: (error) => {
            console.log(error);
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  useEffect(() => {
    if (interestConfiguration && eventData?.participationType) {
      const ss = interestConfiguration.interest.find(
        (item) =>
          item.label.toLowerCase() ===
          eventData?.participationType?.toLowerCase()
      );
      if (ss) setSelectedAction(ss);
    }
  }, []);

  if (eventRejected) return <></>;

  return (
    <div className="rounded-sm border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 px-4 p-3  relative flex gap-3 group w-full">
      {event.logoUrl && (
        <div className="w-14 h-14">
          <img
            src={event.logoUrl}
            alt={`logo`}
            className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
          />
        </div>
      )}
      <div className="flex flex-col gap-1.5 h-full w-full">
        {eventData?.isProductEvent ? (
          <div className="text-base font-medium">{event.name}</div>
        ) : (
          <Link
            href={`/internal/event/${event.id}`}
            className="text-base font-medium hover:text-primary transition-colors"
            target="_blank"
          >
            {event.name}
          </Link>
        )}
        <div className={`text-[var(--tertiary-text-color)] text-xs`}>
          {event.organizer}
        </div>
        <p className="text-xs capitalize">{event.address}</p>
        <div
          className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
        >
          <Calendar
            height={"14px"}
            width={"14px"}
            color="var(--secondary-text-color)"
          />
          <div>
            {formattedDateRange(event.startDateTime, event.endDateTime)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Badge
            variant="outline"
            className="text-[#0062D1] bg-[#E0EAF5]  capitalize rounded-sm"
          >
            {event.eventType}
          </Badge>

          <InterestSelector
            selectedHeader={selectedAction}
            changeSelectedHeader={setSelectedAction}
            options={interestConfiguration?.interest}
            disabledDropdown={eventAdded}
          />

          {isSubmitting ? (
            <Loader2 className="animate-spin text-primary" />
          ) : eventAdded ? (
            <div className="text-primary text-sm font-medium pr-2">Added</div>
          ) : (
            <div className={`flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity ${selectedAction.status ? "opacity-100" : ""}`}>
              {/* <Cross
                className="cursor-pointer"
                onClick={() => handleReject(event.id)}
                color="#DA2F35"
                height="16px"
              /> */}
              <Check
                className="cursor-pointer"
                onClick={() => handleSelect(event.id, "interestedAction")}
                color="#398E4A"
                height="16px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
