import React, { useState, useEffect } from "react";
import styles from "./stickyTopWigitCard.module.css";
import Image from "next/image";
import Calendar from "/public/vector.svg";
import CloseEyeIcon from "/public/closeEyeIcon.svg";
import OpenEyeIcon from "/public/openEyeIcon.svg";
import Delete from "/public/delete.svg";
import Link from "next/link";
import DeleteModal from "@/app/components/widgets/DeleteModal";

type PromotedEvent = {
  name: string;
  startDate: string; // You may want to use Date type if the dates are parsed as Date objects
  endDate: string; // You may want to use Date type if the dates are parsed as Date objects
};
const Index = ({ data }: any) => {
  const propsData = data;
  const [activeState, setActiveState] = useState("Active");
  const [widgetType, setWidgetType] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>();
  const [eventTypes, setEventTypes] = useState<string[]>();
  const [countries, setCountries] = useState<string[]>();
  const [promotedEvents, setPromotedEvents] = useState<PromotedEvent[]>([]);
  console.log("catee", categories);

  const handleModal = () => {
    setDeleteModal(!deleteModal);
  };

  useEffect(() => {
    if (propsData.body) {
      const body = JSON.parse(propsData.body);
      setWidgetType(body.widgetType);
    } else {
      setWidgetType("Sticky");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const response = await fetch(
          `https://api.eventgeni.com/widgets/${
            propsData.id
          }?type=${widgetType.toLowerCase()}`
        );
        const widgetData = await response.json();
        if (widgetType === "Sticky") {
          const active = widgetData.active;
          if (active === "true") {
            setActiveState("Active");
          } else {
            setActiveState("Inactive");
          }
        } else {
          const formBody = JSON.parse(widgetData.body);
          const query = widgetData.query;
          if (formBody.active) {
            setActiveState("Active");
          } else {
            setActiveState("Inactive");
          }
          if (!response.ok) {
            throw new Error("Failed to fetch widget data");
          }
          const additionalDataResponse = await fetch(
            `https://api.eventgeni.com/es/find?company=104&${query}`
          );
          const additionalData = await additionalDataResponse.json();
          handleAdditionalData(additionalData);
        }
      } catch (error) {
        console.error("Error fetching widget data:", error);
      }
    };
    fetchWidgetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetType]);

  // This function is to extract the categroies, types of the events to show it on the widget card
  const handleAdditionalData = (additionalData: any) => {
    console.log("eventt", additionalData);
    // Function to extract categories and remove duplicates
    const extractCategories = (data: any) => {
      return data.reduce((acc: any, item: any) => {
        const eventCategories = item._source.category_name || [];
        eventCategories.forEach((category: any) => {
          if (!acc.includes(category)) {
            acc.push(category);
          }
        });
        return acc;
      }, []);
    };

    // Function to extract event types and remove duplicates
    const extractEventTypes = (data: any) => {
      return data.reduce((acc: any, item: any) => {
        const eventType = item._source.event_type;
        if (eventType && !acc.includes(eventType)) {
          acc.push(eventType);
        }
        return acc;
      }, []);
    };

    const extractCountries = (data: any) => {
      return data.reduce((acc: any, item: any) => {
        const country = item._source.country_name;
        if (country && !acc.includes(country)) {
          acc.push(country);
        }
        return acc;
      }, []);
    };

    const extractPromotedEvents = (data: any) => {
      return data.reduce((acc: any, item: any) => {
        const event = {
          name: item._source.name,
          startDate: item._source.start_date, // Assuming the field name is start_date
          endDate: item._source.end_date, // Assuming the field name is end_date
        };
        acc.push(event);
        return acc;
      }, []);
    };
    // Extract categories and event types from eventData and top_3 arrays
    const categoriesFromEventData = extractCategories(additionalData.eventData);
    const categoriesFromTop3 = additionalData.top_3
      ? extractCategories(additionalData.top_3)
      : [];
    const eventTypesFromEventData = extractEventTypes(additionalData.eventData);
    const eventTypesFromTop3 = additionalData.top_3
      ? extractEventTypes(additionalData.top_3)
      : [];
    const countriesFromEventData = extractCountries(additionalData.eventData);
    const countriesFromTop3 = additionalData.top_3
      ? extractCountries(additionalData.top_3)
      : [];
    const highlightedEvents = additionalData.top_3
      ? extractPromotedEvents(additionalData.top_3)
      : [];

    // Combine categories and event types from both arrays and remove duplicates
    const allCategories = [
      ...categoriesFromEventData,
      ...categoriesFromTop3,
    ].reduce((acc, category) => {
      if (!acc.includes(category)) {
        acc.push(category);
      }
      return acc;
    }, []);
    const allEventTypes = [
      ...eventTypesFromEventData,
      ...eventTypesFromTop3,
    ].reduce((acc, eventType) => {
      if (!acc.includes(eventType)) {
        acc.push(eventType);
      }
      return acc;
    }, []);
    const allCountries = [
      ...countriesFromEventData,
      ...countriesFromTop3,
    ].reduce((acc, country) => {
      if (!acc.includes(country)) {
        acc.push(country);
      }
      return acc;
    }, []);

    // Update state with unique categories and event types
    setCategories(allCategories);
    setEventTypes(allEventTypes);
    setCountries(allCountries);
    setPromotedEvents(highlightedEvents);
  };

  return (
    <div className={styles.container}>
      <div className={`${deleteModal ? styles.blur : ""}`}>
        <div className={styles.outerDiv}>
          <div className={styles.widgetText}>Hero Widget</div>
          <div className={styles.stickyTopSec}>{widgetType}</div>
          <div className={styles.statusBtn}>
            <div
              className={`${styles.activeFlag} ${
                activeState === "Inactive" ? styles.inactiveFlag : ""
              }`}
            ></div>
            <div
              className={`${styles.status} ${
                activeState === "Inactive" ? styles.inactiveStatus : ""
              }`}
            >
              {activeState}
            </div>
          </div>
        </div>

        <div className={styles.secondSec}>
          <div className={styles.eventDetail}>
            <div style={{ display: "flex" }}>
              <Image src={Calendar} alt="calendar" />
            </div>
            <div className={styles.date}>1st Apr 2024</div>
            <div>-</div>
            <div className={styles.date}>30th Apr 2024</div>
          </div>
          <div className={styles.geographyText}>Geography-India</div>
          <div className={styles.geographyText}>Type-Seminar</div>
        </div>

        <div className={styles.category}>
          <div className={styles.category_text}>
            Category-
            {/* {categories?.map((category) => (
              <>
                <span>{category}</span>{" "}
              </>
            ))} */}
            <span>Hospitality, Festival</span>{" "}
            {/* <span>Format-Exhibition</span> */}
            <span>Format-Exhibition</span>
            <span>+6 more...</span>
          </div>
        </div>

        <div className={styles.thirdSec}>
          <Link
            className={styles.buttonContainer}
            href={`/widget/${propsData.id}?widgetType=${widgetType}`}
          >
            Configure
          </Link>
          <div className={styles.icon_container}>
            {activeState === "Active" ? (
              <Image
                src={OpenEyeIcon}
                alt="open eye icon"
                onClick={() => {
                  setActiveState("Inactive");
                }}
              />
            ) : (
              <Image
                src={CloseEyeIcon}
                alt="closed eye icon"
                onClick={() => {
                  setActiveState("Active");
                }}
              />
            )}
            <Image
              src={Delete}
              alt="delete"
              className={styles.delete}
              onClick={handleModal}
            />
          </div>
        </div>
      </div>
      <div className={styles.deleteModal}>
        {deleteModal && (
          <DeleteModal
            type={widgetType.toLowerCase()}
            id={propsData.id}
            handleModal={handleModal}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
