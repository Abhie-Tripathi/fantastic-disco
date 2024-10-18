"use client";
import React, { useState } from "react";
import styles from "./registerform.style.module.css";
import { baseUrl } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/showToast";
interface Props {
  registerMessage: string;
  registerBtnText: string;
  registerBtnColor: string;
  widgetId?: string;
  eventId: string;
  setRegisterSuccess: (value: boolean) => void;
  capacity: number;
  registration: boolean;
  approval: boolean;
  waitlisting: boolean;
}

const RegisterForm = ({
  registerMessage,
  registerBtnText,
  widgetId,
  registerBtnColor,
  eventId,
  setRegisterSuccess,
  capacity,
  registration,
  approval,
  waitlisting,
}: Props) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCapacityFull, setIsCapacityFull] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(true);
  console.log("value_s", capacity, registration, approval, waitlisting);
  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  // Function to calculate brightness
  const calculateBrightness = ({
    r,
    g,
    b,
  }: {
    r: number;
    g: number;
    b: number;
  }) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Determine if the button color is dark or light
  const rgb = hexToRgb(registerBtnColor);
  const brightness = calculateBrightness(rgb);
  const fontColor = brightness > 155 ? "#000000" : "#FFFFFF";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const [first, ...rest] = value.split(" ");
      setFormData({
        ...formData,
        firstname: first,
        lastname: rest.join(" "), // Join the remaining parts as the last name
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      firstname: formData.firstname,
      lastname: formData.lastname,
      eventId: eventId,
      interest: "ATTENDEE",
      note: "intend",
      source: "eventgeni",
      redirectUrl: `${console_url}/detailpage/${eventId}`
      // sourceId: widgetId,
     
    };

    try {
      const response = await fetch(`${baseUrl}/intend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        setRegisterSuccess(true);
        // toast.success("successfully registred for the event !");
      } else {
        console.error("Error:", response.statusText);
        // toast.error("Error in registration");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = () => {
    showToast("error", "You have already registered for this event");
  };
  return (
    // <div className={styles.registerContainer}>
    //   {/* <ToastContainer /> */}
    //   {registration ? <div className={styles.header}>
    //       <div>Join us at the event</div>
    //     </div> :waitlisting || approval || isEventEnded ? (
    //     <>Register</>
    //   ) : (
    //     <></>
    //   )}

    //   <form onSubmit={handleSubmit}>
    //     {registration ? <div className={styles.formSubHeading}>{registerMessage}</div>:waitlisting ? (
    //       <>
    //         <div className={styles.event_container}>
    //           <div className={styles.icon_container}>
    //             <EventClosedIcon />
    //           </div>
    //           <div className={styles.text_container}>
    //             <div className={styles.event_full_text}>Event Full</div>
    //             <div className={styles.waitlist_text}>
    //               If you&apos;d like, you can join the waitlist.
    //             </div>
    //           </div>
    //         </div>
    //         <div className={styles.detail_text}>
    //           Please click on the button below to join the waitlist. You will be
    //           notified if additional spots become available.
    //         </div>
    //       </>
    //     ) : approval ?
    //     <>
    //       <div className={styles.event_container}>
    //           <div className={styles.icon_container}>
    //             <ApprovalSVG />
    //           </div>
    //           <div className={styles.text_container}>
    //             <div className={styles.event_full_text}>Approval Required</div>
    //             <div className={styles.waitlist_text}>
    //               Your registration is subject to approval by the host.
    //             </div>
    //           </div>
    //         </div>
    //         <div className={styles.detail_text}>
    //          Welcome! To join the event, please register below.
    //         </div>

    //     </>:
    //     isEventEnded ? <>
    //      <div className={styles.event_container}>
    //           <div className={styles.icon_container}>
    //             <EventClosedIcon />
    //           </div>
    //           <div className={styles.text_container}>
    //             <div className={styles.event_full_text}>Past Event</div>
    //             <div className={styles.waitlist_text}>
    //               <span>This event endede 9 hours age.</span>
    //             </div>
    //           </div>
    //         </div>
    //         <div className={styles.detail_text}>
    //          Welcome! To join the event, please register below.
    //         </div>
    //         </>:<></>
    //     }

    //     <input
    //       className={styles.inputField}
    //       type="text"
    //       name="firstname"
    //       placeholder="Name"
    //       value={formData.firstname}
    //       onChange={handleChange}
    //       required
    //     />

    //     <input
    //       className={styles.inputField}
    //       type="email"
    //       name="email"
    //       placeholder="Email"
    //       value={formData.email}
    //       onChange={handleChange}
    //       required
    //     />
    //     <button
    //       type="submit"
    //       style={{ backgroundColor: registerBtnColor, color: fontColor }}
    //       className={styles.submitBtn}
    //     >
    //       {registration ?<span>{registerBtnText}</span>: waitlisting ? (
    //         <span onClick={handleClick}>Join waitlist</span>
    //       )  : approval ? <span>Request to join</span>: isEventEnded? <span>Follow</span>:<></> }

    //     </button>
    //   </form>
    // </div>

    <div className={styles.registerContainer}>
      {registration && !approval && !capacity && !waitlisting ? (
        <div className={styles.header}>
          <div>Join us at the event</div>
        </div>
      ) : waitlisting || approval || isEventEnded ? (
        <>Register</>
      ) : (
        <></>
      )}

      <form onSubmit={handleSubmit}>
        {registration && !approval && !capacity && !waitlisting ? (
          <div className={styles.formSubHeading}>{registerMessage}</div>
        ) : !registration ||
          (waitlisting && capacity && !registration && approval) ? (
          // When cap, waitlist, approve may be true or false but registration should be false
          <>
            <div className={styles.icon_text_container}>
              <div style={{ marginTop: "5px" }}>
                <RegistrationClosedSVG />
              </div>
              <div>Registration Closed</div>
            </div>
            <div className={styles.dec_text}>
              This event is not currently taking registrations. You may contact
              the host to receive updates.
            </div>
          </>
        ) : approval && registration && !capacity && !waitlisting ? (
          // When approval is true and cap is true (remaining)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <ApprovalSVG />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Approval Required</div>
                <div className={styles.waitlist_text}>
                  Your registration is subject to approval by the host.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        ) : registration && approval && waitlisting && !capacity ? (
          // When waitlisting is true and cap is false (full)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Event Full</div>
                <div className={styles.waitlist_text}>
                  If you&apos;d like, you can join the waitlist.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Please click on the button below to join the waitlist. You will be
              notified if additional spots become available.
            </div>
          </>
        ) : registration && approval && capacity && !waitlisting ? (
          // When approval is true and cap is true (remaining)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <ApprovalSVG />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Approval Required</div>
                <div className={styles.waitlist_text}>
                  Your registration is subject to approval by the host.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        ) : registration && approval && capacity && waitlisting ? (
          // When approval is true and cap is true (remaining)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <ApprovalSVG />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Approval Required</div>
                <div className={styles.waitlist_text}>
                  Your registration is subject to approval by the host.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        ) : registration && approval && !waitlisting && !capacity ? (
          // When approval is true, waitlisting false, but cap is false (event full)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Follow Event</div>
                <div className={styles.waitlist_text}>
                  This event is full. Please follow for future updates.
                </div>
              </div>
            </div>
          </>
        ) : isEventEnded ? (
          // When the event has ended
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Past Event</div>
                <div className={styles.waitlist_text}>
                  <span>This event ended 9 hours ago.</span>
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Thank you for your interest! Follow to stay updated for future
              events.
            </div>
          </>
        ) : (
          <></>
        )}

        <input
          className={styles.inputField}
          type="text"
          name="firstname"
          placeholder="Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />

        <input
          className={styles.inputField}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          style={{ backgroundColor: registerBtnColor, color: fontColor }}
          className={styles.submitBtn}
          // onClick={handleClick}
        >
          {registration && !approval && !capacity && !waitlisting ? (
            <span>{registerBtnText}</span>
          ) : !registration ? (
            <span>Follow</span>
          ) : registration && approval && waitlisting && !capacity ? (
            <span>Join waitlist</span>
          ) : registration && approval && capacity && !waitlisting ? (
            <span>Request to join</span>
          ) : registration && !approval && !capacity && !waitlisting ? (
            <span>Request to join</span>
          ) : registration && approval && !capacity && !waitlisting ? (
            <span>Request to join</span>
          ) : registration && approval && capacity && waitlisting ? (
            <span>Request to join</span>
          ) : isEventEnded ? (
            <span>Follow</span>
          ) : (
            <></>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

function EventClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a8a8a8"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function ApprovalSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 96 960 960"
      width="20px"
      fill="#7D7D7D"
    >
      <path d="M669 1026 504 861l43-43 122 122 243-243 43 43-286 286ZM479.825 696Q415 696 371.5 652.65 328 609.3 328 544.5q0-64.8 43.5-108.15 43.5-43.35 108.325-43.35Q544 393 587.175 436.35q43.175 43.35 43.175 108.15 0 64.8-43.175 108.15Q544 696 479.825 696ZM188 866v-60q0-30 15.5-54.5T258 711q51-22 103-33.5t118-11.5q30 0 59.5 3t57.5 10l-49 50q-19-3-40-5t-40-2q-59 0-112.5 9.5T257 777q-16 7-25.5 22t-9.5 32v29h259L610 866H188Zm291-366q-45 0-74-29.5T376 397q0-45 29-73.5T479 295q45 0 74.5 28.5T583 397q0 45-29.5 74.5T479 500ZM479 437Zm.5 283Z" />
    </svg>
  );
}

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
