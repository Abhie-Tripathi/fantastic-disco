import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formattedDateRange } from "@/utils/date";
import { Calendar, Check, Cross } from "geist-icons";
import { useToast } from "@/hooks/use-toast";
import InterestSelector from "./InterestSelector";
import { useState } from "react";
import { useConfiguration } from "@/hooks/useConfiguration";
import { InterestConfiguration } from "@/types/configuration";
import { useIntent } from "@/hooks/useIntent";

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
}

const EventCard = (eventData: Props) => {
  const { toast } = useToast();
  const [eventRejected, setEventRejected] = useState<boolean>(false);

  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error,
  } = useConfiguration.interest();
  console.log("interestConfiguration", interestConfiguration);

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
      eventData.venue || "TBA",
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
    console.log("handleReject", eventId);
    setEventRejected(true);
  };

  const handleSelect = (eventId: string, action: string) => {
    console.log("handleSelect", eventId, action, selectedAction);

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

  if (eventRejected) return;

  return (
    <div className="rounded-sm border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 w-4/5 px-4 p-3  relative flex gap-3 group">
      {event.logoUrl && (
        <div className="w-14 h-14">
          <img
            src={event.logoUrl}
            alt={`logo`}
            className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 h-full w-full">
        <div className="text-base font-medium">{event.name}</div>
        <div className={`text-[var(--tertiary-text-color)] text-sm`}>
          {event.organizer}
        </div>
        <p className="text-sm capitalize">{event.address}</p>
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
        <div className="flex justify-between">
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
          />

          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Cross
              className="cursor-pointer"
              onClick={() => handleReject(event.id)}
              color="#DA2F35"
              height="16px"
            />
            <Check
              className="cursor-pointer"
              onClick={() => handleSelect(event.id, "interestedAction")}
              color="#398E4A"
              height="16px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
