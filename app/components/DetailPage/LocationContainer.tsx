import React from "react";
import styles from "./location.style.module.css";
interface Props {
  cityName: string;
  countryName: string;
  eventFormat?: string;
  virtualLink: string;
}

const LocationContainer = ({
  cityName,
  countryName,
  eventFormat,
  virtualLink,
}: Props) => {
  return (
    // <div className={styles.body}>
    //     <div className={styles.locationContainer}>
    //         <LocationIcon />
    //         <div className={styles.eventLocation}>
    //             <div className={`${styles.eventLocationOne} ${cityName ? styles.activeLocation : ""}`}>{cityName ? cityName : "Add Event Location"}</div>
    //             <div className={styles.eventLocationTwo}>{countryName ? countryName : "Offline location or Virtual Link"}</div>
    //         </div>
    //     </div>
    // </div>

    <div className={styles.body}>
      {eventFormat === "In-person" ? (
        <div className={styles.locationContainer}>
          <LocationIcon />
          <div className={styles.eventLocation}>
            <div className={`${styles.eventLocationOne} ${cityName ? styles.activeLocation : ""}`}>
              {(!cityName && !countryName) ? "Add Event Location" : cityName ? cityName : countryName }
            </div>
            <div className={styles.eventLocationTwo}>
              {countryName ? countryName : "Offline location or Virtual Link"}
            </div>
          </div>
        </div>
      ) : eventFormat === "Virtual" ? (
        <div className={styles.virtualContainer}>
          <div className={styles.icon_and_text}>
            <LinkIcon />
            <span> Join us virtually at </span>
          </div>
          <div className={styles.virtual_link}>{virtualLink}</div>
        </div>
      ) : eventFormat === "Hybrid" ? (
        <div className={styles.hybridContainer}>
          <div className={styles.location_container}>
            <LocationIcon />
            <div className={styles.eventLocation}>
              <div
                className={`${styles.eventLocationOne} ${
                  cityName ? styles.activeLocation : ""
                }`}
              >
                {cityName ? cityName : "Add Event Location"}
              </div>
              <div className={styles.eventLocationTwo}>
                {countryName ? countryName : "Offline location or Virtual Link"}
              </div>
            </div>
          </div>
          <div className={styles.divider}></div>

          <div className={styles.vertual_link_container}>
            <div className={styles.icon_and_text}>
              <LinkIcon />
              <span> Or join us virtually at </span>
            </div>
            {/* <div className={styles.virtual_link}>{virtualLink}</div> */}
            <a
              href={virtualLink}
              className={styles.virtual_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {virtualLink}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LocationContainer;

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 -960 960 960"
      width="16"
    >
      <path
        d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"
        fill="#A8A8A8"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="#A8A8A8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.96953 8.39766C6.94604 8.37439 6.91431 8.36134 6.88125 8.36134C6.84819 8.36134 6.81646 8.37439 6.79297 8.39766L4.97734 10.2133C4.13672 11.0539 2.71797 11.143 1.78984 10.2133C0.860156 9.28359 0.949219 7.86641 1.78984 7.02578L3.60547 5.21016C3.65391 5.16172 3.65391 5.08203 3.60547 5.03359L2.98359 4.41172C2.9601 4.38846 2.92837 4.37541 2.89531 4.37541C2.86225 4.37541 2.83052 4.38846 2.80703 4.41172L0.991406 6.22734C-0.330469 7.54922 -0.330469 9.68828 0.991406 11.0086C2.31328 12.3289 4.45234 12.3305 5.77266 11.0086L7.58828 9.19297C7.63672 9.14453 7.63672 9.06484 7.58828 9.01641L6.96953 8.39766ZM11.0102 0.991406C9.68828 -0.330469 7.54922 -0.330469 6.22891 0.991406L4.41172 2.80703C4.38846 2.83052 4.37541 2.86225 4.37541 2.89531C4.37541 2.92837 4.38846 2.9601 4.41172 2.98359L5.03203 3.60391C5.08047 3.65234 5.16016 3.65234 5.20859 3.60391L7.02422 1.78828C7.86484 0.947656 9.28359 0.858594 10.2117 1.78828C11.1414 2.71797 11.0523 4.13516 10.2117 4.97578L8.39609 6.79141C8.37283 6.8149 8.35978 6.84663 8.35978 6.87969C8.35978 6.91275 8.37283 6.94448 8.39609 6.96797L9.01797 7.58984C9.06641 7.63828 9.14609 7.63828 9.19453 7.58984L11.0102 5.77422C12.3305 4.45234 12.3305 2.31328 11.0102 0.991406ZM7.53359 3.81797C7.5101 3.79471 7.47837 3.78166 7.44531 3.78166C7.41225 3.78166 7.38052 3.79471 7.35703 3.81797L3.81797 7.35547C3.79471 7.37896 3.78166 7.41069 3.78166 7.44375C3.78166 7.47681 3.79471 7.50854 3.81797 7.53203L4.43672 8.15078C4.48516 8.19922 4.56484 8.19922 4.61328 8.15078L8.15078 4.61328C8.19922 4.56484 8.19922 4.48516 8.15078 4.43672L7.53359 3.81797Z"
        fill="#7D7D7D"
      />
    </svg>
  );
}
