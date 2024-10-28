import { Location } from "geist-icons";
import styles from "./overview.style.module.css";
import { useTheme } from "@/context";
import Image from "next/image";
import PlaceHolder from '/public/placeholder.png'
import Exhibitors from "./overviewSections/Exhibitors";
import Speakers from "./overviewSections/Speakers";
import Sponsors from "./overviewSections/Sponsors";
import { Button, Tooltip, TooltipTrigger } from "react-aria-components";
import CircularProgress from "./overviewSections/CircularProgress";
import Link from "next/link";

interface OverviewProps {
  eventDetail: any;
}

function toTitleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function isUpcomingEvent(startDate: Date): boolean {
  startDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return startDate > today;
}

const Overview = ({ eventDetail }: OverviewProps) => {
  const { theme } = useTheme();
  return (
    <>
      <div className={`${styles.infoCard}`}>
        <div className={`${styles.infoCardLeft} card`}>

          {eventDetail?.format &&
            <div className={styles.categoryContainer}>
              <div className={styles.subHeading}>Format</div>
              <div className={styles.categoryBadges}>
                <div className={styles.catItem}>{toTitleCase(eventDetail.format)}</div>
              </div>
            </div>
          }

          {/* {eventDetail?.startDate && isUpcomingEvent(eventDetail.startDate) &&
            <div className={styles.categoryContainer}>
              <div className={styles.subHeading}>Status</div>
              <div className={styles.categoryBadges}>
                <div className={styles.catItem}>Upcoming Event</div>
              </div>
            </div>
          } */}

          {/* <div className={styles.categoryContainer}>
            <div className={styles.subHeading}>Edition</div>
            <div className={styles.categoryBadges}>
              <div className={styles.catItem}>Online</div>
            </div>
          </div> */}

          {eventDetail?.frequency &&
            <div className={styles.categoryContainer}>
              <div className={styles.subHeading}>Frequency</div>
              <div className={styles.categoryBadges}>
                <div className={styles.catItem}>{eventDetail?.frequency}</div>
              </div>
            </div>
          }

          <div className={styles.categoryContainer}>
            <div className={styles.subHeading}>Category</div>
            <div className={styles.categoryBadges}>
            {eventDetail?.categories &&
              eventDetail.categories.map((cat: any, index: number) => (
                cat?.isGroup &&
                  <div key={index} className={styles.catItem}>{cat.name}</div>
              ))}
            </div>
          </div>
          {eventDetail?.eventKeywords && eventDetail.eventKeywords.length > 0 &&
            <div className={styles.categoryContainer}>
              <div className={styles.subHeading}>Event Keywords</div>
              <div className={styles.categoryBadges}>
                {eventDetail.eventKeywords.slice(0,4).map((cat: any, index: number) => (
                  <div key={index} className={styles.catItem}>{cat}</div>
                ))}
                {eventDetail.eventKeywords.length > 4 &&
                <>
                  <TooltipTrigger>
                    <Button className={styles.moreItems} >+{eventDetail.eventKeywords.length - 4} more</Button>
                    <Tooltip className={styles['react-aria-Tooltip']}>
                      {eventDetail.eventKeywords.join(" | ")}
                    </Tooltip>
                  </TooltipTrigger>
                </>
                }
              </div>
            </div>
          }
        </div>
        <div className={`${styles.infoCardRight} card`}>

          <div className={styles.relevanceHeading}>
            <span style={{fontSize: 'var(--font-size-default)'}} >Tracker Relevance Score</span>
            {/* <Link className={styles.addTrackerBtn} href={'/internal/trackers'} >Add to Tracker</Link> */}
            <span className='badge_danger' style={{fontSize: 'var(--font-size-small)'}}>Demo</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <CircularProgress percentages={[80, 50, 70]} relevanceScore={'89'} />
          </div>

          <div style={{display: 'flex', gap: '6px'}}>
            <div style={{width: '100%'}}>
              <div style={{fontSize: 'var(--font-size-large)'}}>80</div>
              <div style={{fontSize: 'var(--font-size-default)', padding: '4px 0', color: '#646BDC'}}>People</div>
              <div style={{height: '13px', background: '#646BDC', borderRadius: '4px'}}></div>
            </div>
            <div style={{width: '100%'}}>
              <div style={{fontSize: 'var(--font-size-large)'}}>50</div>
              <div style={{fontSize: 'var(--font-size-default)', padding: '4px 0', color: '#E99CD4'}}>Purpose</div>
              <div style={{height: '13px', background: '#E99CD4', borderRadius: '4px'}}></div>
            </div>
            <div style={{width: '100%'}}>
              <div style={{fontSize: 'var(--font-size-large)'}}>70</div>
              <div style={{fontSize: 'var(--font-size-default)', padding: '4px 0', color: '#9B86D4'}}>Prospect</div>
              <div style={{height: '13px', background: '#9B86D4', borderRadius: '4px'}}></div>
            </div>
          </div>

          {/* <div className={styles.categoryContainer}>
            <div className={styles.subHeading}>Category</div>
            <div className={styles.categoryBadges}>
            {eventDetail?.categories &&
              eventDetail.categories.map((cat: any, index: number) => (
                cat?.isGroup &&
                  <div key={index} className={styles.catItem}>{cat.name}</div>
              ))}
            </div>
          </div>
          {eventDetail?.eventKeywords && eventDetail.eventKeywords.length > 0 &&
            <div className={styles.categoryContainer}>
              <div className={styles.subHeading}>Event Keywords</div>
              <div className={styles.categoryBadges}>
                {eventDetail.eventKeywords.slice(0,4).map((cat: any, index: number) => (
                  <div key={index} className={styles.catItem}>{cat}</div>
                ))}
                {eventDetail.eventKeywords.length > 4 &&
                <>
                  <TooltipTrigger>
                    <Button className={styles.moreItems} >+{eventDetail.eventKeywords.length - 4} more</Button>
                    <Tooltip className={styles['react-aria-Tooltip']}>
                      {eventDetail.eventKeywords.join(" | ")}
                    </Tooltip>
                  </TooltipTrigger>
                </>
                }
              </div>
            </div>
          } */}
        </div>
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Event Description</div>
      <div className={styles.eventDesc}>
        {eventDetail?.description}
      </div>

      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Organizer</div>
      <div className={`${styles.infoCard} card`}>
        <div className={styles.hostDetailsContainer}>
            {/* <Image src={PlaceHolder} alt='company' width={96} height={96} style={{ borderRadius: 8 }} /> */}
            <div className={styles.hostDetails}>
                <div className={styles.hostname}>{eventDetail?.organizer?.name}</div>
                {(eventDetail.organizer?.cityName || eventDetail.organizer?.countryName) &&
                  <div className={styles.hostlocation}>
                    <Location color={"var(--secondary-text-color)"} />
                    <span>
                      {(eventDetail.organizer?.cityName && eventDetail.organizer?.countryName) ?
                        (eventDetail.organizer.cityName +', '+eventDetail.organizer?.countryName) :
                        eventDetail.organizer.countryName
                      }
                    </span>
                  </div>
                }
                <div style={{display: 'flex', gap: '24px'}}>
                {/* <div className={styles.upcoming}>Upcoming Events <span>N/A</span></div>
                <div className={styles.hosted}>Events Hosted <span>12</span></div> */}
                </div>
            </div>
        </div>
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Exhibitors</div>
      <div className={styles.blurContent}>
        <Exhibitors />
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Speakers</div>
      <div className={styles.blurContent}>
        <Speakers />
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Sponsors</div>
      <div className={styles.blurContent}>
        <Sponsors />
      </div>
    </>
  );
};

export default Overview;
