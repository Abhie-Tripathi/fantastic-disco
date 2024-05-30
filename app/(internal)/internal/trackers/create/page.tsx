"use client";
// import React, { useRef, useState } from "react";
// import Image from "next/image";
// import styles from "./page.style.module.css";
// import MoreIcon from "/public/dots.svg";
// import DropdownArrow from "/public/downArrow.svg";
// import ChipCircle from "/public/ChipCircle.svg";
// import ActiveChipCircle from "/public/ActiveChipCircle.svg";
// import Slider from "@/app/components/internal/trackers/Slider";
// import { useRouter, useSearchParams } from "next/navigation";
// import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown";
// import LabelDropdown from "@/app/components/dropdown/LabelDropdown";
// import DateRangeInput from "@/app/components/dropdown/DateRangeInput";
// import EventAttendance from "@/app/components/dropdown/EventAttendance";
// import CheckboxInput from "@/app/components/UI/CheckBoxInput";
// import { useTheme } from "@/context";
// import { myFetch } from "@/utils/myFetch";
// import { baseUrl } from "@/constants";

// interface ChipProps {
//   state: string[];
//   setState: React.Dispatch<React.SetStateAction<string[]>>;
//   value: string;
// }

// const statusData = ["ACTIVE", "CANCELED", "POSTPONED", "PREDICTED", "EXPIRED"];

// const Chip = ({ state, setState, value }: ChipProps) => {
//   const { theme } = useTheme();
//   const onClickHandler = () => {
//     state.includes(value)
//       ? setState(state.filter((existingStatus) => existingStatus !== value))
//       : setState([...state, value]);
//   };
//   return (
//     <div
//       className={`${styles.chip} ${state.includes(value) ? styles.active : ""
//         } ${theme === "light" ? styles.chip_light : ""}`}
//       onClick={onClickHandler}
//     >
//       {state.includes(value) ? (
//         <Image src={ActiveChipCircle} alt="chipcircle" />
//       ) : (
//         <Image src={ChipCircle} alt="chipcircle" />
//       )}
//       <div>{value}</div>
//     </div>
//   );
// };

// const CreateTracker = () => {
//   const router = useRouter();
//   const [openDropdown, setOpenDropdown] = useState("");
//   // const [eventStatus, setEventStatus] = useState(searchParams.get("event_status")?.split(",") || []);
//   // const [categories, setCategories] = useState(searchParams.get("categories")?.split(",") || []);
//   // const [dateRange, setDateRange] = useState<string[]>(searchParams.get("date_range")?.split(",") || []);
//   const [trackerName, setTrackerName] = useState("");
//   const [eventStatus, setEventStatus] = useState<string[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [dateRange, setDateRange] = useState<string[]>([]);
//   const [labels, setLabels] = useState<string[]>([]);

//   const [attendanceRange, setAttendanceRange] = useState<string[]>([
//     "",
//     "Unlimited",
//   ]);
//   const [location, setLocation] = useState("");

//   const [startEventeliRank, setStartEventeliRank] = useState(34);
//   const [endEventeliRank, setEndEventeliRank] = useState(76);

//   const [startPredictedRank, setStartPredictedRank] = useState(23);
//   const [endPredictedRank, setEndPredictedRank] = useState(75);

//   const [startLocalRank, setStartLocalRank] = useState(35);
//   const [endLocalRank, setEndLocalRank] = useState(67);

//   const categoryDropdownRef = useRef(null);
//   const labelDropdownRef = useRef(null);
//   const dateRangeDropdownRef = useRef(null);
//   const attendanceDropdownRef = useRef(null);
//   const { theme } = useTheme();
//   const iconClass = theme === "light" ? "icons_light" : "icon";

//   const [isSaving, setIsSaving] = useState<boolean>(false)

//   // const search = useSearchParams();
//   // console.log(search)
//   console.log(router);

//   const handleOnOpenDropdown = (value: string) => {
//     if (openDropdown == "") {
//       setOpenDropdown(value);
//     } else {
//       setOpenDropdown("");
//     }
//   };

