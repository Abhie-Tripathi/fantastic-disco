import React, { useState } from "react";
import styles from "./billingAndPlans.module.css";
import BasicIcon from "/public/basicIcon.svg";
import IncreasingIcon from "/public/increasingIcon.svg";
import MasterCardIcon from "/public/masterCardIcon.svg";
import SearchIcon from "/public/searchIcon.svg";
import TrackerIcon from "/public/trackerIcon.svg";
import UserIcon from "/public/usersIcon.svg";
import Image from "next/image";
import BellIcon from "/public/bellIcon.svg";
import DummyImage from "/public/dummyImg.svg";
import ColoredGroupIcon from "/public/coloredGroupIcon.svg";
import ColoredSearchIcon from "/public/coloredSearchIcon.svg";
import ColoredTrackerIcon from "/public/coloredTrackerIcon.svg";
import RightArrow from "/public/rightArrowNew.svg";
import ExpandIcon from "/public/expandIcon.svg";
import DownArrow from "/public/Arrow_Down 2.svg";
import DownloadIcon from "/public/downloadIcon.svg";
const index = () => {
  const cardData = [
    "3 Trackers to track your events",
    "5 Limited user access with in the teams",
    "total of 50 searches / month",
    "500MB of packages storage",
  ];

  const tableData = [
    {
      invoice: "906934",
      billingDate: "13 Apr 2024",
      plan: "Basic",
      amount: "$530.00",
      status: "Paid",
    },
    {
      invoice: "906934",
      billingDate: "13 Apr 2024",
      plan: "Basic",
      amount: "$530.00",
      status: "Paid",
    },
    {
      invoice: "906934",
      billingDate: "13 Apr 2024",
      plan: "Basic",
      amount: "$530.00",
      status: "Paid",
    },
    {
      invoice: "906934",
      billingDate: "13 Apr 2024",
      plan: "Basic",
      amount: "$530.00",
      status: "Paid",
    },
    {
      invoice: "906934",
      billingDate: "13 Apr 2024",
      plan: "Basic",
      amount: "$530.00",
      status: "Paid",
    },
  ];

  const [activeState, setActiveState] = useState("Active");
  return (
    <div className={styles.container}>
      <div className={styles.gradient_border}>
        Billing Details
        <div>
          <Image src={DownloadIcon} alt="download icon" />
          <span className={styles.downloadText}> Download Invoice</span>
        </div>
      </div>

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

      <div className={styles.secondContainer}>
        <div className={styles.currentPlan_container}>
          <div> Current Plan Usage</div>
          <div className={styles.usagePolicy}> Usage Policy</div>
        </div>
        <div className={styles.tracker_container}>
          <div className={styles.trackerCard}>
            <div className={styles.outerTracker}>
              <div className={styles.tracker}>
                <div>3/3</div>
                <div>Tracker</div>
              </div>
            </div>

            <div className={styles.trackerCard_content}>
              <div className={styles.tracker_text}>Trackers</div>
              <div>
                All trackers deployed is currently in use and operational
              </div>
            </div>
          </div>
          <div className={styles.trackerCard}>
            <div className={styles.outerTracker}>
              <div className={styles.tracker}>
                <div>3/3</div>
                <div>Users</div>
              </div>
            </div>

            <div className={styles.trackerCard_content}>
              <div className={styles.tracker_text}>Users</div>
              <div>Currently three active users out of 5 seats available</div>
            </div>
          </div>
          <div className={styles.trackerCard}>
            <div className={styles.outerTracker}>
              <div className={styles.tracker}>
                <div>3/50</div>
                <div>Search</div>
              </div>
            </div>

            <div className={styles.trackerCard_content}>
              <div className={styles.tracker_text}>Search</div>
              <div>3 out of 50 search queries have been utilized</div>
            </div>
          </div>
        </div>
        <div className={styles.bottomLine}></div>
        <div className={styles.unlock_container}>
          <div className={styles.bellIcon_container}>
            <Image src={BellIcon} alt="bell icon" />
            <span>
              Unlock unlimited features and make the most of our platform by
              upgrading to our Advanced or Premium plans
            </span>
          </div>
          <div className={styles.upgradeIcn}>
            <span>Upgrade Plan</span>
            <span className={styles.icon_background}>
              <Image src={IncreasingIcon} alt="increasing icon" />
            </span>
          </div>
        </div>
      </div>

      <div className={styles.thirdDiv}>
        <div className={styles.accountManagemantCard}>
          <div className={styles.billing_container}>
            <div>Billing Account Management</div>
            <div className={styles.changeText}>Change</div>
          </div>
          <div className={styles.innerCard}>
            <div className={styles.inner_card_content}>
              <div className={styles.imageDiv}>
                <Image src={DummyImage} alt="dummy image" />
                <div className={styles.profile}>
                  <div className={styles.username_container}>
                    <span>Rob Slate</span>
                    <span className={styles.username}>@Ronbstess</span>
                  </div>
                  <div>robslate@acmen.com</div>
                </div>
              </div>
              <div className={styles.superAdminCard}> Super Admin</div>
            </div>
          </div>
          <div className={styles.cardInformation_container}>
            <div className={styles.cardInformation_text}>Card Information</div>
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
          </div>
        </div>

        <div className={styles.accountManagemantCard}>
          <div className={styles.billing_container}>
            <div>Previous Billing and Usage Details</div>
            <div className={styles.changeText}>Repeat Plan</div>
          </div>
          <div className={styles.innerCard}>
            <div className={styles.billingUsage_container}>
              <div className={styles.basic_container}>
                <div className={styles.basic_container_content}>
                  <Image src={BasicIcon} alt="basic icon" />
                  <div>Basic</div>
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
          </div>

          <div className={styles.cardInformation_container}>
            <div className={styles.cardInformation_text}>
              Payment Method and Usage
            </div>
            <div className={styles.right_container}>
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
              <div className={styles.rightSideContnet}>
                <div className={styles.tracker_icons}>
                  <div className={styles.tracker_sec}>
                    <Image src={ColoredTrackerIcon} alt="tracker icon" />
                    <div className={styles.tracker_text}>Trackers</div>
                  </div>
                  <div className={styles.border_bottom}></div>
                  <div className={styles.tracker_number}>3/3</div>
                </div>

                <div className={styles.tracker_icons}>
                  <div className={styles.tracker_sec}>
                    <Image src={ColoredGroupIcon} alt="group icon" />
                    <div className={styles.tracker_text}>Users</div>
                  </div>
                  <div className={styles.border_bottom}></div>
                  <div className={styles.tracker_number}>4/5</div>
                </div>

                <div className={styles.tracker_icons}>
                  <div className={styles.tracker_sec}>
                    <Image src={ColoredSearchIcon} alt="search icon" />
                    <div className={styles.tracker_text}>Search</div>
                  </div>
                  <div className={styles.border_bottom}></div>
                  <div className={styles.tracker_number}>30/39</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.fourthDiv}>
        <div className={styles.gradient_border}>Pricing Plans</div>
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
                {cardData.map((item) => (
                  <div className={styles.card_texts}>
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
                {cardData.map((item) => (
                  <div className={styles.card_texts}>
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
                {cardData.map((item) => (
                  <div className={styles.card_texts}>
                    <Image src={RightArrow} alt="right arrow" />
                    <span className={styles.lowerCardText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.fifth_div}>
        <div className={styles.gradient_border}>Invoices and Payments</div>
        <div className={styles.invoices_container}>
          <div>Invoice</div>
          <div className={styles.invoiceBtn}> Download All</div>
        </div>
        <div>Effortlessly handle your billing and invoices right here</div>

        <div className={styles.table_cont}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.table_head}>
                <tr className={styles.table_head_row}>
                  <th className={styles.tableHeaderProfile}>
                    <input className={styles.down_icon} type="checkbox" />
                    <span className={styles.down_icon}>Invoice ID</span>
                    <Image src={DownArrow} alt="down icon" />
                  </th>
                  <th className={styles.tableHeaderDate}>
                    <span className={styles.down_icon}>Billing Date</span>
                    <Image src={DownArrow} alt="down icon" />
                  </th>
                  <th className={styles.tableHeaderEmail}>
                    <span className={styles.down_icon}>Plan</span>
                    <Image src={DownArrow} alt="down icon" />
                  </th>
                  <th className={styles.tableHeaderPhoneNumber}>
                    <span className={styles.down_icon}>Amount</span>
                    <Image src={DownArrow} alt="down icon" />
                  </th>
                  <th className={styles.tableHeaderPhoneMessage}>
                    <span className={styles.down_icon}>Status</span>
                    <Image src={DownArrow} alt="down icon" />
                  </th>
                </tr>
              </thead>

              <tbody className={styles.table_body}>
                {tableData?.map((data: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className={styles.profileContainer}>
                          <div className={styles.userNameContainer}>
                            <div className={styles.name}>{data.invoice}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.event_date}>
                          {data.billingDate}
                        </div>
                      </td>
                      <td>
                        <div className={styles.event_date}>{data.plan}</div>
                      </td>
                      <td>
                        <div className={styles.event_date}>{data.amount}</div>
                      </td>
                      <td>
                        <div className={styles.event_date}>{data.status}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.tableBelow}>
              <div className={styles.paginationContainer}>
                <div className={styles.prevTextContainer}>
                  <div className={styles.prevText}> Previous</div>
                  <div className={styles.showingContainer}>
                    <div>Showing</div>
                    <Image src={ExpandIcon} alt="expand icon" />
                    <div className={styles.page_count}>10</div>
                    <div className={styles.result}>result / Pages</div>
                  </div>
                </div>
                <div className={styles.pages}>
                  <div>page</div>
                  <div className={styles.pageNumber}>1</div>
                  <div> of 10</div>
                </div>
                <div>
                  <div className={styles.nextText}>Next</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
