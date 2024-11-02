import React from 'react'
import styles from './eventlistcard1.style.module.css'
import Image from 'next/image'
// import placeholder2 from '/public/placeholder2.png'
import placeholder2 from '/public/DemoBanner.png'
import locationIcon from '/public/location.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import POP from '/public/partyPopIcon.svg'
import TradeshowIcon from '/public/tradeshowIcon.svg'

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}
interface CardProps {
  cardBgColor?: string;
  cardBorderRadius?: number;
  fontSettings?: {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
  };
  fetchedEvent?: PrefilledAddedEventsType;
  demoBanner:string;
  demoEventName:string; 
  demoDescription:string;
  demoLocation:string;
  demoDate:string
}
const EventListCard1 = ({
  cardBgColor = "#ffffff",
  cardBorderRadius = 20,
  fontSettings = {
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
  }, fetchedEvent, demoBanner, demoEventName, demoDescription,demoLocation, demoDate }: CardProps) => {

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  const formatStartDate = (dateString: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return { day, month };
  };

  const description = fetchedEvent ? truncateText(fetchedEvent.description, 130) : demoDescription;
  const truncatedDescription = description.substring(0, 130) + (description.length > 130 ? "..." : "");
  const { day, month } = fetchedEvent ? formatStartDate(fetchedEvent.startDate) : { day: 1, month: "Jan" };
  return (
    <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
      <Image width={260} height={200} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='banner' className={styles.banner} style={{objectFit : "cover"}}/>
      <div className={styles.detailsContainer}>
        <div className={styles.date_location_nameContainer}>
            {/* <div className={styles.dateContainer}>
              <span className={styles.date} style={{ fontSize: fontSettings.heading.fontSize }}>{day}</span>
              <span className={styles.month} style={{ fontSize: fontSettings.heading.fontSize }}>{month}</span>
            </div> */}


            <div className={styles.dateContainer}>
             {
                fetchedEvent?.eventType === "SUB" ? <><Image src={POP} alt=''/></>:fetchedEvent?.eventType === "MAIN" ? <Image src={TradeshowIcon} alt=''/>:<Image src={POP} alt=''/>
             }
           </div>
         
          <div className={styles.line}></div>
          <div className={styles.name_locationContainer}>
            <div className={styles.locationContainer}>
              <LocationIcon color={fontSettings.subheading.fontColor}/>
              <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? (fetchedEvent.cityName + ", " + fetchedEvent.countryName).substring(0,20) : demoLocation}</div>
            </div>
            <div className={styles.eventName} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>{fetchedEvent ? `${fetchedEvent.name.substring(0,30)} ${fetchedEvent.name.length > 30 ?"...":""}` : demoEventName}</div>
          </div>
        </div>
        <div className={styles.description} style={{ fontSize: fontSettings.body.fontSize, color: fontSettings.body.fontColor, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight }} dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
        <div className={styles.dateRange_typeContainer}>
          <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : demoDate}</div>
          <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>Tradeshow</div>
          <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings.body.fontSize }}>Attending</div>
        </div>
      </div>
    </div>
  );
}

export default EventListCard1

interface IconProps {
  color: string;
}

function LocationIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={color} /></svg>
  )
}