//   const saveTrackerHandler = async () => {
//     const formData = {
//       name: trackerName,
//       filterValue: {
//         labels: labels,
//         category: categories,
//         status: eventStatus,
//         city: ["London"],
//         active_gte: new Date(dateRange[0]).toISOString(),
//         active_lte: new Date(dateRange[1]).toISOString(),
//         total_attendance_gte: +attendanceRange[0],
//         total_attendance_lte:
//           attendanceRange[1] === "Unlimited" ? 1000000 : +attendanceRange[1],
//         event_rank_gte: Math.floor(startEventeliRank),
//         event_rank_lte: Math.floor(endEventeliRank),
//         local_rank_gte: Math.floor(startLocalRank),
//         local_rank_lte: Math.floor(endLocalRank),
//         aviation_rank_gte: 2,
//         aviation_rank_lte: 100,
//       },
//     };
//     if (
//       categories.length === 0 ||
//       labels.length === 0 ||
//       dateRange.length === 0 ||
//       eventStatus.length === 0
//     ) {
//       console.log("Please, Fill all the details");
//       return;
//     }
//     setIsSaving(true);

//     if (
//       categories.length === 0 ||
//       labels.length === 0 ||
//       dateRange.length === 0 ||
//       eventStatus.length === 0
//     ) {
//       console.log("Please, Fill all the details");
//       return;
//     }

//     setIsSaving(true);

//     const { data, error } = await myFetch(`${baseUrl}/tracker`, {
//       method: "POST",
//       body: JSON.stringify(formData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (error) {
//       console.log(error);
//       setIsSaving(false);
//       setIsSaving(false);
//       return;
//     }
//     if (data) {
//       setIsSaving(false);
//       setIsSaving(false);
//       router.replace("/internal/trackers");
//     }
//   };

//   return (
//     <div>
//       <div className={styles.trackers_container}>
//         <div
//           className={`${styles.trackers_header} ${theme === "light" ? styles.trackers_header_light : ""
//             }`}
//         >
//           <input
//             className={styles.trackers_header_input}
//             placeholder="Tracker Name"
//             onChange={(event) => setTrackerName(event.target.value)}
//           />
//           <div className={styles.trackers_header_more_button}>
//             <Image src={MoreIcon} alt="moreicon" className={iconClass} />
//           </div>
//           <button
//             onClick={saveTrackerHandler}
//             className={`${styles.trackers_header_newtracker_button} ${
//               isSaving && styles.newtracker_button_disable
//             }`}
           
//           >
//             <div>{isSaving ? "Saving..." : "Save Tracker"}</div>
//           </button>
//         </div>
//       </div>

//       <div className={styles.form_container}>
//         <div className={styles.first_container}>
//           <div ref={categoryDropdownRef}>
//             <div className={styles.input_title}>Category</div>
//             <div
//               className={styles.dropdown_container}
//               onClick={() => handleOnOpenDropdown("Category")}
//             >
//               <div className={styles.dropdown}>
//                 {categories.length > 0 ? (
//                   categories.map((category) => (
//                     <div key={category} className={styles.tag}>
//                       {category}
//                     </div>
//                   ))
//                 ) : (
//                   <div className={styles.dropdown_placeholder}>--Select--</div>
//                 )}
//               </div>
//               <Image
//                 src={DropdownArrow}
//                 alt="dropdownarrow"
//                 className={iconClass}
//               />
//             </div>
//             {openDropdown == "Category" && (
//               <CategoryDropdown
//                 className={styles.category_dropdown}
//                 state={categories}
//                 setState={setCategories}
//                 dropdownRef={categoryDropdownRef}
//                 onClose={() => setOpenDropdown("")}
//               />
//             )}
//           </div>

//           <div>
//             <div className={styles.input_title}>Event Status</div>
//             <div className={styles.chips_container}>
//               {statusData.map((status) => (
//                 <Chip
//                   key={status}
//                   state={eventStatus}
//                   setState={setEventStatus}
//                   value={status}
//                 />
//               ))}
//             </div>
//           </div>

//           <div ref={labelDropdownRef}>
//             <div className={styles.input_title}>Labels</div>
//             <div
//               className={styles.dropdown_container}
//               onClick={() => handleOnOpenDropdown("Labels")}
//             >
//               <div className={styles.dropdown}>
//                 {labels.length > 0 ? (
//                   labels.map((label) => (
//                     <div key={label} className={styles.tag}>
//                       {label}
//                     </div>
//                   ))
//                 ) : (
//                   <div className={styles.dropdown_placeholder}>--Select--</div>
//                 )}
//               </div>
//               <div
//                 className={`${styles.dropdown_choosebutton} ${theme === "light" ? styles.dropdown_choosebutton_light : ""
//                   }`}
//               >
//                 <div>Choose</div>
//                 <Image
//                   src={DropdownArrow}
//                   alt="dropdownarrow"
//                   className={iconClass}
//                 />
//               </div>
//             </div>
//             {openDropdown == "Labels" && (
//               <LabelDropdown
//                 // className={styles.category_dropdown}
//                 state={labels}
//                 setState={setLabels}
//                 // dropdownRef={labelDropdownRef}
//                 // onClose={() => setOpenDropdown("")}
//               />
//             )}
//           </div>
//         </div>

