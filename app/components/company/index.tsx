import React, { useState } from "react";
import styles from "./company.module.css";
import Image from "next/image";
import DepartmentIcon from "/public/departmentIcon.svg";
import TeamIcon from "/public/teamIcon.svg";
import Link from "next/link";

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
  const [activeTab, setActiveTab] = useState("Department");

  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Department" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Department")}
        >
          <div>
            <Image src={DepartmentIcon} alt="department icon" />
          </div>
          <div className={styles.text}>Department</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Team" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Team")}
        >
          <Image src={TeamIcon} alt="team icon" />
          <div className={styles.text}>Team</div>
        </div>
      </div>

      <div className={styles.navContainerRight}>
        <div className={styles.gradient_border}>Department</div>
      </div>
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
