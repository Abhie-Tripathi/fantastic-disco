import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formattedDateRange } from "@/utils/date";
import { Calendar, Check, Cross } from "geist-icons";

interface Props {
  name: string;
  logo: string;
  organizer: string;
  startDate: string;
  endDate: string;
  venue: string;
  state: string;
  city: string;
  country: string;
}

const EventCard = (eventData: Props) => {
  // console.log('event', event);

  // const [listExpanded, setListExpanded] = useState<boolean>(false);

  const event = {
    name: eventData.name,
    logoUrl: eventData.logo,
    organizer: eventData.organizer,
    startDateTime: eventData.startDate,
    endDateTime: eventData.endDate,
    address: `${eventData.venue}, ${eventData.state}, ${eventData.country}`,
  };
  return (
    <div className="rounded-sm border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 w-4/5 px-4 p-3  relative flex gap-3 group">
      {/* <div className="col-span-3 w-full px-4 p-3  relative flex gap-3 group"> */}
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
            CONFERENCE
          </Badge>

          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Cross className="cursor-pointer" color="#DA2F35" height="16px" />
            <Check className="cursor-pointer" color="#398E4A" height="16px" />
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* <div className="text-primary col-span-1 flex items-end justify-center text-sm">
        <Button size="sm" className="w-fit">
          Add
        </Button>
      </div> */}
    </div>
  );
};

export default EventCard;
