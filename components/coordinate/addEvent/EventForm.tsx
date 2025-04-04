// import AttendeeIcon from "/public/widgetimages/attendeeIcon.svg";
// import SpeakerIcon from "/public/widgetimages/speakerIcon.svg";
// import ExhibitorIcon from "/public/widgetimages/exhibitorIcon.svg";
// import OrganiserIcon from "/public/widgetimages/organiserIcon.svg";
// import Image from "next/image";
// import placeHolder from "@/public/placeholder.png";
import Placeholder from "@/public/placeholder.png";
// import EventType from "./eventType";
// import ParticipationMode from "./participationMode";
// import DateTimeContainer from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/DateTimeContainer";
import { FormState } from "@/types/Formstate";
// import LocationContainer from "@/app/components/TemplateViewsNew/AddEventForm/Details/location/LocationContainer";
// import { Button } from "../../ui/button";
// import ParticipationMode from "./participationMode";
import Details from "@/app/components/TemplateViewsNew/AddEventForm/Details/Details";
import { useEffect, useRef, useState } from "react";
import SimilarEventCard from "./SimilarEventCard";
// import EventCard from "./EventCard";
// import fetchIcon from "@/public/internal/fetch_icon.svg";
import { useCoordinateService } from "@/services/coordinateService";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAuthContext } from "@/context";
import { useToast } from "@/hooks/use-toast";

interface Props {
  eventFormState: "default" | "similarEvents" | "editEvents" | "fetching" | "validating";
  setEventFormState: any;
  resetForm: any;
}

const eventData = {
  name: "Arab Health",
  // logo: "https://login.10times.com/upload/event/11281/eventlogo-22-1552279989.jpg",
  // organizer: "Informa Middle East & Africa",
  startDate: "2019-01-28",
  endDate: "2019-01-31",
  // venue: "Dubai International Convention & Exhibition Centre",
  // state: "Dubai",
  city: "Dubai",
  country: "UAE",
  eventType: "Tradeshow",
};

