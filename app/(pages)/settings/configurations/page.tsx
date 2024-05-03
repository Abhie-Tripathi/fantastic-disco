// "use client";
// import React, { useState } from "react";
// import styles from "./config.module.css";
// import Image from "next/image";
// import WidgetIcon from "/public/widgetIcon.svg";
// import KanbanIcon from "/public/kanbanIcon.svg";
// import FeatureIcon from "/public/featuresIcon.svg";
// import WidgetCard from "./wigitCard";

// const page = () => {
//   const [activeTab, setActiveTab] = useState("Widgets");

//   return (
//     <div className={styles.container}>
//       <div className={styles.navContainerLeft}>
//         <div
//           className={`${styles.comapny_container} ${styles.tabContainer} ${
//             activeTab == "Widgets" ? styles.active : ""
//           }`}
//           onClick={() => setActiveTab("Widgets")}
//         >
//           <div>
//             <Image src={WidgetIcon} alt="department icon" />
//           </div>
//           <div className={styles.text}>Widgets</div>
//         </div>
//         <div
//           className={`${styles.comapny_container} ${styles.tabContainer} ${
//             activeTab == "Kanban" ? styles.active : ""
//           }`}
//           onClick={() => setActiveTab("Kanban")}
//         >
//           <Image src={KanbanIcon} alt="team icon" />
//           <div className={styles.text}>Kanban</div>
//         </div>

//         <div
//           className={`${styles.comapny_container} ${styles.tabContainer} ${
//             activeTab == "Features" ? styles.active : ""
//           }`}
//           onClick={() => setActiveTab("Features")}
//         >
//           <Image src={FeatureIcon} alt="team icon" />
//           <div className={styles.text}>Features</div>
//         </div>
//       </div>

//       {activeTab === "Widgets" ? (
//         <div className={styles.navContainerRight}>
//           <div className={styles.gradient_border}>Widget</div>

//           <WidgetCard />
//         </div>
//       ) : (
//         ""
//       )}

//       {activeTab === "Kanban" ? (
//         <div className={styles.navContainerRight}>
//           <div className={styles.gradient_border}>Kanban</div>
//         </div>
//       ) : (
//         ""
//       )}
//       {activeTab === "Features" ? (
//         <div className={styles.navContainerRight}>
//           <div className={styles.gradient_border}>Fitures</div>
//         </div>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// };

// export default page;

"use client";
import React, { useState } from "react";
import styles from "./config.module.css";
import Image from "next/image";
import WidgetConfiguration from "@/app/components/settings/configurations/widgetConfigurations";
import OutreachConfigurations from "@/app/components/settings/configurations/outreachConfigurations";
import WidgetIcon from "/public/widgetIcon.svg";
import FeatureIcon from "/public/featuresIcon.svg";
import OutreachIcon from "/public/kanbanIcon.svg";
const page = () => {
  const [activeTab, setActiveTab] = useState("Widgets Configurations");
  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Widgets Configurations" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Widgets Configurations")}
        >
          <div>
            <Image src={WidgetIcon} alt="billing icon" />
          </div>
          <div className={styles.text}>Widgets Configurations</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Outreach Configurations" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Outreach Configurations")}
        >
          <Image src={OutreachIcon} alt="team icon" />
          <div className={styles.text}>Outreach Configurations</div>
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

      {activeTab === "Widgets Configurations" ? <WidgetConfiguration /> : ""}

      {activeTab === "Outreach Configurations" ? (
        <OutreachConfigurations />
      ) : (
        ""
      )}
    </div>
  );
};

export default page;
