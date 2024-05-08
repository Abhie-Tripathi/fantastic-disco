import React, { useEffect, useState } from "react";
import styles from "./widgetConfig.module.css";
import StickyTopWigitCard from "./StickyTopwigitCard";
import PlusIcon from "/public/addIcon.svg";
import ApproveIcon from "/public/approvedIcon.svg";
import conciergeIcon from "/public/conciergeIcon.svg";
import CrossIcon from "/public/crossIcon.svg";
import ShortListedIcon from "/public/shortlistedIcon.svg";
import ThreeDots from "/public/threeDots.svg";
import TimerIcon from "/public/timer.svg";
import Image from "next/image";
import PencilIcon from "/public/pencilIcon.svg";
import Delete from "/public/deleteIconSvg.svg";
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
  const [openPopUpIndex, setOpenPopUpIndex] = useState(null);
  const [openEditPopUp, setOpenEditPopUp] = useState(null);
  const [isEdit, setIsedit] = useState(false);
  const [editItems, setEditItems] = useState<any>({});
  const [staticCardsData, setCardData] = useState([
    {
      id: 0,
      cardItitle: "Shortlisted",
      dotIcon: ThreeDots,
      icon: ShortListedIcon,
      text: " List of all shortlisted events by admin",
    },
    {
      id: 1,
      cardItitle: "In Process",
      dotIcon: ThreeDots,
      icon: TimerIcon,
      text: "List of all the events in negotiations",
    },
    {
      id: 2,
      cardItitle: "Concierge",
      dotIcon: ThreeDots,
      icon: conciergeIcon,
      text: "EventGeni Support",
    },
    {
      id: 3,
      cardItitle: "Approved",
      dotIcon: ThreeDots,
      icon: ApproveIcon,
      text: " List of all events finalised afted negotiations",
    },
    {
      id: 4,
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

  const togglePopUp = (index: any) => {
    setOpenPopUpIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const editCard = (index: any, card: any) => {
    console.log("cards", card);
    setOpenEditPopUp((prevIndex) => (prevIndex === index ? null : index));
    setEditItems(card);
    setIsedit(true);
  };

  const handleEdit = (id: any, newContent: any) => {
    const updatedCards = staticCardsData.map((card) => {
      if (card.id === id) {
        return (card.cardItitle = newContent);
      }
      return card;
    });
    setCardData(updatedCards);
  };


  // const handleDelete = (id:any) => {
  //   console.log("ifddd", id)
  //   setCardData(staticCardsData.filter(card => card.id !== id));
  // };

  const handleDelete = (id:any) => {
    setCardData(prevCards => prevCards.filter(card => card.id !== id));
  };

  console.log("cardssss", staticCardsData)

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
      </div>
      <div className={styles.outreachPanelSec}>
        <div className={styles.gradient_border}>Outreach Configurations</div>

        <div className={styles.subText}>
          {" "}
          You can manage and configure all the stages present on the outreach
        </div>
        <div className={styles.outreachCard_container}>
          {staticCardsData?.map((card: any, id: any, key: any) => (
            <div
              key={key}
              className={`${styles.outreachCard} ${
                id % 2 === 0 ? styles.cardbackgroundColor : ""
              }`}
            >
              <div className={styles.cardTopSec}>
                <Image src={card?.icon} alt="" />
                <div className={styles.inner_sec}>{card.cardItitle}</div>
                <Image
                  src={ThreeDots}
                  alt="dots"
                  style={{ cursor: "pointer" }}
                  onClick={() => togglePopUp(id)}
                />
              </div>
              {openPopUpIndex === id && (
                <div className={styles.popUp}>
                  {/* Content of the pop-up */}
                  <div
                    className={styles.popUpContent}
                    onClick={() => editCard(id, card)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image src={PencilIcon} alt="pen" />
                    Edit
                  </div>
                  <div className={styles.popUpContent} style={{ cursor: "pointer" }}
                  // onClick={() => handleDelete(id)}
                  >
                    <Image src={Delete} alt="delete" />
                    Delete
                  </div>
                </div>
              )}

              {isEdit && openEditPopUp === id && (
                <div className={styles.editPopUp}>
                  <div>
                    <input
                      value={editItems?.cardItitle}
                      onChange={(e) =>
                        setEditItems({
                          ...editItems,
                          cardItitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div></div>

                  <div className={styles.btn_container}>
                    <div
                      className={styles.btn}
                      onClick={() => handleEdit(id, editItems)}
                    >
                      Save
                    </div>
                    <div
                      className={styles.btn}
                      onClick={() => setIsedit(false)}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              )}
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
