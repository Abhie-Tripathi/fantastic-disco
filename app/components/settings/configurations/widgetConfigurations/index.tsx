import React, { useEffect, useState } from "react";
import styles from "./widgetConfig.module.css";
import StickyTopWigitCard from "./StickyTopwigitCard";
import PageWigitCard from "./PageWigetCard";
import PlusIcon from "/public/addIcon.svg";
import ApproveIcon from "/public/approvedIcon.svg";
import conciergeIcon from "/public/conciergeIcon.svg";
import CrossIcon from "/public/crossIcon.svg";
import ShortListedIcon from "/public/shortlistedIcon.svg";
import ThreeDots from "/public/threeDots.svg";
import TimerIcon from "/public/timer.svg";
import Image from "next/image";
const Index = () => {
  const [widgets, setWidgets] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePage = await fetch(
          "https://api.eventgeni.com/widgets?type=page"
        );
        const responseSticky = await fetch(
          "https://api.eventgeni.com/widgets?type=sticky"
        );
        const dataPage = await responsePage.json();
        const dataSticky = await responseSticky.json();
        const allWidgets = [...dataPage, ...dataSticky];
        setWidgets(allWidgets);
      } catch (error) {
        console.error("Error fetching widgets:", error);
      }
    };

    fetchData();
  }, []);

  const [staticCardsData, setCardData] = useState([
    {
      id: 1,
      cardItitle: "Shortlisted",
      dotIcon: ThreeDots,
      icon: ShortListedIcon,
      text: " List of all shortlisted events by admin",
    },
    {
      id: 2,
      cardItitle: "In Process",
      dotIcon: ThreeDots,
      icon: TimerIcon,
      text: "List of all the events in negotiations",
    },
    {
      id: 3,
      cardItitle: "Concierge",
      dotIcon: ThreeDots,
      icon: conciergeIcon,
      text: "EventGeni Support",
    },
    {
      id: 4,
      cardItitle: "Approved",
      dotIcon: ThreeDots,
      icon: ApproveIcon,
      text: " List of all events finalised afted negotiations",
    },
    {
      id: 5,
      cardItitle: "Declined",
      dotIcon: ThreeDots,
      icon: CrossIcon,
      text: " List of all events declined after negotiations",
    },
  ]);

  const addCard = () => {
    const newCardId = Math.random().toString(36).substring(7);
    const newCard = {
      id: newCardId,
      cardItitle: "Shortlisted",
      dotIcon: ThreeDots,
      icon: ShortListedIcon,
      text: " List of all shortlisted events by admin",
    };
    // setCardData([...staticCardsData, newCard]);
  };

  return (
    <div
      className={`${styles.container} ${styles.deleteModal ? styles.blur : ""}`}
    >
      <div className={styles.gradient_border}>Wigets Configurations</div>
      <div className={styles.textContainer}>
        You can manage and configure all the widgets currently enabled here{" "}
      </div>

      <div className={styles.wigitCard_container}>
        {widgets?.length > 0
          ? widgets.map((item: any, index: number) => (
            <div key={index}>
              <StickyTopWigitCard data={item} />
            </div>
          ))
          : "No widgets Added"}
        {/* <StickyTopWigitCard />
        <PageWigitCard/> */}
      </div>
      <div className={styles.outreachPanelSec}>
        <div className={styles.gradient_border}>Outreach Configurations</div>

        <div className={styles.subText}>
          {" "}
          You can manage and configure all the stages present on the outreach
        </div>
        <div className={styles.outreachCard_container}>
          {staticCardsData?.map((card: any, id: any, key:any) => (
            <div key={key}
              className={`${styles.outreachCard} ${id % 2 === 0 ? styles.cardbackgroundColor : ""
                }`}
            >
              <div className={styles.cardTopSec}>
                <Image src={card?.icon} alt="" />
                <div className={styles.inner_sec}>{card.cardItitle}</div>
                <Image src={ThreeDots} alt="dots" />
              </div>
              <div className={styles.innerText}>{card.text}</div>
            </div>
          ))}
          <div className={styles.cards_borderBottom}></div>

          <div className={styles.addBtnContainer}>
            <Image
              src={PlusIcon}
              style={{ cursor: "pointer" }}
              alt="add"
              onClick={addCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
