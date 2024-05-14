"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import styles from "./commonwidget.style.module.css";
import EventCategoryData from "../../../public/data/categoryTags.json";
import EventTypeData from "../../../public/data/eventTypeTags.json";
import EventFormatData from "../../../public/data/eventFormat.json";
import ModeData from "../../../public/data/mode.json";
import ArrowDownIcon from "/public/downArrow.svg";
import SearchIcon from "/public/search.svg";
import DatePickerComp from "../calendar/DatePickerComp";
import Tags from "./Tags";
import Image from "next/image";
import Tag from "./Tag";
import useFetch from "@/hooks/useFetch";
import { useTheme } from "@/context";
import { useRouter } from "next/navigation";

interface CommonWidgetProps {
  widgetType: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
}
interface PromotedEvent {
  id: string;
  name: string;
}

const CommonWidget = ({ widgetType, setId }: CommonWidgetProps) => {
  const { theme } = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon'
  const [geoInput, setGeoInput] = useState<string>("");
  const [inputTag, setInputTag] = useState<string>("");
  const [eventFormat, setEventFormat] = useState<string[]>(EventFormatData);

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const [categoryTags, setCategoryTags] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [matchingCategories, setMatchingCategories] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);

  const [eventTypeTags, setEventTypeTags] = useState<string[]>([]);
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] =
    useState<boolean>(false);

  const [modeTags, setModeTags] = useState<string[]>(ModeData);

  const [showPromotedInput, setShowPromotedInput] = useState<boolean>(false);
  const [isPromotedDropdownOpen, setIsPromotedDropdownOpen] =
    useState<boolean>(false);
  const [promotedInput, setPromotedInput] = useState<string>("");
  const [matchingPromotedEvents, setMatchingPromotedEvents] = useState<any[]>(
    []
  );
  const [promotedEventTags, setPromotedEventTags] = useState<PromotedEvent[]>(
    []
  );
  const [promotedEvents, setPromotedEvents] = useState<string[]>([]);

  const [currDate, setCurrDate] = useState<string>("");
  const[isTag,setIsTag]=useState(false);
  const promotedEventsLimit = widgetType === "Page" ? 3 : 1;

  const { data } = useFetch("https://api.eventgeni.com/es/find?company=104");

  const router = useRouter();
  // To get the todays date to send in date picker comp.
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setCurrDate(formattedDate);
  }, []);

  useEffect(() => {
    if (categoryInput.trim() === "") {
      setMatchingCategories([]);
      setIsCategoryDropdownOpen(false);
    } else {
      const matches = EventCategoryData.filter((category) =>
        category.toLowerCase().includes(categoryInput.toLowerCase())
      );
      setMatchingCategories(matches);
      setIsCategoryDropdownOpen(true);
    }
  }, [categoryInput]);

  // To handle Event Format
  const toggleFormatChipSelection = (format: string) => {
    const isSelected = eventFormat.includes(format);
    if (isSelected) {
      setEventFormat((prevFormats) =>
        prevFormats.filter((item) => item !== format)
      );
    } else {
      setEventFormat((prevFormats) => [...prevFormats, format]);
    }
  };

  const handleStartDate = (startDate: any) => {
    setStartDate(startDate);
  };
  const handleEndDate = (endDate: any) => {
    setEndDate(endDate);
  };

  const handleCategoryClick = (category: string) => {
    if (!categoryTags.includes(category)) {
      setCategoryTags([...categoryTags, category]);
    }
    setIsCategoryDropdownOpen(false);
  };

  const handleRemoveCategoryTag = (tagToRemove: string) => {
    setCategoryTags(categoryTags.filter((tag) => tag !== tagToRemove));
  };

  const handleEventTypeClick = (type: string) => {
    if (!eventTypeTags.includes(type)) {
      setEventTypeTags([...eventTypeTags, type]);
    }
    setIsEventTypeDropdownOpen(false);
  };

  const handleRemoveEventTypeTag = (tagToRemove: string) => {
    setEventTypeTags(eventTypeTags.filter((tag) => tag !== tagToRemove));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowPromotedInput(e.target.checked);
  };

  useEffect(() => {
    if (data) {
      const eventData = data.eventData || []; // Ensure eventData is available, default to an empty array if not present
      const matches =
        promotedInput.trim() === ""
          ? []
          : eventData.filter((event: any) =>
            event._source.name
              .toLowerCase()
              .includes(promotedInput.toLowerCase())
          );
      setMatchingPromotedEvents(matches);
      setIsPromotedDropdownOpen(promotedInput.trim() !== ""); // Set dropdown open only if searchInput is not empty
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotedInput]);

  // To handle Event Mode iof Participation
  const toggleModeChipSelection = (mode: string) => {
    const isSelected = modeTags.includes(mode);
    if (isSelected) {
      setModeTags((prevModes) => prevModes.filter((item) => item !== mode));
    } else {
      setModeTags((prevModes) => [...prevModes, mode]);
    }
  };

  const handlePromotedEventClick = (event: any) => {
    const id = event._id;
    const name = event._source.name;
    if (!promotedEventTags.includes(event._source.name)) {
      setPromotedEventTags([...promotedEventTags, { id, name }]);
      setPromotedEvents([...promotedEvents, id]);
    }
    setIsPromotedDropdownOpen(false);
  };

  const handleRemovePromotedEventsTag = (tagToRemove: string, id: string) => {
    setPromotedEventTags(
      promotedEventTags.filter((tag) => tag.name !== tagToRemove)
    );
    setPromotedEvents(promotedEvents.filter((tagId) => tagId !== id));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(11111111111111111111111111);
    
    // Generate query string
    const queryString = generateQueryString();
    const baseURL = process.env.NEXT_PUBLIC_EVENTGENI_URL;
    const bodyData = {
      promotedEventTags,
      startDate,
      endDate,
      eventTypeTags,
      categoryTags,
      eventFormat,
      active: true,
      widgetType: widgetType,
    };
    // Prepare request body
    const formBody = {
      type: "page",
      query: queryString,
      body: JSON.stringify(bodyData),
    };
    try {
      const responseData = await postData(`${baseURL}/widgets`, formBody);
      console.log("Response data:", responseData);
      setId(responseData.id);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const generateQueryString = () => {
    const formData: Record<string, string> = {};
    if (startDate) {
      formData.startDate = startDate;
    }
    if (endDate) {
      formData.endDate = endDate;
    }
    if (categoryTags.length > 0) {
      formData.categoryTags = categoryTags.join(",");
    }
    if (eventTypeTags.length > 0) {
      formData.eventTypeTags = eventTypeTags.join(",");
    }
    if (promotedEvents.length > 0) {
      formData.promotedEvents = promotedEvents.join(",");
    }

    const params = new URLSearchParams(formData);
    return params.toString();
  };
  const postData = async (url: string, body: any) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };
  useEffect(()=>{
    console.log("tag is "+isTag+" "+ inputTag);
  })
  

  const handleCancel = () => {
    router.push("/widget")
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.eventFormatContainer}>
        <div className={styles.heading}>Event Format</div>
        <div className={styles.eventFormats}>
          {EventFormatData.map((format, index) => (
            <div
              key={format}
              className={`${styles.eventChip} ${eventFormat.includes(format) ? styles.eventActiveChip : ""
                }`}
              onClick={() => toggleFormatChipSelection(format)}
            >
              {format}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.dateContainer}>
        <div className={styles.startDate}>
          <div className={styles.heading}>Start Date</div>
          <div className={styles.datePickerContainer}>
            <DatePickerComp handleDate={handleStartDate} date={currDate} />
          </div>
        </div>
        <div className={styles.endDate}>
          <div className={styles.heading}>End Date</div>
          <div className={styles.datePickerContainer}>
            <DatePickerComp handleDate={handleEndDate} date="" />
          </div>
        </div>
      </div>
      <div
        className={`${styles.eventGeoContainer} ${styles.inputOuterContainer}`}
      >
        <div className={styles.heading}>Regions</div>
        <div className={`${styles.geoInput} ${styles.inputInnerContainer}`}>
          <Image src={SearchIcon} alt="search" className={iconClass} />
          <input
            type="text"
            onChange={(e) => setGeoInput(e.target.value)}
            value={geoInput}
            placeholder="Geography"
          />
        </div>
      </div>
      <div
        className={` ${styles.eventCategoryContainer} ${styles.inputOuterContainer}`}
      >
        <div className={styles.heading}>Event Categories</div>
        <div
          className={`${styles.categoryInput} ${styles.inputInnerContainer}`}
        >
          <Image src={SearchIcon} alt="search" className={iconClass} />
          <input
            type="text"
            onChange={(e) => setCategoryInput(e.target.value)}
            value={categoryInput}
            placeholder="For ex : Texttile"
          />
        </div>
        {isCategoryDropdownOpen && (
          <div className={styles.dropdown}>
            {matchingCategories.map((event, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleCategoryClick(event)}
              >
                {event}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.tags}>
        {categoryTags.map((tag, index) => (
          <Tag
            key={index}
            name={tag}
            onRemove={() => handleRemoveCategoryTag(tag)}
          />
        ))}
      </div>

      <div
        className={` ${styles.eventTypeContainer} ${styles.inputOuterContainer}`}
      >
        <div className={styles.heading}>Event Types</div>
        <div
          className={`${styles.typeInput} ${styles.inputInnerContainer}`}
          onClick={() => setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen)}
        >
          <Image src={ArrowDownIcon} alt="dropdown" className={iconClass} />
          <div className={`${styles.placeholder} ${theme === 'light' && styles.placeholder_light}`}>For ex : Expo</div>
        </div>
        {isEventTypeDropdownOpen && (
          <div className={styles.dropdown}>
            {EventTypeData.map((type, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleEventTypeClick(type)}
              >
                {type}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.tags}>
        {eventTypeTags.map((tag, index) => (
          <Tag
            key={index}
            name={tag}
            onRemove={() => handleRemoveEventTypeTag(tag)}
          />
        ))}
      </div>

      <div
        className={` ${styles.eventModeContainer} ${styles.inputOuterContainer}`}
      >
        <div className={styles.heading}>Modes of Participation</div>
        <div className={styles.eventModes}>
          {ModeData.map((mode, index) => (
            <div
              key={mode}
              className={`${styles.eventChip} ${modeTags.includes(mode) ? styles.eventActiveChip : ""
                }`}
              onClick={() => toggleModeChipSelection(mode)}
            >
              {mode}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.promotedEventsContainer} ${styles.inputOuterContainer}`}
      >
        <div className={styles.promotedHeading}>
          <div className={styles.heading}>
            Do you want to show promoted events?
          </div>
          <input
            type="checkbox"
            id="check"
            className={styles.checkboxInput}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="check" className={styles.checkBox}></label>
        </div>
        {promotedEventTags.length < promotedEventsLimit && (
          <div
            className={`${styles.promotedInput} ${styles.inputInnerContainer}`}
          >
            <Image src={SearchIcon} alt="search" className={iconClass} />
            <input
              type="text"
              onChange={(e) => setPromotedInput(e.target.value)}
              placeholder="Search Events"
              value={promotedInput}
              disabled={!showPromotedInput}
            />
          </div>
        )}
        {isPromotedDropdownOpen && (
          <div className={styles.dropdown}>
            {matchingPromotedEvents.map((event, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => handlePromotedEventClick(event)}
              >
                {event._source.name}
              </div>
            ))}
          </div>
        )}
        <div className={styles.tags}>
          {promotedEventTags.map((tag, index) => (
            <Tag
              key={index}
              name={tag.name}
              onRemove={() => handleRemovePromotedEventsTag(tag.name, tag.id)}
            />
          ))}
        </div>
      </div>
      <div className={styles.tagsContainer}>
        <Tags />
      </div>
      <div className={styles.btns}>
        <button className={styles.submitBtn}>Submit</button>
        <button className={styles.cancelBtn} type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CommonWidget;