const EventForm = ({ eventFormState, setEventFormState, resetForm }: Props) => {
  //   const participationOptions = [
  //     { label: "Attendee", value: "Attendee", icon: AttendeeIcon },
  //     { label: "Speaker", value: "Speaker", icon: SpeakerIcon },
  //     { label: "Exhibitor", value: "Exhibitor", icon: ExhibitorIcon },
  //     { label: "Organiser", value: "Organiser", icon: OrganiserIcon },
  //   ];

  const { user } = useAuthContext();

  const [eventData, setEventData] = useState<any>();

  const [similarEvents, setSimilarEvents] = useState<any>([]);

  const coordinateService = useCoordinateService();

  const { toast } = useToast();

  const formState = {
    startDate: "2025-04-12",
    endDate: "2025-04-13",
    startTime: "12:00 A.M",
    endTime: "12:00 A.M",
    timeZone: "GMT+05:30 Chennai",
    timeZoneKey: 1,
    eventFormat: "In-person",
    cityName: "",
    countryName: "",
    virtualLink: "",
    query: "",
  };

  const prefilledEvent: any = {};
  const prefilledSubEvent: any = {};
  const prefilledGlobalEvent: any = {};

  const initialFormState: FormState = {
    parentData: "",
    descriptionModal: false,
    speakerModal: false,
    registerModal: false,
    eventName: "",
    participationType: "",
    description: "",
    textValue: "",
    cityName: "",
    speaker: [],
    prefilledProfile: undefined,
    registerMessage: "Welcome! To join the event, please register below.",
    registerBtnText: "Register",
    registerBtnColor: "#1a1a1a",
    countryName: "",
    timeZone: "GMT+05:30 Chennai",
    timeZoneKey: 1,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    // eventFormat: prefilledEvent?.customizationData.eventFormat || prefilledSubEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person",
    eventFormat: "In-person",
    boothNumber: "",
    participationMessage: "",
    banner: { placeHolder: Placeholder, file: null },
    venue: "",
    latitude: Number(''),
    longitude: Number(''),
    hashtags: [],
    query: "",
    isEventNameEmpty: false,
    isEventFormatEmpty: false,
    isEventDescriptionEmpty: false,
    isEventParticipationEmpty: false,
    isParticipationMessageEmpty: false,
    isEventTypeEmpty: false,
    isTextValueMessageEmpty: false,
    errorMessage: "Event name is required.",
    capacity: -1,
    registration: true,
    approval: false,
    waitlisting: false,
    capacityModal: false,
    virtualLink: "",
    exhibitorModal: false,
    exhibitor: [],
    prefilledExhibitorDetails: undefined,
    event_type: "",
  };

  const [isApproved, setIsApproved] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mainEventState, setMainEventState] =
    useState<FormState>(initialFormState);

  // const handleChange = () => {};

  const handleChange = (field: keyof FormState, value: any) => {
    setMainEventState((prev) => ({ ...prev, [field]: value }));
  };

  const setLoadingState = () => {};

  const handleCollapseForm = () => {};

  const checkFormValidation = (callback: any) => {

    if (!mainEventState.eventName || mainEventState.eventName === "") {
      handleChange('isEventNameEmpty', true);
      // handleChange('isEventFormatEmpty', true);
    } else {
      handleChange('isEventNameEmpty', false);
    }

    if (!mainEventState.participationType) {
      handleChange('isEventParticipationEmpty', true);
    } else {
      handleChange('isEventParticipationEmpty', false);
    }

    if (!mainEventState.event_type) {
      handleChange('isEventTypeEmpty', true)
    } else {
      handleChange('isEventTypeEmpty', false)
    }

    if ((!mainEventState.query && !mainEventState.latitude) || !mainEventState.longitude) {
      handleChange('isEventFormatEmpty', true);
    } else {
        handleChange('isEventFormatEmpty', false);
    }
    
    if (
      !mainEventState.eventName.trim() ||
      !mainEventState.eventFormat ||
      !mainEventState.startTime ||
      !mainEventState.endTime ||
      !mainEventState.startDate ||
      !mainEventState.endDate ||
      !mainEventState.participationType ||
      // !eventState.participationMessage ||
      // Check location fields only for "In-person" or "Hybrid" events
      ((mainEventState.eventFormat === "In-person" || mainEventState.eventFormat === "Hybrid" || mainEventState.eventFormat === "OFFLINE") &&
          (!mainEventState.countryName || !mainEventState.timeZone || !mainEventState.latitude || !mainEventState.longitude))
    ) {
        toast({
          title: "Please fill in all the required fields",
          variant: "destructive",
        });
        setEventFormState("default");
        return; // Exit the function if any field is missing
    }

    callback();
  }


  const handleSaveClick = async () => {

    setEventFormState("fetching");    

    const e_data = {
      name: mainEventState.eventName,
      logo:
        mainEventState.banner.file !== null &&
        mainEventState.banner.placeHolder,
      // organizer: string;
      startDate: mainEventState.startDate,
      endDate: mainEventState.endDate,
      venue: mainEventState.venue,
      // state: string;
      city: mainEventState.cityName,
      country: mainEventState.countryName,
      eventType: mainEventState.event_type,
    };

    setEventData(e_data);

    const apiData: any = await coordinateService.fetchSimilarEvents(e_data);

    if (apiData.count > 0) {
      setEventFormState("similarEvents");
      setSimilarEvents(apiData.events);
    } else {
      // sendMail();
      resetForm();
      toast({
        title: "Request has been submitted!",
        variant: "default",
      });
    }
  };

  const sendMail = async() => {
    const formData = new FormData();
    formData.append("firstName", user?.firstname);
    formData.append("lastName", user?.lastname);
    formData.append("busEmail", user?.email);
    formData.append("companyName", user?.accountId);
    formData.append("jobTitle", user?.designation);
    formData.append("phoneNumber", user?.phoneNumber);

    const description = {
      userDetail: user,
      eventDetail: mainEventState,
    }

    formData.append("description", JSON.stringify(description));

    const formData1 = {
      firstName: user?.firstname,
      lastName: user?.lastname,
      busEmail: user?.email,
      companyName: user?.accountId,
      jobTitle: user?.designation,
      phoneNumber: user?.phoneNumber,
      description: JSON.stringify(description),
    }

    /*
      const response = await fetch("http://stg-board.10times.com/enquiry/submit", {
        method: "POST",
        body: formData,
      });

      const apiData1 = await response.json();
      console.log('apiData', apiData1);return false;
    */

    const apiData: any = await coordinateService.addNewEvent(formData1);

    console.log('apiData', apiData);

    if (apiData.success) {
      toast({
        title: "Request has been submitted!",
        variant: "default",
      });
    }
  }

  useEffect(() => {
    if (eventFormState === "validating") {
      checkFormValidation(handleSaveClick);
    }
  }, [eventFormState]);

  return (
    <div className="p-3 flex flex-col gap-4">
      {eventFormState === "fetching" ? (
        <LoadingSkeleton />
      ) : eventFormState === "similarEvents" ? (
        <>
          <div className="text-sm p-4 border rounded-sm border-[#FFDD8F] bg-[--warning-background-color]">
            We've Found
            <span className="text-[#A35200] font-semibold">
              {" "}
              {similarEvents.length} Similar Events{" "}
            </span>
            ! See if either matches the event you're trying to add.
          </div>

          <SimilarEventCard
            eventData={eventData}
            duplicateEvents={similarEvents}
            showSimlarCard={true}
          />
        </>
      ) : (
        <>
          <Details
            formTheme="light"
            handleCollapseForm={handleCollapseForm}
            formState={mainEventState}
            handleChange={handleChange}
            eventFont={"Arial"}
            setLoadingState={setLoadingState}
            fileInputRef={fileInputRef}
            // prefilledEvent={initialFormState}
            isApproved={isApproved}
            setIsApproved={setIsApproved}
          />
        </>
      )}
    </div>
  );

  // return (
  //   <div className="grid grid-cols-4 gap-4 border rounded-lg p-4 px-6">
  //     <div className="col-span-1">
  //       <Image
  //         src={placeHolder}
  //         alt="Poster"
  //         className="w-40 object-contain border rounded-md shadow-sm"
  //       />
  //     </div>
  //     <div className="grid gap-4 col-span-3">
  //       <div className="flex justify-between items-center">
  //         <textarea
  //           className="hover:bg-accent rounded-md p-3 outline-none resize-none text-2xl font-semibold w-full"
  //           maxLength={80}
  //           placeholder="Event Name"
  //         />
  //       </div>
  //       <div className="flex justify-between items-center">
  //         {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
  //           Choose Your Event Type
  //         </span> */}
  //         <div className="">
  //           <EventType />
  //         </div>
  //       </div>

  //       <div className="flex justify-between items-center">
  //         {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
  //           Choose Your Mode of Participation
  //         </span> */}
  //         <div className="">
  //           <ParticipationMode />
  //         </div>
  //       </div>

  //       <div className="flex justify-between items-center">
  //         {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
  //           Select Event Date
  //         </span> */}
  //         <div className="">
  //           <DateTimeContainer
  //             formTheme="light"
  //             handleChange={handleChange}
  //             formState={formState}
  //           />
  //         </div>
  //       </div>

  //       <div className="flex justify-between items-center">
  //         {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
  //           Add Event Location
  //         </span> */}
  //         <div className="w-2/3">
  //           <LocationContainer
  //             formTheme="light"
  //             handleChange={handleChange}
  //             formState={formState}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <div className="flex justify-end col-span-4">
  //       <Button size="sm" onClick={handleSave}>
  //         Save and Add Event
  //       </Button>
  //     </div>
  //   </div>
  // );
};

export default EventForm;
