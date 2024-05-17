'use client'
import React, { useEffect, useState } from 'react'
import Styles from './widgetCard.module.css'
import Analytics from './Analytics'
import Calendar from '/public/vector.svg'
import Image from 'next/image'
import Spinner from '/public/Icon.svg'
import Link from 'next/link'
import Delete from '/public/delete.svg'
import DeleteModal from './DeleteModal'
import PenIcon from '/public/pen.svg'
import DownArrow from '/public/internal/arrow_drop_down.svg'

type PromotedEvent = {
  name: string;
  startDate: string; // You may want to use Date type if the dates are parsed as Date objects
  endDate: string; // You may want to use Date type if the dates are parsed as Date objects
};

interface WidgetCardProps {
  data: any; // Replace 'any' with the actual type of your data if possible
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
}

interface AccordianProps {
  widgetType: string,
  countries: string[] | undefined
  categories: string[] | undefined
  eventTypes: string[] | undefined
  promotedEvents: PromotedEvent[]
}

const AccordianCode = ({ widgetType, countries, categories, eventTypes, promotedEvents }: AccordianProps) => {
  return (
    <div>
      <div className={Styles.cardSec2}>
        <div className={Styles.type_geoContainer}>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Widget Type</div>
            <div className={Styles.typeChip}>{widgetType}</div>
          </div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Geography</div>
            <div className={Styles.typesContainer}>
              {countries?.map((item, key) => (
                <div key={key} className={Styles.typeChip}>{item.length > 9 ? item.substring(0, 9) + '...' : item}</div>
              ))}
            </div>
          </div>
        </div>
        <div className={Styles.cat_typeContainer}>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Event Category</div>
            <div className={Styles.typesContainer}>
              {categories?.map((item, key) => (
                <div key={key} className={Styles.typeChip}> {item.length > 9 ? item.substring(0, 9) + '...' : item}</div>
              ))}
            </div>
          </div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Event Type</div>
            <div className={Styles.typesContainer}>
              {eventTypes?.map((item, key) => (
                <div key={key} className={Styles.typeChip}>{item.length > 9 ? item.substring(0, 9) + '...' : item}</div>
              ))}
            </div>
          </div>
        </div>
        <div className={Styles.format_partContainer}>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Event Format</div>
            <div className={Styles.typesContainer}>
              <div className={Styles.typeChip}>Exhibition</div>
            </div>
          </div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Mode of Participation</div>
            <div className={Styles.typesContainer}>
              <div className={Styles.typeChip}>Virtual</div>
            </div>
          </div>
        </div>
      </div>
      <div className={Styles.cardSec3}>
        <Analytics promotedEvents={promotedEvents} />
      </div>
    </div>
  )
}