//         <div className={styles.second_container}>
//           <div ref={dateRangeDropdownRef}>
//             <div className={styles.input_title}>Date Range</div>
//             <div
//               className={styles.dropdown_container}
//               onClick={() => handleOnOpenDropdown("Date Range")}
//             >
//               <div className={styles.dropdown}>
//                 {dateRange.length > 0 ? (
//                   <div className={styles.tag}>
//                     {`${dateRange[0]} - ${dateRange[1]}`}
//                   </div>
//                 ) : (
//                   <div className={styles.dropdown_placeholder}>--Select--</div>
//                 )}
//               </div>
//               <div
//                 className={`${styles.dropdown_choosebutton} ${theme === "light" ? styles.dropdown_choosebutton_light : ""
//                   }`}
//               >
//                 <div>Choose</div>
//                 <Image
//                   src={DropdownArrow}
//                   alt="dropdownarrow"
//                   className={iconClass}
//                 />
//               </div>
//             </div>
//             {openDropdown == "Date Range" && (
//               <DateRangeInput
//                 className={styles.category_dropdown}
//                 state={dateRange}
//                 setState={setDateRange}
//                 dropdownRef={dateRangeDropdownRef}
//                 onClose={() => setOpenDropdown("")}
//               />
//             )}
//           </div>

//           <div ref={attendanceDropdownRef}>
//             <div className={styles.input_title}>Attendance</div>
//             <div
//               className={styles.dropdown_container}
//               onClick={() => handleOnOpenDropdown("Attendance")}
//             >
//               {attendanceRange[0] !== "" ? (
//                 <div className={styles.tag}>
//                   {`${attendanceRange[0]} - ${attendanceRange[1]}`}
//                 </div>
//               ) : (
//                 <div className={styles.dropdown_placeholder}>--Select--</div>
//               )}
//               <div
//                 className={`${styles.dropdown_choosebutton} ${theme === "light" ? styles.dropdown_choosebutton_light : ""
//                   }`}
//               >
//                 <div>Choose</div>
//                 <Image
//                   src={DropdownArrow}
//                   alt="dropdownarrow"
//                   className={iconClass}
//                 />
//               </div>
//             </div>
//             {openDropdown == "Attendance" && (
//               <EventAttendance
//                 className={styles.category_dropdown}
//                 state={attendanceRange}
//                 setState={setAttendanceRange}
//                 dropdownRef={attendanceDropdownRef}
//                 onClose={() => setOpenDropdown("")}
//               />
//             )}
//           </div>

//           <div>
//             <div className={styles.input_title}>Scores and Ranks</div>
//             <div className={styles.sliderinput_container}>
//               <Slider
//                 StatsName="Eventeli Ranking"
//                 startValue={startEventeliRank}
//                 endValue={endEventeliRank}
//                 onEndValueChange={setEndEventeliRank}
//                 onStartValueChange={setStartEventeliRank}
//                 Range="0-100"
//               />
//               <Slider
//                 StatsName="Local Ranking"
//                 startValue={startLocalRank}
//                 endValue={endLocalRank}
//                 onEndValueChange={setEndLocalRank}
//                 onStartValueChange={setStartLocalRank}
//                 Range="0-100"
//               />
//               <Slider
//                 StatsName="Prediction Score"
//                 startValue={startPredictedRank}
//                 endValue={endPredictedRank}
//                 onEndValueChange={setEndPredictedRank}
//                 onStartValueChange={setStartPredictedRank}
//                 Range="0-100"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className={styles.location_container}>
//         <div>
//           <div className={styles.input_title}>Location</div>
//           <div className={styles.input_description}>
//             Choose an area where you want to be notified upon on addition of any
//             new events
//           </div>
//         </div>

//         <div
//           className={`${styles.location_tab_container} ${theme === "light" ? styles.location_tab_container_light : ""
//             }`}
//         >
//           <div className={`${styles.location_tab} ${styles.active}`}>
//             Saved Locations
//           </div>
//           <div className={styles.location_tab}>City, State, Country etc..</div>
//           <div className={styles.location_tab}>Center Point & Radius</div>
//         </div>

