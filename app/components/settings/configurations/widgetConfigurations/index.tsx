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
  const fetchData = async (type: string): Promise<any[]> => {
    try {
      const response = await fetch(`https://api.eventgeni.com/widgets?type=${type}`);
      const data = await response.json();
      return data.data[type + 'Data'];
    } catch (error) {
      console.error('Error fetching widgets:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllWidgets = async () => {
      try {
        const pageWidgets = await fetchData('page');
        const stickyWidgets = await fetchData('sticky');
        const allWidgets = [...pageWidgets, ...stickyWidgets];
        const sortedWidgets = allWidgets.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        setWidgets(sortedWidgets);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };
    fetchAllWidgets();
  }, []);
  const [openPopUpIndex, setOpenPopUpIndex] = useState(null);
  const [openEditPopUp, setOpenEditPopUp] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editItems, setEditItems] = useState<any>({});
  const togglePopUp = (index: any) => {
    setOpenPopUpIndex((prevIndex) => (prevIndex === index ? null : index));
    setIsOpen(true);
  };

  const editCard = (index: any, card: any) => {
    setOpenEditPopUp((prevIndex) => (prevIndex === index ? null : index));
    setEditItems(card);
    setIsEdit(true);
  };

  const handleEdit = (id: any, newContent: any) => {
    const updatedCards = staticCardsData.map((card) => {
      if (card.id === id) {
        return (card.cardTitle = newContent), (card.text = newContent);
      }
      return card;
    });
    setCardData(updatedCards);
    setIsEdit(false);
    setIsOpen(false);
  };

  const handleDelete = (id: any) => {
    setCardData((prevCards) => prevCards.filter((card) => card.id !== id));
    setIsOpen(false);
  };

  const [staticCardsData, setCardData] = useState([
    {
      id: 0,
      cardTitle: "Shortlisted",
      dotIcon: ThreeDots,
      icon: ShortListedIcon,
      text: " List of all shortlisted events by admin",
    },
    {
      id: 1,
      cardTitle: "In Process",
      dotIcon: ThreeDots,
      icon: TimerIcon,
      text: "List of all the events in negotiations",
    },
    {
      id: 2,
      cardTitle: "Concierge",
      dotIcon: ThreeDots,
      icon: conciergeIcon,
      text: "EventGeni Support",
    },
    {
      id: 3,
      cardTitle: "Approved",
      dotIcon: ThreeDots,
      icon: ApproveIcon,
      text: "List of all events finalised afted negotiations",
    },
    {
      id: 4,
      cardTitle: "Declined",
      dotIcon: ThreeDots,
      icon: CrossIcon,
      text: " List of all events declined after negotiations",
    },
  ]);

  const addCard = () => {
    const newCard = {
      id: staticCardsData.length,
      cardTitle: "New Card",
      dotIcon: ThreeDots,
      icon: TimerIcon,
      text: "Description of the new card",
    };
    setCardData((prevCards) => [...prevCards, newCard]);
  };

  return (
    <div
      className={`${styles.container} ${styles.deleteModal ? styles.blur : ""}`}
    >
      <section id="widgets_configurations">
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
      </section>

      <section id="outreach_configurations">
        <div className={styles.outreachPanelSec}>
          <div className={styles.gradient_border}>Outreach Configurations</div>

          <div className={styles.subText}>
            {" "}
            You can manage and configure all the stages present on the outreach
          </div>
          <div className={styles.outreachCard_container}>
            {staticCardsData.map((card, index) => (
              <div
                key={index}
                className={`${styles.outreachCard} ${
                  index % 2 === 0 ? styles.cardbackgroundColor : ""
                }`}
              >
                <div className={styles.cardTopSec}>
                  <Image src={card?.icon} alt="" />
                  <div className={styles.inner_sec}>{card.cardTitle}</div>
                  <Image
                    src={ThreeDots}
                    alt="dots"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePopUp(index)}
                  />
                </div>

                {isOpen && openPopUpIndex === index && (
                  <div className={styles.popUp}>
                    <div
                      className={styles.popUpContent}
                      onClick={() => editCard(index, card)}
                      style={{ cursor: "pointer" }}
                    >
                      <Image src={PencilIcon} alt="pen" />
                      Edit
                    </div>
                    <div
                      className={styles.popUpContent}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(index)}
                    >
                      <Image src={Delete} alt="delete" />
                      Delete
                    </div>
                  </div>
                )}

                {isEdit && openEditPopUp === index && (
                  <div className={styles.editPopUp}>
                    <div>
                      <input
                        className={styles.inputBox}
                        value={editItems?.cardTitle}
                        onChange={(e) =>
                          setEditItems({
                            ...editItems,
                            cardTitle: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <input
                        className={styles.inputBox}
                        value={editItems?.text}
                        onChange={(e) =>
                          setEditItems({
                            ...editItems,
                            text: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className={styles.btn_container}>
                      <div
                        className={styles.btn}
                        onClick={() => handleEdit(index, editItems)}
                      >
                        Save
                      </div>
                      <div
                        className={styles.btn}
                        onClick={() => setIsEdit(false)}
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
      </section>
    </div>
  );
};

export default Index;