const WidgetCard = ({ data, setDeleteId }: WidgetCardProps) => {

  const propsData = data;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [activeState, setActiveState] = useState("Active")
  const [categories, setCategories] = useState<string[]>()
  const [eventTypes, setEventTypes] = useState<string[]>()
  const [countries, setCountries] = useState<string[]>()
  const [promotedEvents, setPromotedEvents] = useState<PromotedEvent[]>([]);
  const [widgetType, setWidgetType] = useState<string>('')
  const [width, setWidth] = useState(window.outerWidth);
  const [accordian, setAccordian] = useState(false)


  const handleModal = () => {
    setDeleteModal(!deleteModal)
  }

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.outerWidth);
    };

    window.addEventListener('resize', handleResize);

    if (propsData.body) {
      const body = JSON.parse(propsData.body)
      setWidgetType(body.widgetType)
    } else {
      setWidgetType("Sticky")
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const response = await fetch(`https://api.eventgeni.com/widgets/${propsData.id}?type=${widgetType === "Sticky" ? "sticky" : "page"}`);
        const widgetData = await response.json();
        if (widgetType === "Sticky") {
          const active = widgetData.data.active
          if (active === "true") {
            setActiveState("Active")
          } else {
            setActiveState("Inactive")
          }
        } else {
          const formBody = JSON.parse(widgetData.data.body)
          const query = widgetData.query
          if (formBody.active) {
            setActiveState("Active")
          } else {
            setActiveState("Inactive")
          }
          if (!response.ok) {
            throw new Error('Failed to fetch widget data');
          }
          const additionalDataResponse = await fetch(`https://api.eventgeni.com/es/find?company=104&${query}`);
          const additionalData = await additionalDataResponse.json();
          handleAdditionalData(additionalData);
        }
      } catch (error) {
        console.error('Error fetching widget data:', error);
      }
    };
    fetchWidgetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetType])
  // This function is to extract the categroies, types of the events to show it on the widget card
  const handleAdditionalData = (additionalData: any) => {
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
    const categoriesFromTop3 = additionalData.top_3 ? extractCategories(additionalData.top_3) : [];
    const eventTypesFromEventData = extractEventTypes(additionalData.eventData);
    const eventTypesFromTop3 = additionalData.top_3 ? extractEventTypes(additionalData.top_3) : [];
    const countriesFromEventData = extractCountries(additionalData.eventData);
    const countriesFromTop3 = additionalData.top_3 ? extractCountries(additionalData.top_3) : [];
    const highlightedEvents = additionalData.top_3 ? extractPromotedEvents(additionalData.top_3) : [];

    // Combine categories and event types from both arrays and remove duplicates
    const allCategories = [...categoriesFromEventData, ...categoriesFromTop3].reduce((acc, category) => {
      if (!acc.includes(category)) {
        acc.push(category);
      }
      return acc;
    }, []);
    const allEventTypes = [...eventTypesFromEventData, ...eventTypesFromTop3].reduce((acc, eventType) => {
      if (!acc.includes(eventType)) {
        acc.push(eventType);
      }
      return acc;
    }, []);
    const allCountries = [...countriesFromEventData, ...countriesFromTop3].reduce((acc, country) => {
      if (!acc.includes(country)) {
        acc.push(country);
      }
      return acc;
    }, []);

    // Update state with unique categories and event types
    setCategories(allCategories);
    setEventTypes(allEventTypes);
    setCountries(allCountries);
    setPromotedEvents(highlightedEvents)
  };

  return (
    <div className={Styles.container}>
      <div className={`${Styles.card} ${deleteModal ? Styles.blur : ''}`}>
        <div className={Styles.cardSec1}>
          <div className={Styles.spinner_headingContainer}>
            <div className={Styles.iconCircle}><Image src={Spinner} alt="icon" /></div>
            <div className={Styles.widgetNameHeading}>{`${widgetType} Widget`}</div>
          </div>
          <div className={Styles.date_configure_detailContainer}>
            <div className={Styles.date_configureContainer}>
              <div className={Styles.dateContainer}>
                <div style={{ display: "flex" }}><Image src={Calendar} alt="calendar" /></div>
                <div className={Styles.date}>1st Apr 2024</div>
                <div>-</div>
                <div className={Styles.date}>30th Apr 2024</div>
              </div>
              <Link
                className={Styles.configure}
                href={`/widget/${propsData.id}?widgetType=${widgetType}`}
              >
                <Image src={PenIcon} alt='edit' />
                <span>Configure</span>
              </Link>
            </div>
            {width <= 600 && <div className={Styles.viewDetailsContainer} onClick={() => setAccordian(!accordian)}>
              <div className={Styles.viewDetailsHeading}>View Details</div>
              <Image src={DownArrow} alt='down' className={Styles.viewDetailsIcon} />
            </div>}
          </div>
          <Image src={Delete} alt='delete' className={Styles.delete} onClick={handleModal} />
          <div className={Styles.statusBtn}>
            <div className={`${Styles.activeFlag} ${activeState === "Inactive" ? Styles.inactiveFlag : ''}`}></div>
            <div className={`${Styles.status} ${activeState === "Inactive" ? Styles.inactiveStatus : ''}`}>{activeState}</div>
          </div>
        </div>
        {width <= 600 ? (accordian &&
          <AccordianCode widgetType={widgetType}
            countries={countries}
            categories={categories}
            eventTypes={eventTypes}
            promotedEvents={promotedEvents}
          />
        ) :
          <AccordianCode widgetType={widgetType}
            countries={countries}
            categories={categories}
            eventTypes={eventTypes}
            promotedEvents={promotedEvents} />
        }
      </div>
      <div className={Styles.deleteModal}>
        {deleteModal && <DeleteModal type={widgetType.toLowerCase()} id={propsData.id} handleModal={handleModal} setDeleteId={setDeleteId} />}
      </div>
    </div>
  )
}

export default WidgetCard