//         <label htmlFor="london" className={styles.savedlocation}>
//           <div className={styles.savedlocation_text_container}>
//             <div className={styles.savedlocation_title}>London</div>
//             <div className={styles.savedlocation_description}>
//               London, England, United Kingdom (1.34 mi radius)
//             </div>
//           </div>
//           <div className={styles.savedlocation_checkbox_container}>
//             <CheckboxInput
//               id="london"
//               onChange={() => setLocation("london")}
//               checked={location == "london"}
//             />
//             <div className={styles.savedlocation_checkbox_title}>Select</div>
//           </div>
//         </label>

//         <label htmlFor="Chicago" className={styles.savedlocation}>
//           <div className={styles.savedlocation_text_container}>
//             <div className={styles.savedlocation_title}>Chicago</div>
//             <div className={styles.savedlocation_description}>
//               Chicago, Illinois, United States (1.34 mi radius)
//             </div>
//           </div>
//           <div className={styles.savedlocation_checkbox_container}>
//             <CheckboxInput
//               id="Chicago"
//               onChange={() => setLocation("Chicago")}
//               checked={location == "Chicago"}
//             />
//             <div className={styles.savedlocation_checkbox_title}>Select</div>
//           </div>
//         </label>

//         <label htmlFor="New York" className={styles.savedlocation}>
//           <div className={styles.savedlocation_text_container}>
//             <div className={styles.savedlocation_title}>New York</div>
//             <div className={styles.savedlocation_description}>
//               New York, United States (1.34 mi radius)
//             </div>
//           </div>
//           <div className={styles.savedlocation_checkbox_container}>
//             <CheckboxInput
//               id="New York"
//               checked={location == "New York"}
//               onChange={() => setLocation("New York")}
//             />
//             <div className={styles.savedlocation_checkbox_title}>Select</div>
//           </div>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default CreateTracker;
import React from 'react'
import styles from "./page.style.module.css";
import Image from 'next/image';
import userOne from '/public/userOne.svg'
import Filters from "@/app/components/internal/trackers/Filters"
const page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.topInnerContainerLeft}>
          <div>
            <Image src={userOne} alt="userOne"/>
            </div>
            <div>
              <div className={styles.createHead}>Create Custom Tracker</div>
              <div className={styles.createContent}>Select from the available data filters to create a custom tracker</div>
            </div>
        </div>
        <div className={styles.topInnerContainerRight}>
          <button className={styles.cancel}>Cancel</button>
          <button className={styles.save}>Save Tracker</button>
        </div>
      </div>
      <div className={styles.searchContainer}>
        <input className={styles.textArea}type='text' placeholder='Enter Tracker Name'/>
      </div>
      <Filters/>
      {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto rerum tempore cumque a, cum, qui omnis totam beatae esse laboriosam nisi aut fugit officia quasi dolore sed cupiditate obcaecati nulla.
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi, blanditiis. Quidem voluptatum, nihil voluptate porro repudiandae adipisci, esse ad saepe ipsam ipsa incidunt dolorem doloribus sunt non quibusdam unde explicabo. Distinctio quibusdam nihil ea dolore earum culpa cumque cum non magni iusto recusandae quae vero nisi neque accusamus quidem, perspiciatis exercitationem. Debitis quaerat doloremque architecto quo nisi minus voluptatibus est velit ut fugit corrupti perspiciatis natus recusandae officiis asperiores, aperiam nostrum eum necessitatibus, quibusdam modi accusantium tempora, maiores in nulla! Eaque delectus aut nam adipisci tempora esse corporis laudantium dicta nihil, enim quas suscipit voluptates molestias maiores accusamus facere culpa autem omnis accusantium reprehenderit beatae obcaecati vel perferendis officia. Esse iste voluptatum veritatis aliquid velit sapiente culpa deleniti quod tenetur ratione corrupti, repellendus itaque porro debitis, eaque ad, tempora saepe facere corporis aperiam. Natus, a. Aspernatur, quia labore. Aspernatur blanditiis eum quis, voluptatibus, voluptatem explicabo perferendis ut natus quam recusandae repellendus asperiores. Officia veritatis provident sapiente excepturi cumque ipsa, a exercitationem. Vel saepe optio ipsum eaque eveniet nemo eius illo similique, doloremque animi officiis laudantium inventore quis accusantium, sapiente cum beatae quo error nihil accusamus temporibus provident unde sint dolor? Blanditiis quasi saepe nam expedita laudantium suscipit non atque quae. */}
    </div>
  )
}

export default page

