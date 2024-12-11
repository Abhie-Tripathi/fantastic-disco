import React, { useState } from "react";
import styles from "./product.style.module.css";
import { useAuthContext, useTheme } from "@/context";
const ProductSettings = () => {
  const { theme } = useTheme();
  const iconClass = theme === "dark" ? "icons_light" : "icon";
  const [editingResearchScreenBoxId, setResearchScreenEditingBoxId] = useState<
    number | null
  >(null);
  const [editingOutreachScreenBoxId, setOutreachScreenEditingBoxId] = useState<
    number | null
  >(null);
  const [researchTempValue, setResearchTempValue] = useState("");
  const [outreachTempValue, setOutreachTempValue] = useState("");

  const [cards, setCards] = useState([
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
    { id: 4, value: "" },
  ]);
  const [cardTempValue, setCardTempValue] = useState("");

  const [researchScreenboxes, setResearchScreenBoxes] = useState([
    { id: 1, value: "Bookmark" },
    { id: 2, value: "Speaking" },
    { id: 3, value: "Sponsoring" },
    { id: 4, value: "Attending" },
  ]);
  const [outreachScreenboxes, setOutreachScreenBoxes] = useState([
    { id: 1, value: "Shortlisted" },
    { id: 2, value: "In progess" },
    { id: 3, value: "Confirmed" },
    // { id: 4, value: "" },
  ]);
  const MAX_BOXES = 4;
  const removeResearchScreenBox = (id: any) => {
    setResearchScreenBoxes((prevBoxes) =>
      prevBoxes.filter((box) => box.id !== id)
    );
  };

  const removeOutreachScreenBox = (id: any) => {
    setOutreachScreenBoxes((prevBoxes) =>
      prevBoxes.filter((box) => box.id !== id)
    );

    setCards((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
  };

  const handleChangeResearchScreenBoxes = (id: number, value: string) => {
    setResearchTempValue(value);
  };
  const handleChangeOutreachScreenBoxes = (id: number, value: string) => {
    setOutreachTempValue(value);
  };

  const handleResearchScreenEdit = (id: number, currentValue: string) => {
    setResearchScreenEditingBoxId(id);
    setResearchTempValue(currentValue);
  };

  const handleOutreachchScreenEdit = (id: number, currentValue: string) => {
    setOutreachScreenEditingBoxId(id);
    setOutreachTempValue(currentValue);
  };

  const handleResearchScreenSave = (id: number) => {
    setResearchScreenBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id ? { ...box, value: researchTempValue } : box
      )
    );
    setResearchScreenEditingBoxId(null);
    setResearchTempValue("");
  };

  const handleOutreachScreenSave = (id: number) => {
    setOutreachScreenBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id ? { ...box, value: outreachTempValue } : box
      )
    );
    setOutreachScreenEditingBoxId(null);
    setOutreachTempValue("");
    setCards((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id ? { ...box, value: outreachTempValue } : box
      )
    );
  };
  const handleResearchScreenCancel = () => {
    setResearchScreenEditingBoxId(null);
    setResearchTempValue("");
  };

  const handleOutreachScreenCancel = () => {
    setOutreachScreenEditingBoxId(null);
    setOutreachTempValue("");
  };

  // const addResearchScreenBox = () => {
  //   setResearchScreenBoxes((prevBoxes) => [
  //     ...prevBoxes,
  //     { id: prevBoxes.length + 1, value: "" },
  //   ]);

  //   setResearchScreenEditingBoxId(null);
  //   setResearchTempValue("");
  // };
  const addResearchScreenBox = () => {
    if (researchScreenboxes.length >= MAX_BOXES) {
      alert("Cannot create more than 4 boxes");
      return;
    }

    setResearchScreenBoxes((prevBoxes) => [
      ...prevBoxes,
      { id: prevBoxes.length + 1, value: "" },
    ]);
  };

  const addOutreachScreenBox = () => {
    setOutreachScreenBoxes((prevBoxes) => [
      ...prevBoxes,
      { id: prevBoxes.length + 1, value: "" },
    ]);
    setCards((prevBoxes) => [
      ...prevBoxes,
      { id: prevBoxes.length + 1, value: "" },
    ]);
    setOutreachScreenEditingBoxId(null);
    setOutreachTempValue("");
  };

  const handleDragStartResearchScreen = (e: any, id: any) => {
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEndResearchScreen = (e: any) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOverResearchScreen = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: any
  ) => {
    e.preventDefault();

    const draggingElement = document.querySelector(".dragging") as HTMLElement;
    const targetElement = e.currentTarget as HTMLElement;

    if (draggingElement && targetElement) {
      const draggingId = draggingElement.dataset.id;
      const targetIndex = researchScreenboxes.findIndex(
        (box: any) => box.id === targetId
      );
      const draggingIndex = researchScreenboxes.findIndex(
        (box: any) => box.id === draggingId
      );

      if (draggingIndex !== targetIndex) {
        const updatedBoxes = [...researchScreenboxes];
        const [draggedBox] = updatedBoxes.splice(draggingIndex, 1);
        updatedBoxes.splice(targetIndex, 0, draggedBox);
        setResearchScreenBoxes(updatedBoxes);
      }
    }
  };

  const handleDropResearchScreen = (e: any) => {
    e.preventDefault();
  };

  const handleDragStartOutreachScreen = (e: any, id: any) => {
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEndOutreachScreen = (e: any) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOverOutreachScreen = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: any
  ) => {
    e.preventDefault();

    const draggingElement = document.querySelector(".dragging") as HTMLElement;
    const targetElement = e.currentTarget as HTMLElement;

    if (draggingElement && targetElement) {
      const draggingId = draggingElement.dataset.id;
      const targetIndex = outreachScreenboxes.findIndex(
        (box: any) => box.id === targetId
      );
      const draggingIndex = outreachScreenboxes.findIndex(
        (box: any) => box.id === draggingId
      );

      if (draggingIndex !== targetIndex) {
        const updatedBoxes = [...outreachScreenboxes];
        const [draggedBox] = updatedBoxes.splice(draggingIndex, 1);
        updatedBoxes.splice(targetIndex, 0, draggedBox);
        setOutreachScreenBoxes(updatedBoxes);
      }
    }
  };

  const handleDropOutreachScreen = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className={styles.settingsSection}>
      <div className={styles.settings_container}>
        <div className={styles.settings_icon}>
          <SettingIcon className={iconClass} />
        </div>
        <div className={styles.settings_text}>
          <div className={styles.customise_text}>Customise to your needs</div>
          <div className={styles.subText}>
            Take Control of what others see, what modules can access and how you
            receive updates and notify.{" "}
          </div>
        </div>
      </div>
      <div className={styles.settings_page_body}>
        <div className={styles.first_div}>
          <div className={styles.first_div_header}>
            <div className={styles.text_outer}>
              <div className={styles.research_text}>Research</div>
              <div className={styles.field_value_text}>Field Values</div>
            </div>
          </div>

          <div className={styles.first_div_body}>
            <div className={styles.body_container}>
              <div className={styles.body_left_section}>
                Customise your event experience by adjusting your interest!
                Update them any time to match your needs or goals for the event.
              </div>
              <div className={styles.body_right_section}>
                <div
                  className={`${styles.field_value_text_top} ${styles.hidden_for_large}`}
                >
                  Field Values
                </div>
                <div className={styles.boxContainer}>
                  {researchScreenboxes.map((box) => (
                    <div
                      key={box.id}
                      className={`${styles.boxWrapper} draggable`}
                      draggable
                      data-id={box.id}
                      onDragStart={(e) =>
                        handleDragStartResearchScreen(e, box.id)
                      }
                      onDragOver={(e) =>
                        handleDragOverResearchScreen(e, box.id)
                      }
                      onDrop={handleDropResearchScreen}
                      onDragEnd={handleDragEndResearchScreen}
                    >
                      <div className={styles.dotsContainer}>
                        <DragIcon />
                      </div>
                      <div className={styles.box}>
                        <input
                          type="text"
                          value={
                            editingResearchScreenBoxId === box.id
                              ? researchTempValue
                              : box.value
                          }
                          onChange={(e) =>
                            handleChangeResearchScreenBoxes(
                              box.id,
                              e.target.value
                            )
                          }
                          className={styles.boxInput}
                          onClick={() =>
                            handleResearchScreenEdit(box.id, box.value)
                          }
                        />
                      </div>
                      {editingResearchScreenBoxId === box.id && (
                        <div className={styles.iconContainer}>
                          <button
                            className={`${styles.iconButton} `}
                            onClick={() => handleResearchScreenSave(box.id)}
                          >
                            <CheckIcon />
                          </button>
                          <button
                            className={`${styles.iconButton} `}
                            onClick={() => removeResearchScreenBox(box.id)}
                          >
                            <CrossIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className={styles.plus_iconContainer}>
                    <button
                      className={`${styles.iconButton} ${styles.addButton}`}
                      onClick={addResearchScreenBox}
                      disabled={researchScreenboxes.length >= MAX_BOXES}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.second_div}>
          <div className={styles.second_div_header}>
            <div className={styles.second_div_text_outer}>
              <div className={styles.second_div_outreach_text}>Outreach</div>
              <div className={styles.second_div_field_value_text}>
                Kanban board
              </div>
            </div>
          </div>

          <div className={styles.second_div_body}>
            <div className={styles.second_div_body_container}>
              <div className={styles.second_div_body_left_section}>
                Personalise your workflow by renaming columns on your kanban
                board! Update them any time to fit your project needs or
                preferences.
              </div>
              <div className={styles.second_div_body_right_section}>
                <div
                  className={`${styles.second_div_field_value_text_top} ${styles.hidden_for_large}`}
                >
                  Kanban board
                </div>
                <div className={styles.boxContainer}>
                  {outreachScreenboxes.map((box) => (
                    <div
                      key={box.id}
                      className={`${styles.boxWrapper}`}
                      draggable
                      data-id={box.id}
                      onDragStart={(e) =>
                        handleDragStartOutreachScreen(e, box.id)
                      }
                      onDragOver={(e) =>
                        handleDragOverOutreachScreen(e, box.id)
                      }
                      onDrop={handleDropOutreachScreen}
                      onDragEnd={handleDragEndOutreachScreen}
                    >
                      <div className={styles.dotsContainer}>
                        <DragIcon />
                      </div>
                      <div className={styles.box}>
                        <input
                          type="text"
                          value={
                            editingOutreachScreenBoxId === box.id
                              ? outreachTempValue
                              : box.value
                          }
                          onChange={(e) =>
                            handleChangeOutreachScreenBoxes(
                              box.id,
                              e.target.value
                            )
                          }
                          className={styles.boxInput}
                          onClick={() =>
                            handleOutreachchScreenEdit(box.id, box.value)
                          }
                        />
                      </div>
                      {editingOutreachScreenBoxId === box.id && (
                        <div className={styles.iconContainer}>
                          <button
                            className={`${styles.iconButton} `}
                            onClick={() => handleOutreachScreenSave(box.id)}
                          >
                            <CheckIcon />
                          </button>
                          <button
                            className={`${styles.iconButton} `}
                            onClick={() => removeOutreachScreenBox(box.id)}
                          >
                            <CrossIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className={styles.plus_iconContainer}>
                    <button
                      className={`${styles.iconButton} ${styles.addButton}`}
                      onClick={addOutreachScreenBox}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.line_divider_outreachScreen}></div>
          <div className={styles.cardContainer}>
            {outreachScreenboxes.map((box) => (
              <div key={box.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  {box.value && box.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSettings;

function SettingIcon({ className }: any) {
  return (
    <svg
      className={className}
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="9" r="2" fill="#000" />
      <path
        d="M2.49936 3.89989L2.81186 3.35822C2.68917 3.28744 2.54607 3.26044 2.40602 3.28164C2.26597 3.30283 2.13728 3.37097 2.04103 3.47489L2.49936 3.89989ZM0.833527 6.78655L0.236027 6.60155C0.194229 6.73693 0.199667 6.88249 0.25145 7.01437C0.303232 7.14625 0.398287 7.25662 0.521027 7.32739L0.833527 6.78655ZM0.831861 11.2124L0.519361 10.6707C0.396594 10.7417 0.301593 10.8522 0.249955 10.9843C0.198318 11.1163 0.193112 11.262 0.235194 11.3974L0.831861 11.2124ZM2.49853 14.0991L2.04019 14.5241C2.13645 14.628 2.26514 14.6961 2.40519 14.7173C2.54524 14.7385 2.68833 14.7115 2.81103 14.6407L2.49853 14.0991ZM6.33186 16.3116H5.70686C5.70686 16.6032 5.90936 16.8557 6.19353 16.9207L6.33186 16.3116ZM9.66603 16.3132L9.80519 16.9232C9.94333 16.8917 10.0666 16.8141 10.1549 16.7033C10.2432 16.5925 10.2912 16.4549 10.291 16.3132H9.66603ZM13.5002 14.0999L13.1877 14.6416C13.3104 14.7123 13.4535 14.7393 13.5935 14.7181C13.7336 14.6969 13.8623 14.6288 13.9585 14.5249L13.5002 14.0999ZM15.1652 11.2116L15.7627 11.3966C15.8045 11.2612 15.7991 11.1156 15.7473 10.9837C15.6955 10.8519 15.6004 10.7415 15.4777 10.6707L15.1652 11.2116ZM15.1669 6.78572L15.4794 7.32739C15.6021 7.25646 15.6971 7.14589 15.7488 7.01384C15.8004 6.8818 15.8056 6.73612 15.7635 6.60072L15.1669 6.78572ZM13.5002 3.89822L13.9585 3.47406C13.8623 3.37014 13.7336 3.302 13.5935 3.2808C13.4535 3.25961 13.3104 3.28661 13.1877 3.35739L13.5002 3.89822ZM9.66686 1.68739H10.2919C10.2918 1.54584 10.2437 1.40849 10.1555 1.29783C10.0672 1.18717 9.94402 1.10974 9.80603 1.07822L9.66686 1.68739ZM6.33353 1.68572L6.19436 1.07572C6.05623 1.10727 5.93291 1.18482 5.84464 1.29566C5.75636 1.40649 5.70837 1.54403 5.70853 1.68572H6.33353ZM1.43103 6.97155C1.73433 5.98565 2.25585 5.08075 2.95686 4.32405L2.04019 3.47406C1.21181 4.3682 0.595452 5.43743 0.236861 6.60239L1.43103 6.97155ZM2.04603 12.4374C1.78877 11.9923 1.58194 11.52 1.42936 11.0291L0.236027 11.3982C0.415897 11.9783 0.659906 12.5364 0.963527 13.0624L2.04603 12.4374ZM2.95769 13.6757C2.60872 13.2981 2.30294 12.8828 2.04603 12.4374L0.963527 13.0624C1.26693 13.5884 1.62805 14.0781 2.04019 14.5241L2.95769 13.6757ZM9.52769 15.7049C8.52215 15.9337 7.47798 15.9332 6.47269 15.7032L6.19436 16.9216C7.38278 17.1936 8.61723 17.1945 9.80603 16.9241L9.52769 15.7049ZM14.5694 11.0282C14.2661 12.0141 13.7445 12.919 13.0435 13.6757L13.9602 14.5257C14.7886 13.6316 15.4049 12.5623 15.7635 11.3974L14.5694 11.0282ZM13.9544 5.56239C14.216 6.01961 14.4216 6.48905 14.571 6.97072L15.7644 6.60155C15.5845 6.02151 15.3405 5.46334 15.0369 4.93739L13.9544 5.56239ZM13.0419 4.32405C13.3835 4.69322 13.6902 5.10739 13.9535 5.56239L15.0369 4.93739C14.7332 4.41133 14.371 3.91997 13.9585 3.47406L13.0419 4.32405ZM6.47186 2.29489C7.4774 2.06603 8.52157 2.0666 9.52686 2.29656L9.80603 1.07822C8.6176 0.806153 7.38233 0.805298 6.19353 1.07572L6.47186 2.29489ZM6.95769 3.22656V1.68489H5.70769V3.22656H6.95769ZM4.14603 4.12822L2.81186 3.35822L2.18686 4.44072L3.52019 5.21072L4.14603 4.12822ZM1.85436 9.90239L0.520194 10.6724L1.14519 11.7549L2.47936 10.9849L1.85436 9.90239ZM2.47936 7.01489L1.14603 6.24572L0.521027 7.32905L1.85436 8.09822L2.47936 7.01489ZM6.95853 16.3124V14.7732H5.70853V16.3124H6.95853ZM3.52103 12.7891L2.18686 13.5591L2.81186 14.6424L4.14519 13.8716L3.52103 12.7891ZM13.8135 13.5591L12.4794 12.7891L11.8544 13.8716L13.1877 14.6416L13.8135 13.5591ZM10.2919 16.3141V14.7732H9.04186V16.3149L10.2919 16.3141ZM14.8552 6.24489L13.521 7.01489L14.146 8.09822L15.4794 7.32739L14.8552 6.24489ZM15.4785 10.6716L14.146 9.90156L13.521 10.9849L14.8544 11.7541L15.4785 10.6716ZM10.2919 3.22656V1.68739H9.04186V3.22656H10.2919ZM13.1885 3.35822L11.8544 4.12822L12.4794 5.21155L13.8135 4.44072L13.1885 3.35822ZM9.04186 3.22656C9.04186 4.99072 10.9519 6.09405 12.4794 5.21155L11.8544 4.12822C11.696 4.21963 11.5165 4.26776 11.3336 4.26778C11.1508 4.2678 10.9712 4.21971 10.8129 4.12833C10.6545 4.03696 10.523 3.90552 10.4316 3.74723C10.3401 3.58894 10.2919 3.40937 10.2919 3.22656H9.04186ZM13.521 7.01489C11.9935 7.89739 11.9935 10.1024 13.521 10.9849L14.146 9.90156C13.9877 9.81013 13.8562 9.67863 13.7648 9.52028C13.6734 9.36193 13.6252 9.18231 13.6252 8.99947C13.6252 8.81663 13.6734 8.63701 13.7648 8.47866C13.8562 8.32031 13.9877 8.18882 14.146 8.09739L13.521 7.01489ZM12.4794 12.7891C10.9519 11.9066 9.04186 13.0091 9.04186 14.7732H10.2919C10.2919 14.5904 10.3401 14.4108 10.4316 14.2525C10.523 14.0943 10.6545 13.9628 10.8129 13.8714C10.9712 13.7801 11.1508 13.732 11.3336 13.732C11.5165 13.732 11.696 13.7801 11.8544 13.8716L12.4794 12.7891ZM6.95853 14.7732C6.95853 13.0091 5.04853 11.9066 3.52103 12.7891L4.14519 13.8716C4.30351 13.7801 4.48394 13.732 4.66675 13.732C4.84956 13.732 5.02916 13.7801 5.1875 13.8714C5.34584 13.9628 5.47735 14.0943 5.5688 14.2525C5.66026 14.4108 5.70845 14.5904 5.70853 14.7732H6.95853ZM2.47936 10.9849C4.00686 10.1024 4.00686 7.89739 2.47936 7.01489L1.85436 8.09822C2.0127 8.18965 2.14419 8.32115 2.2356 8.47949C2.32702 8.63784 2.37515 8.81746 2.37515 9.00031C2.37515 9.18315 2.32702 9.36277 2.2356 9.52112C2.14419 9.67946 2.0127 9.81096 1.85436 9.90239L2.47936 10.9849ZM5.70853 3.22656C5.70845 3.40937 5.66026 3.58894 5.5688 3.74723C5.47735 3.90552 5.34584 4.03696 5.1875 4.12833C5.02916 4.21971 4.84956 4.2678 4.66675 4.26778C4.48394 4.26776 4.30435 4.21963 4.14603 4.12822L3.52103 5.21155C5.04853 6.09322 6.95853 4.99072 6.95853 3.22656H5.70853Z"
        fill="#000"
      />
    </svg>
  );
}

function CheckIcon({ className }: any) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" fill="white" fill-opacity="0.01" />
      <path
        d="M4.49 8.21462C4.36964 8.08661 4.20361 8.01129 4.02801 8.00505C3.85241 7.9988 3.68145 8.06213 3.55229 8.18127C3.42314 8.30041 3.34624 8.46571 3.33832 8.64124C3.33041 8.81677 3.3921 8.98833 3.51 9.11862L5.918 11.7313C6.276 12.082 6.80934 12.082 7.14067 11.7513L7.38334 11.512C8.25969 10.6501 9.13502 9.78721 10.0093 8.92328L10.036 8.89662C10.8531 8.09133 11.666 7.28176 12.4747 6.46795C12.5955 6.34142 12.6618 6.17244 12.6592 5.99748C12.6565 5.82252 12.5852 5.65561 12.4606 5.53276C12.336 5.40991 12.1681 5.34097 11.9931 5.34082C11.8182 5.34067 11.6501 5.40932 11.5253 5.53195C10.7204 6.34151 9.91154 7.14707 9.09867 7.94862L9.072 7.97528C8.23418 8.80348 7.39529 9.63059 6.55534 10.4566L4.49 8.21462Z"
        fill="#42526E"
      />
    </svg>
  );
}

function CrossIcon({ className }: any) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" fill="white" fill-opacity="0.01" />
      <path
        d="M8.00003 7.05739L4.47136 3.52872C4.34563 3.40728 4.17722 3.34009 4.00243 3.3416C3.82763 3.34312 3.66042 3.41324 3.53682 3.53684C3.41321 3.66045 3.3431 3.82766 3.34158 4.00245C3.34006 4.17725 3.40726 4.34565 3.52869 4.47139L7.05736 8.00005L3.52869 11.5287C3.40726 11.6545 3.34006 11.8229 3.34158 11.9977C3.3431 12.1725 3.41321 12.3397 3.53682 12.4633C3.66042 12.5869 3.82763 12.657 4.00243 12.6585C4.17722 12.66 4.34563 12.5928 4.47136 12.4714L8.00003 8.94272L11.5287 12.4714C11.6544 12.5928 11.8228 12.66 11.9976 12.6585C12.1724 12.657 12.3396 12.5869 12.4632 12.4633C12.5868 12.3397 12.657 12.1725 12.6585 11.9977C12.66 11.8229 12.5928 11.6545 12.4714 11.5287L8.94269 8.00005L12.4714 4.47139C12.535 4.40989 12.5858 4.33633 12.6208 4.25499C12.6557 4.17365 12.6741 4.08617 12.6749 3.99766C12.6756 3.90914 12.6588 3.82135 12.6252 3.73942C12.5917 3.65749 12.5422 3.58305 12.4796 3.52046C12.417 3.45786 12.3426 3.40836 12.2607 3.37484C12.1787 3.34132 12.0909 3.32445 12.0024 3.32522C11.9139 3.32599 11.8264 3.34438 11.7451 3.37932C11.6638 3.41426 11.5902 3.46505 11.5287 3.52872L8.00003 7.05739Z"
        fill="#42526E"
      />
    </svg>
  );
}

function PlusIcon({ className }: any) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_7337_6508)">
        <rect
          width="12"
          height="12"
          transform="translate(0.513672 9) rotate(-45)"
          fill="white"
          fill-opacity="0.01"
        />
        <path
          d="M8.49914 8.5001L4.75642 8.5001C4.62534 8.50238 4.5004 8.55605 4.4085 8.64955C4.3166 8.74306 4.26511 8.86892 4.26511 9.00002C4.26511 9.13113 4.31661 9.25698 4.4085 9.35049C4.5004 9.444 4.62534 9.49767 4.75642 9.49995H8.49914L8.49914 13.2427C8.50142 13.3737 8.55509 13.4987 8.6486 13.5906C8.7421 13.6825 8.86796 13.734 8.99906 13.734C9.13017 13.734 9.25603 13.6825 9.34953 13.5906C9.44304 13.4987 9.49671 13.3737 9.49899 13.2427L9.49899 9.49995L13.2417 9.49995C13.3728 9.49767 13.4977 9.444 13.5896 9.35049C13.6815 9.25698 13.733 9.13113 13.733 9.00002C13.733 8.86892 13.6815 8.74306 13.5896 8.64955C13.4977 8.55605 13.3728 8.50238 13.2417 8.5001L9.49899 8.5001L9.49899 4.75738C9.50014 4.691 9.48806 4.62505 9.46346 4.56339C9.43885 4.50172 9.40221 4.44558 9.35568 4.39822C9.30914 4.35087 9.25364 4.31326 9.19241 4.28759C9.13118 4.26191 9.06546 4.24869 8.99906 4.24869C8.93267 4.24869 8.86694 4.26192 8.80572 4.28759C8.74449 4.31326 8.68899 4.35087 8.64245 4.39822C8.59592 4.44558 8.55927 4.50172 8.53467 4.56339C8.51006 4.62505 8.49799 4.691 8.49914 4.75738L8.49914 8.5001Z"
          fill="#42526E"
        />
      </g>
      <defs>
        <clipPath id="clip0_7337_6508">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(0.513672 9) rotate(-45)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function DragIcon({ className }: any) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.5625 1.53125C0.5625 1.39582 0.589174 1.26172 0.640999 1.13661C0.692824 1.01149 0.768786 0.897806 0.864546 0.802046C0.960306 0.706286 1.07399 0.630324 1.19911 0.578499C1.32422 0.526674 1.45832 0.5 1.59375 0.5C1.72918 0.5 1.86328 0.526674 1.98839 0.578499C2.11351 0.630324 2.22719 0.706286 2.32295 0.802046C2.41871 0.897806 2.49468 1.01149 2.5465 1.13661C2.59833 1.26172 2.625 1.39582 2.625 1.53125C2.625 1.80475 2.51635 2.06706 2.32295 2.26045C2.12956 2.45385 1.86725 2.5625 1.59375 2.5625C1.32025 2.5625 1.05794 2.45385 0.864546 2.26045C0.671149 2.06706 0.5625 1.80475 0.5625 1.53125ZM5.375 1.53125C5.375 1.25775 5.48365 0.995443 5.67705 0.802046C5.87044 0.608649 6.13275 0.5 6.40625 0.5C6.67975 0.5 6.94206 0.608649 7.13545 0.802046C7.32885 0.995443 7.4375 1.25775 7.4375 1.53125C7.4375 1.80475 7.32885 2.06706 7.13545 2.26045C6.94206 2.45385 6.67975 2.5625 6.40625 2.5625C6.13275 2.5625 5.87044 2.45385 5.67705 2.26045C5.48365 2.06706 5.375 1.80475 5.375 1.53125ZM0.5625 5.99312C0.5625 5.8577 0.589174 5.7236 0.640999 5.59848C0.692824 5.47337 0.768786 5.35968 0.864546 5.26392C0.960306 5.16816 1.07399 5.0922 1.19911 5.04037C1.32422 4.98855 1.45832 4.96187 1.59375 4.96187C1.72918 4.96187 1.86328 4.98855 1.98839 5.04037C2.11351 5.0922 2.22719 5.16816 2.32295 5.26392C2.41871 5.35968 2.49468 5.47337 2.5465 5.59848C2.59833 5.7236 2.625 5.8577 2.625 5.99312C2.625 6.26663 2.51635 6.52893 2.32295 6.72233C2.12956 6.91573 1.86725 7.02437 1.59375 7.02437C1.32025 7.02437 1.05794 6.91573 0.864546 6.72233C0.671149 6.52893 0.5625 6.26663 0.5625 5.99312ZM5.375 5.99312C5.375 5.71962 5.48365 5.45732 5.67705 5.26392C5.87044 5.07052 6.13275 4.96187 6.40625 4.96187C6.67975 4.96187 6.94206 5.07052 7.13545 5.26392C7.32885 5.45732 7.4375 5.71962 7.4375 5.99312C7.4375 6.26663 7.32885 6.52893 7.13545 6.72233C6.94206 6.91573 6.67975 7.02437 6.40625 7.02437C6.13275 7.02437 5.87044 6.91573 5.67705 6.72233C5.48365 6.52893 5.375 6.26663 5.375 5.99312ZM0.5625 10.4688C0.5625 10.3333 0.589174 10.1992 0.640999 10.0741C0.692824 9.94899 0.768786 9.83531 0.864546 9.73955C0.960306 9.64379 1.07399 9.56783 1.19911 9.516C1.32422 9.46417 1.45832 9.4375 1.59375 9.4375C1.72918 9.4375 1.86328 9.46417 1.98839 9.516C2.11351 9.56783 2.22719 9.64379 2.32295 9.73955C2.41871 9.83531 2.49468 9.94899 2.5465 10.0741C2.59833 10.1992 2.625 10.3333 2.625 10.4688C2.625 10.7423 2.51635 11.0046 2.32295 11.198C2.12956 11.3913 1.86725 11.5 1.59375 11.5C1.32025 11.5 1.05794 11.3913 0.864546 11.198C0.671149 11.0046 0.5625 10.7423 0.5625 10.4688ZM5.375 10.4688C5.375 10.1952 5.48365 9.93294 5.67705 9.73955C5.87044 9.54615 6.13275 9.4375 6.40625 9.4375C6.67975 9.4375 6.94206 9.54615 7.13545 9.73955C7.32885 9.93294 7.4375 10.1952 7.4375 10.4688C7.4375 10.7423 7.32885 11.0046 7.13545 11.198C6.94206 11.3913 6.67975 11.5 6.40625 11.5C6.13275 11.5 5.87044 11.3913 5.67705 11.198C5.48365 11.0046 5.375 10.7423 5.375 10.4688Z"
        fill="#7D7D7D"
      />
    </svg>
  );
}
