import React, { useState } from "react";
import styles from "./currentPlan.module.css";
import BasicIcon from "/public/basicIcon.svg";
import IncreasingIcon from "/public/increasingIcon.svg";
import MasterCardIcon from "/public/masterCardIcon.svg";
import SearchIcon from "/public/searchIcon.svg";
import TrackerIcon from "/public/trackerIcon.svg";
import UserIcon from "/public/usersIcon.svg";
import Image from "next/image";
import BellIcon from "/public/bellIcon.svg";
import RightArrow from "/public/rightArrowNew.svg";
const Index = () => {
  const cardData = [
    "3 Trackers to track your events",
    "5 Limited user access with in the teams",
    "total of 50 searches / month",
    "500MB of packages storage",
  ];

  const [activeState, setActiveState] = useState("Active");
  return (
    <div className={styles.container}>
      <div className={styles.gradient_border}>Current Plan Details</div>

      <div className={styles.firstContainer}>
        <div className={styles.billingUsage_container}>
          <div className={styles.basic_container}>
            <div className={styles.basic_container_content}>
              <Image src={BasicIcon} alt="basic icon" />
              <div>Basic</div>
            </div>
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
          <div className={styles.userSection}>
            <div className={styles.includeText}>Includes upto:</div>
            <div className={styles.userContent}>
              <Image src={UserIcon} alt="user icon" />
              <span className={styles.number}>5</span>
              <span className={styles.userText}>Users</span>
            </div>
            <div className={styles.second_divider}></div>
            <div className={styles.userContent}>
              <Image src={TrackerIcon} alt="user icon" />
              <span className={styles.number}>3</span>
              <span className={styles.userText}>Trackers</span>
            </div>
            <div className={styles.second_divider}></div>

            <div className={styles.userContent}>
              <Image src={SearchIcon} alt="user icon" />
              <span className={styles.number}>50</span>
              <span className={styles.userText}>Searches</span>
            </div>
          </div>
        </div>
        <span className={styles.divider}></span>
        <div className={styles.masterCard_sec}>
          <div>
            <Image src={MasterCardIcon} alt="master card icon" />
          </div>
          <div className={styles.masterCard}>
            <div>MasterCard</div>
            <div>**** **** **** 2200</div>
            <div>Expiry on 20/2025</div>
          </div>
        </div>
        <span className={styles.divider}></span>
        <div className={styles.planContainer}>
          <div className={styles.planContainerItems}>
            <div className={styles.dollar}>$689.00</div>
            <div className={styles.dollarText}>Next renewal 17 May 2024</div>
          </div>
          <div className={styles.upgradeIcn}>
            <span>Upgrade Plan</span>
            <span className={styles.icon_background}>
              <Image src={IncreasingIcon} alt="increasing icon" />
            </span>
          </div>
        </div>
      </div>

      <div className={styles.unlock_container}>
        <div className={styles.bellIcon_container}>
          <Image src={BellIcon} alt="bell icon" />
          <span>
            Unlock unlimited features and make the most of our platform by
            upgrading to our Advanced or Premium plans
          </span>
        </div>
      </div>
      <div className={styles.fourthDiv}>
        <div className={styles.gradient_border}>Our Pricing Plans</div>
        <div className={styles.pricingCard_container}>
          <div className={styles.card_container}>
            <div>
              <div className={styles.cardUpper_sec}>
                <div className={styles.upper_sec_content}>
                  <div className={styles.basicText}>Basic</div>
                  <div className={styles.desc}>
                    The basics for individuals and small organizations
                  </div>
                  <div className={styles.price}>$650</div>
                  <div className={styles.monthy_price}>per month</div>
                  <div>forever</div>
                </div>

                <div className={styles.planButton_container}>Repeat plan</div>
              </div>
              <div className={styles.cardLower_sec}>
                {cardData.map((item, key) => (
                  <div className={styles.card_texts} key={key}>
                    <Image src={RightArrow} alt="right arrow" />
                    <span className={styles.lowerCardText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.cardUpper_sec}>
                <div className={styles.upper_sec_content}>
                  <div className={styles.basicText}>Advanced</div>
                  <div className={styles.desc}>
                    Advanced collaboration for individuals and organization
                  </div>
                  <div className={styles.price}>$850</div>
                  <div className={styles.monthy_price}>per month</div>
                  <div>forever</div>
                </div>

                <div className={styles.planButton_container}>Repeat plan</div>
              </div>
              <div className={styles.cardLower_sec}>
                {cardData.map((item, key) => (
                  <div className={styles.card_texts} key={key}>
                    <Image src={RightArrow} alt="right arrow" />
                    <span className={styles.lowerCardText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.cardUpper_sec}>
                <div className={styles.upper_sec_content}>
                  <div className={styles.basicText}>Premium</div>
                  <div className={styles.desc}>
                    Unlimited access to all the features on the platform
                  </div>
                  <div className={styles.price}>$650</div>
                  <div className={styles.monthy_price}>per month</div>
                  <div>forever</div>
                </div>

                <div className={styles.planButton_container}>Repeat plan</div>
              </div>
              <div className={styles.cardLower_sec}>
                {cardData.map((item, key) => (
                  <div className={styles.card_texts} key={key}>
                    <Image src={RightArrow} alt="right arrow" />
                    <span className={styles.lowerCardText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
