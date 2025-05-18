"use client";
import Placeholder from "@/public/placeholder.png";
import { AddEventFormState, addEventPayloadType } from "@/types/Formstate";
import { useEffect, useRef, useState } from "react";
import SimilarEventCard from "./SimilarEventCard";
import { useCoordinateService } from "@/services/coordinateService";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAuthContext } from "@/context";
import { useToast } from "@/hooks/use-toast";
import DateTimeContainer from "./DateTimeContainer";
import InterestSelectContainer from "./InterestSelectContainer";
import LocationContainer from "./location/LocationContainer";
import EventTypeSelector from "./eventType";

interface Props {
  eventFormState:
    | "default"
    | "similarEvents"
    | "editEvents"
    | "fetching"
    | "validating";
  setEventFormState: any;
  resetForm: any;
}

const EventForm = ({ eventFormState, setEventFormState, resetForm }: Props) => {
  const { user } = useAuthContext();

  const [eventData, setEventData] = useState<any>();

  const [similarEvents, setSimilarEvents] = useState<any>([]);

  const coordinateService = useCoordinateService();

  const { toast } = useToast();

  const initialFormState: AddEventFormState = {
    parentData: "",
    descriptionModal: false,
    speakerModal: false,
    registerModal: false,
    eventName: "",
    participationType: "",
    description: "",
    textValue: "",
    speaker: [],
    prefilledProfile: undefined,
    registerMessage: "Welcome! To join the event, please register below.",
    registerBtnText: "Register",
    registerBtnColor: "#1a1a1a",
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
    locationType: "",
    locationDisplayName: "",
    cityId: "",
    cityName: "",
    latitude: Number(""),
    longitude: Number(""),
    countryName: "",
    countryId: "",
    countryCode: "",
    stateName: "",
    stateId: "",
    venueName: "",
    venueAddress: "",
    venueLatitude: Number(""),
    venueLongitude: Number(""),
    venueId: "",
  };

  const [isApproved, setIsApproved] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mainEventState, setMainEventState] =
    useState<AddEventFormState>(initialFormState);

  const handleChange = (field: keyof AddEventFormState, value: any) => {
    setMainEventState((prev) => ({ ...prev, [field]: value }));
  };

  const checkFormValidation = (callback: any) => {
    if (!mainEventState.eventName || mainEventState.eventName === "") {
      handleChange("isEventNameEmpty", true);
      // handleChange('isEventFormatEmpty', true);
    } else {
      handleChange("isEventNameEmpty", false);
    }

    if (!mainEventState.participationType) {
      handleChange("isEventParticipationEmpty", true);
    } else {
      handleChange("isEventParticipationEmpty", false);
    }

    if (!mainEventState.event_type) {
      handleChange("isEventTypeEmpty", true);
    } else {
      handleChange("isEventTypeEmpty", false);
    }

    if (
      (!mainEventState.query && !mainEventState.latitude) ||
      !mainEventState.longitude
    ) {
      handleChange("isEventFormatEmpty", true);
    } else {
      handleChange("isEventFormatEmpty", false);
    }

    if (
      !mainEventState.eventName.trim() ||
      !mainEventState.eventFormat ||
      !mainEventState.startTime ||
      !mainEventState.endTime ||
      !mainEventState.startDate ||
      !mainEventState.endDate ||
      !mainEventState.participationType ||
      !mainEventState.event_type ||
      // !eventState.participationMessage ||
      // Check location fields only for "In-person" or "Hybrid" events
      ((mainEventState.eventFormat === "In-person" ||
        mainEventState.eventFormat === "Hybrid" ||
        mainEventState.eventFormat === "OFFLINE") &&
        (!mainEventState.cityId ||
          !mainEventState.latitude ||
          !mainEventState.longitude))
    ) {
      toast({
        title: "Please fill in all the required fields",
        variant: "destructive",
      });
      setEventFormState("default");
      return; // Exit the function if any field is missing
    }

    callback();
  };

  const handleInputChange = (value: string) => {
    const specialCharRegex = /[@#$%^&*"|<>]/g;
    handleChange("isEventNameEmpty", false);
    // setIsEventNameEmpty(false)
    if (specialCharRegex.test(value)) {
      toast({
        title: "Please check, input should not contain any special character",
        variant: "destructive",
      });
    } else {
      handleChange("eventName", value);
      // setEventName(value);
      if (value.trim() === "") {
        handleChange("isEventNameEmpty", true);
        // setIsEventNameEmpty(true);
      }
    }
  };

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
      venue: mainEventState.venueName,
      // state: string;
      city: mainEventState.locationDisplayName,
      // country: mainEventState.countryName,
      eventType: mainEventState.event_type,
    };

    setEventData(e_data);

    const duplicateEventPayload = {
      name: mainEventState.eventName,
      latitude: mainEventState.latitude,
      longitude: mainEventState.longitude,
      locationIds: mainEventState.cityId,
      startDate: mainEventState.startDate,
      endDate: mainEventState.endDate,
      venueId: "",
    };

    if (mainEventState.locationType === "VENUE") {
      duplicateEventPayload.venueId = mainEventState.venueId;
    }

    if (
      mainEventState.eventFormat === "Virtual" ||
      mainEventState.eventFormat === "ONLINE"
    ) {
      duplicateEventPayload.latitude = -75.250973;
      duplicateEventPayload.longitude = -0.071389;
      duplicateEventPayload.locationIds =
        "e1ae6da4-3c7c-5283-8860-e224ea7cce97";
    }

    const apiData2: any = await coordinateService.fetchDuplicateEvents(
      duplicateEventPayload
    );

    if (apiData2.blocked.length > 0) {
      setEventFormState("similarEvents");
      setSimilarEvents(apiData2.blocked);
    } else {
      // sendMail();

      const eventData: addEventPayloadType = {
        start_date: mainEventState.startDate,
        end_date: mainEventState.endDate,
        start_time: mainEventState.startTime,
        end_time: mainEventState.endTime,
        location_city_id: mainEventState.cityId,
        location_city: mainEventState.cityName,
        location_country: mainEventState.countryName,
        location_country_id: mainEventState.countryId,
        location_country_iso_code: mainEventState.countryCode,
        location_state: mainEventState.stateName,
        location_state_id: mainEventState.stateId,
        // logoUrl: z.string().nullable().optional(),
        latitude: mainEventState.latitude,
        longitude: mainEventState.longitude,
        participationType: mainEventState.participationType,
        event_type: mainEventState.event_type,
        format: mainEventState.eventFormat,
      };
      if (mainEventState.locationType === "VENUE") {
        eventData.venue_id = mainEventState.venueId;
        eventData.venue_latitude = mainEventState.latitude;
        eventData.venue_longitude = mainEventState.longitude;
        eventData.venue_name = mainEventState.venueName;
        eventData.venue_address = mainEventState.venueAddress;
      }

      const addEventPayload = {
        name: mainEventState.eventName,
        interest: mainEventState.participationType,
        sourceModule: "COORDINATE",
        // logoUrl:
        //   mainEventState.banner.file !== null &&
        //   mainEventState.banner.placeHolder,
        data: JSON.stringify(eventData),
      };

      try {
        const apiData: any = await coordinateService.addNewEvent(
          addEventPayload
        );

        if (apiData?.error) {
          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: "Failed to add event. Please try again.",
          });
        } else {
          toast({
            title: "Event Added Successfully!",
            variant: "default",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "Failed to add event. Please try again.",
        });
      } finally {
        resetForm();
      }
    }
  };

  const sendMail = async () => {
    const description = {
      userDetail: user,
      eventDetail: mainEventState,
    };

    const formData1 = {
      firstName: user?.firstname,
      lastName: user?.lastname,
      busEmail: user?.email,
      // companyName: user?.accountId,
      jobTitle: user?.designation,
      phoneNumber: user?.phoneNumber,
      description: JSON.stringify(description),
    };

    const apiData: any = await coordinateService.addNewEvent(formData1);

    if (apiData.success) {
      toast({
        title: "Request has been submitted!",
        variant: "default",
      });
    }
  };

  useEffect(() => {
    if (eventFormState === "validating") {
      checkFormValidation(handleSaveClick);
    }
  }, [eventFormState]);

  // return (
  //   <div className="p-3 flex flex-col gap-4">
  //     {eventFormState === "fetching" ? (
  //       <LoadingSkeleton />
  //     ) : eventFormState === "similarEvents" ? (
  //       <>
  //         <div className="text-sm p-4 border rounded-sm border-[#FFDD8F] bg-[--warning-background-color]">
  //           We&apos;ve Found
  //           <span className="text-[#A35200] font-semibold">
  //             {" "}
  //             {similarEvents.length} Similar Events{" "}
  //           </span>
  //           ! See if either matches the event you&apos;re trying to add.
  //         </div>

  //         <SimilarEventCard
  //           eventData={eventData}
  //           duplicateEvents={similarEvents}
  //           showSimlarCard={true}
  //         />
  //       </>
  //     ) : (
  //       <>
  //         <Details
  //           formTheme="light"
  //           handleCollapseForm={handleCollapseForm}
  //           formState={mainEventState}
  //           handleChange={handleChange}
  //           eventFont={"Arial"}
  //           setLoadingState={setLoadingState}
  //           fileInputRef={fileInputRef}
  //           // prefilledEvent={initialFormState}
  //           isApproved={isApproved}
  //           setIsApproved={setIsApproved}
  //         />
  //       </>
  //     )}
  //   </div>
  // );

  return (
    <div className="flex flex-col gap-4">
      {eventFormState === "fetching" ? (
        <LoadingSkeleton />
      ) : eventFormState === "similarEvents" ? (
        <>
          <div className="text-sm p-4 border rounded-sm border-[#FFDD8F] bg-[--warning-background-color]">
            We&apos;ve Found
            <span className="text-[#A35200] font-semibold">
              {" "}
              {similarEvents.length} Similar Events{" "}
            </span>
            ! See if either matches the event you&apos;re trying to add.
          </div>

          <SimilarEventCard
            eventData={eventData}
            duplicateEvents={similarEvents}
            showSimlarCard={true}
          />
        </>
      ) : (
        <div className="grid grid-cols-4 gap-5 border rounded-lg p-4 px-6 h-full py-6 pb-[200px]">
          <div className="col-span-4">
            <EventTypeSelector
              formTheme="light"
              prefilledEvent={mainEventState}
              mainEventType={mainEventState.event_type}
              handleChange={handleChange}
            />
            {mainEventState.isEventTypeEmpty && (
              <p className="text-destructive text-xs mt-1">
                Please select any event type
              </p>
            )}
          </div>

          <div className="col-span-4">
            <InterestSelectContainer
              formTheme="light"
              handleChange={handleChange}
              formState={mainEventState}
              heading="Choose Your Interest"
              type="main"
              size="large"
            />
            {mainEventState.isEventParticipationEmpty && (
              <p className="text-destructive text-xs mt-1">
                Please select your interest
              </p>
            )}
          </div>

          {/* <div className="col-span-1">
            <Image
              src={Placeholder}
              alt="Poster"
              className="w-52 object-contain border rounded-md shadow-sm"
            />
          </div> */}
          <div className="grid gap-4 col-span-4">
            <div className="">
              <textarea
                className={`bg-background hover:bg-accent rounded-md p-3 outline-none resize-none text-3xl font-semibold w-full ${
                  mainEventState.isEventNameEmpty
                    ? "bg-[var(--danger-background-color)] hover:bg-[var(--danger-background-color)]"
                    : ""
                }`}
                maxLength={80}
                placeholder="Event Name"
                onChange={(e) => handleInputChange(e.target.value)}
                value={mainEventState.eventName}
              />
              {mainEventState.isEventNameEmpty && (
                <p className="text-destructive text-xs mt-1">
                  {mainEventState.errorMessage}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="w-full bg-accent rounded-md">
                <DateTimeContainer
                  formTheme="light"
                  handleChange={handleChange}
                  formState={mainEventState}
                />
              </div>
            </div>

            <div className="">
              <div className="w-full bg-accent rounded-md">
                <LocationContainer
                  formTheme="light"
                  handleChange={handleChange}
                  formState={mainEventState}
                />
              </div>
              {mainEventState.isEventFormatEmpty && (
                <p className="text-destructive text-xs mt-1">
                  Event location is required
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;