function PartyPopupIcon() {
  <svg width="52" height="51" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28.2682 41.7517L15.5957 45.9742C8.68317 48.2792 5.22567 49.4317 3.40067 47.6067C1.57567 45.7817 2.72817 42.3242 5.03317 35.4117L9.25817 22.7392C11.1732 16.9942 12.1307 14.1217 14.3957 13.5892C16.6607 13.0517 18.8032 15.1942 23.0832 19.4767L31.5332 27.9242C35.8132 32.2067 37.9557 34.3467 37.4207 36.6117" stroke="#6750A4" stroke-width="3.75" stroke-linecap="round"/>
  <path d="M25.6006 41.8511C25.6006 41.8511 23.7056 36.1486 23.7056 32.3761C23.7056 28.6011 25.6006 22.8961 25.6006 22.8961M15.1756 44.6961C15.1756 44.6961 13.5756 37.8136 13.2806 33.3211C12.7931 25.8986 15.1756 14.3686 15.1756 14.3686M31.2881 21.0011L31.6456 19.2011C32.0106 17.3836 33.3206 15.9011 35.0781 15.3161C35.9412 15.027 36.7128 14.5154 37.315 13.8328C37.9172 13.1503 38.3288 12.321 38.5081 11.4286L38.8681 9.62859M38.9381 29.1186L39.4681 29.4261C41.1106 30.3761 43.1756 30.1661 44.5956 28.9086C45.2245 28.3492 46.0006 27.982 46.8319 27.8504C47.6631 27.7188 48.5147 27.8283 49.2856 28.1661L50.0131 28.4861M19.5006 2.93359C19.0905 3.60414 18.9181 4.3932 19.011 5.17368C19.104 5.95417 19.457 6.68065 20.0131 7.23609L20.2581 7.48109C21.2406 8.46359 21.6031 9.90609 21.2006 11.2386" stroke="#6750A4" stroke-width="3.75" stroke-linecap="round"/>
  <path d="M12.3356 5.84486C12.4604 5.72043 12.6084 5.6218 12.7713 5.55458C12.9342 5.48737 13.1087 5.45289 13.2849 5.45313C13.4611 5.45336 13.6355 5.48829 13.7982 5.55594C13.9609 5.62358 14.1087 5.72261 14.2331 5.84736C14.3576 5.97212 14.4562 6.12016 14.5234 6.28303C14.5906 6.44591 14.6251 6.62043 14.6249 6.79663C14.6246 6.97283 14.5897 7.14726 14.5221 7.30995C14.4544 7.47265 14.3554 7.62043 14.2306 7.74486C13.9787 7.99615 13.6372 8.13707 13.2814 8.1366C12.9255 8.13613 12.5844 7.99432 12.3331 7.74236C12.0818 7.49041 11.9409 7.14894 11.9414 6.79309C11.9419 6.43724 12.0837 6.09615 12.3356 5.84486ZM25.4081 13.8874C25.5327 13.7628 25.6806 13.6639 25.8434 13.5965C26.0062 13.5291 26.1807 13.4944 26.3569 13.4944C26.5331 13.4944 26.7076 13.5291 26.8704 13.5965C27.0331 13.6639 27.1811 13.7628 27.3056 13.8874C27.4302 14.012 27.5291 14.1599 27.5965 14.3227C27.6639 14.4854 27.6986 14.6599 27.6986 14.8361C27.6986 15.0123 27.6639 15.1868 27.5965 15.3496C27.5291 15.5124 27.4302 15.6603 27.3056 15.7849C27.054 16.0365 26.7127 16.1778 26.3569 16.1778C26.001 16.1778 25.6598 16.0365 25.4081 15.7849C25.1565 15.5332 25.0152 15.192 25.0152 14.8361C25.0152 14.4803 25.1565 14.139 25.4081 13.8874ZM37.9081 21.3874C38.0327 21.2628 38.1806 21.1639 38.3434 21.0965C38.5062 21.0291 38.6807 20.9944 38.8569 20.9944C39.0331 20.9944 39.2076 21.0291 39.3704 21.0965C39.5331 21.1639 39.6811 21.2628 39.8056 21.3874C39.9302 21.512 40.0291 21.6599 40.0965 21.8227C40.1639 21.9854 40.1986 22.1599 40.1986 22.3361C40.1986 22.5123 40.1639 22.6868 40.0965 22.8496C40.0291 23.0124 39.9302 23.1603 39.8056 23.2849C39.554 23.5365 39.2127 23.6778 38.8569 23.6778C38.501 23.6778 38.1598 23.5365 37.9081 23.2849C37.6565 23.0332 37.5152 22.692 37.5152 22.3361C37.5152 21.9803 37.6565 21.639 37.9081 21.3874ZM42.6606 34.2774C42.7852 34.1528 42.9331 34.0539 43.0959 33.9865C43.2587 33.9191 43.4332 33.8844 43.6094 33.8844C43.7856 33.8844 43.9601 33.9191 44.1229 33.9865C44.2856 34.0539 44.4336 34.1528 44.5581 34.2774C44.6827 34.402 44.7816 34.5499 44.849 34.7127C44.9164 34.8754 44.9511 35.0499 44.9511 35.2261C44.9511 35.4023 44.9164 35.5768 44.849 35.7396C44.7816 35.9024 44.6827 36.0503 44.5581 36.1749C44.3065 36.4265 43.9652 36.5678 43.6094 36.5678C43.2535 36.5678 42.9123 36.4265 42.6606 36.1749C42.409 35.9232 42.2677 35.582 42.2677 35.2261C42.2677 34.8703 42.409 34.529 42.6606 34.2774Z" fill="#6750A4"/>
  <path d="M43.403 15.2705C41.728 16.9455 42.928 21.8055 42.928 21.8055C42.928 21.8055 47.788 23.008 49.463 21.3305C51.238 19.5555 50.233 17.2305 47.498 17.2355C47.5055 14.5005 45.178 13.4955 43.403 15.2705Z" stroke="#6750A4" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M32.9626 4.53014L32.8951 4.77514C32.8201 5.04014 32.7801 5.17514 32.8001 5.30514C32.8176 5.43514 32.8876 5.55014 33.0326 5.77764L33.1626 5.98264C33.6676 6.78264 33.9201 7.18264 33.7476 7.51014C33.5751 7.83764 33.0926 7.87514 32.1276 7.95014L31.8776 7.97014C31.6026 7.99264 31.4676 8.00264 31.3476 8.06514C31.2276 8.12764 31.1401 8.23514 30.9601 8.45264L30.8001 8.65014C30.1726 9.41014 29.8601 9.79014 29.5001 9.74264C29.1451 9.69264 28.9801 9.24764 28.6501 8.35514L28.5651 8.12514C28.4726 7.87014 28.4251 7.74514 28.3326 7.65014C28.2401 7.56014 28.1151 7.51264 27.8601 7.42014L27.6301 7.33514C26.7376 7.00514 26.2926 6.84014 26.2426 6.48514C26.1926 6.12514 26.5751 5.81014 27.3351 5.18514L27.5326 5.02264C27.7476 4.84764 27.8576 4.75764 27.9201 4.63764C27.9826 4.51764 27.9951 4.38014 28.0151 4.10514L28.0351 3.85514C28.1101 2.89264 28.1476 2.41014 28.4751 2.23764C28.8001 2.06514 29.2001 2.31764 30.0001 2.82264L30.2076 2.95264C30.4351 3.09764 30.5501 3.16764 30.6801 3.18514C30.8101 3.20264 30.9451 3.16514 31.2101 3.09014L31.4551 3.02264C32.3926 2.75514 32.8626 2.62264 33.1126 2.87264C33.3626 3.12264 33.2301 3.59264 32.9626 4.53014Z" stroke="#6750A4" stroke-width="2.5"/>
  </svg>
}