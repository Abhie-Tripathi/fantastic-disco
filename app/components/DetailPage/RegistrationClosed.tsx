import React from "react";
import styles from "./registrationClosed.style.module.css";
const RegistrationClosed = () => {
  return (
    <div className={styles.registerContainer}>
      <div className={styles.icon_text_container}>
        <div style={{marginTop:"5px"}}><RegistrationClosedSVG/></div>
        <div>Registration Closed</div>
      </div>
      <div className={styles.dec_text}>
        This event is not currently taking registrations. You may contact the
        host to receive updates.
      </div>
    </div>
  );
};

export default RegistrationClosed;

function RegistrationClosedSVG() {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 11H17V13H7V11Z" fill="#A8A8A8" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
        fill="#A8A8A8"
      />
    </svg>
  );
}
