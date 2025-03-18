// import AttendeeIcon from "/public/widgetimages/attendeeIcon.svg";
// import SpeakerIcon from "/public/widgetimages/speakerIcon.svg";
// import ExhibitorIcon from "/public/widgetimages/exhibitorIcon.svg";
// import OrganiserIcon from "/public/widgetimages/organiserIcon.svg";
import Image from "next/image";
// import placeHolder from "@/public/placeholder.png";
import Placeholder from '@/public/placeholder.png'
import EventType from "./eventType";
// import ParticipationMode from "./participationMode";
import DateTimeContainer from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/DateTimeContainer";
import { FormState } from "@/types/Formstate";
import LocationContainer from "@/app/components/TemplateViewsNew/AddEventForm/Details/location/LocationContainer";
import { Button } from "../../ui/button";
import ParticipationMode from "./participationMode";
import Details from "@/app/components/TemplateViewsNew/AddEventForm/Details/Details";
import { useRef, useState } from "react";

interface Props {
  handleSave: any;
}

const EventForm = ({handleSave}: Props) => {
  //   const participationOptions = [
  //     { label: "Attendee", value: "Attendee", icon: AttendeeIcon },
  //     { label: "Speaker", value: "Speaker", icon: SpeakerIcon },
  //     { label: "Exhibitor", value: "Exhibitor", icon: ExhibitorIcon },
  //     { label: "Organiser", value: "Organiser", icon: OrganiserIcon },
  //   ];

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
    registerMessage: 'Welcome! To join the event, please register below.',
    registerBtnText: 'Register',
    registerBtnColor: '#1a1a1a',
    countryName: '',
    timeZone: 'GMT+05:30 Chennai',
    timeZoneKey: 1,
    startDate: "2025-04-12",
    endDate: "2025-04-13",
    startTime: "12:00 A.M",
    endTime: "12:00 A.M",
    // eventFormat: prefilledEvent?.customizationData.eventFormat || prefilledSubEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person",
    eventFormat: "In-person",
    boothNumber: "",
    participationMessage:  "",
    banner: { placeHolder: Placeholder, file: null },
    venue: "",
    latitude: 37.7749,
    longitude: -122.4194,
    hashtags: [],
    query: '',
    isEventNameEmpty: false,
    isEventFormatEmpty: false,
    isEventDescriptionEmpty: false,
    isEventParticipationEmpty: false,
    isParticipationMessageEmpty: false,
    isEventTypeEmpty:false,
    isTextValueMessageEmpty: false,
    errorMessage: 'Event name is required.',
    capacity: -1,
    registration: true,
    approval: false,
    waitlisting: false,
    capacityModal: false,
    virtualLink: "",
    exhibitorModal: false,
    exhibitor: [],
    prefilledExhibitorDetails:undefined,
    event_type: ""
  };

  const [isApproved, setIsApproved] =useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mainEventState, setMainEventState] = useState<FormState>(initialFormState);

  // const handleChange = () => {};

  const handleChange = (field: keyof FormState, value: any) => {
    setMainEventState((prev) => ({ ...prev, [field]: value }));
  };

  const setLoadingState = () => {

  }

  const handleCollapseForm = () => {};

  //   return (
  //     <div className="grid gap-4 border rounded-lg p-4 px-6">
  //       <div className="flex justify-between">
  //         <span className="text-[var(--secondary-text-color)]">
  //           Choose Your Event Type
  //         </span>
  //         <div className="flex gap-3">
  //           {["Tradeshow", "Conference", "Workshop"].map((type) => (
  //             <label key={type} className="flex gap-2 items-center text-base">
  //               <input
  //                 type="radio"
  //                 name="eventType"
  //                 value={type}
  //               />
  //               {type}
  //             </label>
  //           ))}
  //         </div>
  //       </div>
  //       <div>
  //         <span className="text-[var(--secondary-text-color)]">
  //           Choose Your Mode of Participation
  //         </span>
  //         <div className="flex gap-3 my-2">
  //           {participationOptions.map((option) => (
  //             <div
  //               key={option.value}
  //               className="p-2 border rounded-sm flex items-center gap-3 cursor-pointer border-[var(--border-color)]"
  //               // onClick={() => handleSelection(option.value)}
  //             >
  //               <Image
  //                 src={option.icon}
  //                 alt={`${option.label} icon`}
  //                 height={30}
  //                 width={30}
  //               />
  //               <span>{option.label}</span>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       <div>
  //         <textarea
  //           className="outline-none resize-none text-4xl font-semibold w-full h-12"
  //           maxLength={80}
  //           placeholder="Event Name"
  //         />
  //       </div>
  //     </div>
  //   );


  return (
    <div className="p-3 border rounded-md">
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
      <div className="flex justify-end col-span-4 py-2">
        <Button onClick={handleSave}>Save and Add Event</Button>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-4 gap-4 border rounded-lg p-4 px-6">
      <div className="col-span-1">
        <Image
          src={placeHolder}
          alt="Poster"
          className="w-40 object-contain border rounded-md shadow-sm"
        />
      </div>
      <div className="grid gap-4 col-span-3">
        <div className="flex justify-between items-center">
          <textarea
            className="hover:bg-accent rounded-md p-3 outline-none resize-none text-2xl font-semibold w-full"
            maxLength={80}
            placeholder="Event Name"
          />
        </div>
        <div className="flex justify-between items-center">
          {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
            Choose Your Event Type
          </span> */}
          <div className="">
            <EventType />
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
            Choose Your Mode of Participation
          </span> */}
          <div className="">
            <ParticipationMode />
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
            Select Event Date
          </span> */}
          <div className="">
            <DateTimeContainer
              formTheme="light"
              handleChange={handleChange}
              formState={formState}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* <span className="text-[var(--tertiary-text-color)] text-base font-medium">
            Add Event Location
          </span> */}
          <div className="w-2/3">
            <LocationContainer
              formTheme="light"
              handleChange={handleChange}
              formState={formState}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end col-span-4">
        <Button size="sm" onClick={handleSave}>Save and Add Event</Button>
      </div>
    </div>
  );
};

export default EventForm;
