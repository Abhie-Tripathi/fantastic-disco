import React, { useState } from "react";
import styles from "./config.module.css";
import Image from "next/image";
import WidgetIcon from "/public/widgetIcon.svg";
import KanbanIcon from "/public/kanbanIcon.svg";
import FeatureIcon from "/public/featuresIcon.svg";
import Link from "next/link";
import WidgetCard from '../../../(pages)/settings/configurations/wigitCard'

// interface TabIconsArrayItem {
//   name: string;
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
//   path: string;
// }
const index = () => {
  //   const sidebarData: TabIconsArrayItem[] = [
  //     {
  //       name: "Department",
  //       icon: DepartmentIcon,
  //       path: "/setting/department",
  //     },
  //     {
  //       name: "Team",
  //       icon: TeamIcon,
  //       path: "/setting/team",
  //     },
  //   ];
  const [activeTab, setActiveTab] = useState("Widgets");

  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Widgets" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Widgets")}
        >
          <div>
            <Image src={WidgetIcon} alt="department icon" />
          </div>
          <div className={styles.text}>Widgets</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Kanban" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Kanban")}
        >
          <Image src={KanbanIcon} alt="team icon" />
          <div className={styles.text}>Kanban</div>
        </div>

        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Features" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Features")}
        >
          <Image src={FeatureIcon} alt="team icon" />
          <div className={styles.text}>Features</div>
        </div>
      </div>

      {activeTab === "Widgets" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Widget</div>

          <WidgetCard/>
        </div>
      ) : (
        ""
      )}

      {activeTab === "Kanban" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Kanban</div>
        </div>
      ) : (
        ""
      )}
      {activeTab === "Features" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Fitures</div>
        </div>
      ) : (
        ""
      )}

      {/* <div className={styles.navContainerRight}>
        <div className={styles.gradient_border}>Widget</div>
      </div> */}
    </div>

    // <>
    //   {sidebarData.map((item: any) => {
    //     const TabIcon = item.icon;

    //     return (
    //       <>
    //         <nav
    //           className={`${styles.sideNav} ${
    //             activeTab == item.name ? styles.active : ""
    //           }`}
    //         >
    //           <Link
    //             href={item.path}
    //             className={`${styles.sidebarLink} ${
    //               activeTab === item.name ? styles.active : ""
    //             }`}
    //             onClick={() => {
    //               setActiveTab(item.name);
    //             }}
    //           >
    //             <TabIcon
    //               className={`${styles.tab_icon} ${
    //                 activeTab === item.name ? styles.active : ""
    //               }`}
    //               onClick={() => setActiveTab(item.name)}
    //             />
    //             <span className={styles.sidebarLabel}>{item.name}</span>
    //           </Link>
    //         </nav>
    //       </>
    //     );
    //   })}
    // </>
  );
};

export default index;
