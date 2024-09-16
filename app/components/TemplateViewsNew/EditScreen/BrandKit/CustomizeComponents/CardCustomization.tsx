import React, { useState } from "react";
import styles from "./cardcustom.style.module.css";
import ColorPicker from "./ColorPicker";
import { useTheme } from "@/context";

interface Props {
  extractedColors: string[];
  setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
  setCardBorderRadius: React.Dispatch<React.SetStateAction<number>>;
  cardBgColor: string;
  cardBorderRadius: number;
}

const CardCustomization = ({
  extractedColors,
  setCardBgColor,
  setCardBorderRadius,
  cardBgColor,
  cardBorderRadius,
}: Props) => {
  const [accordian, setAccordian] = useState<boolean>(false);

  const handleRadiusChange = (e: any) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, 0), 20); // Clamp between 0 and 20
      setCardBorderRadius(clampedValue);
    }
  };
  const handleCardBgColorChange = (color: any) => {
    setCardBgColor(color.hex);
  };

  const handleCardBgHexInputChange = (hexColor: string) => {
    setCardBgColor(hexColor);
  };
  const { theme } = useTheme();

  const handleArrowUpClick = () => {
    setCardBorderRadius((prevRadius) => Math.min(prevRadius + 1, 20)); // Increment and clamp to 20
  };

  const handleArrowDownClick = () => {
    setCardBorderRadius((prevRadius) => Math.max(prevRadius - 1, 0)); // Decrement and clamp to 0
  };
  return (
    <div className={styles.body}>
      <div className={styles.header} onClick={() => setAccordian(!accordian)}>
        <div className={styles.headingContainer}>
          <div className={styles.heading}>Card Customisations</div>
          <div className={styles.subheading}>
            Select or customise your cards
          </div>
        </div>
        {accordian ? (
          <div className={styles.btn} onClick={() => setAccordian(false)}>
            <UpArrow
              height="6"
              width="10"
              color={theme === "light" ? "black" : "white"}
            />
          </div>
        ) : (
          <div className={styles.btn} onClick={() => setAccordian(true)}>
            <DownArrow
              height="6"
              width="10"
              color={theme === "light" ? "black" : "white"}
            />
          </div>
        )}
      </div>
      {accordian && (
        <div className={styles.editContainer}>
          <div className={styles.backgroundContainer}>
            <ColorPicker
              heading="Background"
              color={cardBgColor}
              extractedColors={extractedColors}
              handleChange={handleCardBgColorChange}
              handleHexInputChange={handleCardBgHexInputChange}
            />
          </div>
          <div className={styles.radiusContainer}>
            <div className={styles.heading}>Border Radius</div>
            <RadiusIcon color={theme === "light" ? "black" : "white"} />
            <div
              className={styles.inputContainer}
              style={{
                backgroundColor: theme === "light" ? "#F2F2F2" : "#1A1A1A",
              }}
            >
              <input
                className={styles.radiusValue}
                value={cardBorderRadius}
                onChange={(e) => handleRadiusChange(e)}
                maxLength={2}
                style={{ color: theme === "light" ? "black" : "white" }}
              />
              <span>px</span>
            </div>
            <div className={styles.arrows}>
              <div onClick={handleArrowUpClick}>
                <UpArrow
                  height="4"
                  width="8"
                  color={theme === "light" ? "black" : "white"}
                />
              </div>
              <div onClick={handleArrowDownClick}>
                <DownArrow
                  height="4"
                  width="8"
                  color={theme === "light" ? "black" : "white"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface IconProps {
  color: string;
  height?: string;
  width?: string;
}

function RadiusIcon({ color }: IconProps) {
  return (
    <svg
      width="15"
      height="8"
      viewBox="0 0 15 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 7C13.75 3.54813 10.9519 0.75 7.5 0.75C4.04813 0.75 1.25 3.54813 1.25 7"
        stroke={color}
        stroke-width="0.9375"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function UpArrow({ color, height, width }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.52876 0.529741C4.65378 0.40476 4.82332 0.334549 5.0001 0.334549C5.17687 0.334549 5.34641 0.40476 5.47143 0.529741L9.24276 4.30107C9.30644 4.36257 9.35723 4.43613 9.39216 4.51747C9.4271 4.59881 9.44549 4.68629 9.44626 4.77481C9.44703 4.86333 9.43017 4.95111 9.39664 5.03304C9.36312 5.11497 9.31362 5.18941 9.25103 5.252C9.18843 5.3146 9.114 5.3641 9.03207 5.39762C8.95014 5.43114 8.86235 5.44801 8.77383 5.44724C8.68531 5.44647 8.59783 5.42808 8.51649 5.39314C8.43516 5.3582 8.36159 5.30741 8.3001 5.24374L5.0001 1.94374L1.7001 5.24374C1.57436 5.36518 1.40596 5.43238 1.23116 5.43086C1.05637 5.42934 0.889156 5.35922 0.765551 5.23562C0.641946 5.11201 0.571833 4.94481 0.570313 4.77001C0.568794 4.59521 0.635991 4.42681 0.757429 4.30107L4.52876 0.529741Z"
        fill={color}
      />
    </svg>
  );
}
function DownArrow({ color, height, width }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z"
        fill={color}
      />
    </svg>
  );
}

export default CardCustomization;
