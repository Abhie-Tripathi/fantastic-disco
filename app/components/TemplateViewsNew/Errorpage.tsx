"use client";
import React from "react";
import styles from "./error.style.module.css";
import WidgetIdEmptyIcon from "/public/widgetimages/emptyimages/widgetempty.svg";
import WidgetListEmptyIcon from "/public/widgetimages/emptyimages/widgetlistempty.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  type: string;
  size?: string;
}

const Errorpage = ({ type, size }: Props) => {
  const router = useRouter();
  const handleRouting = () => {
    if (type === "id") {
      router.push("/widget/dashboard");
    } else router.push("/widget/add");
  };
  return (
    <div className={styles.body}>
      {(type === "id" || type === "detail") && (
        <Image src={WidgetIdEmptyIcon} alt="empty" />
      )}
      {type === "list" && <Image src={WidgetListEmptyIcon} alt="empty" />}
      {type === "brandkit" && <Image src={WidgetListEmptyIcon} alt="empty" />}

      {type === "id" && <div className={styles.heading}>Page not found</div>}
      {type === "list" && (
        <div
          className={size === "short" ? styles.smallHeading : styles.heading}
        >
          No Widgets Added
        </div>
      )}
      {type === "detail" && (
        <div className={styles.heading}>Page not found</div>
      )}

      {type === "brandkit" && (
        <div className={styles.heading}>Brandkit not fetched</div>
      )}

      {type === "brandkit" ? (
        <span className={styles.subheading}>
          It seems like you haven&apos;t fetched your Brandkit yet. Please start
          by fetching the Brandkit to get things rolling.
        </span>
      ) : (
        ""
      )}
      {type === "id" ? (
        <span className={styles.subheading}>
          We can&apos;t find the widget you&apos;re looking for. It seems the ID
          might be invalid
        </span>
      ) : type === "list" ? (
        <span
          className={
            size === "short" ? styles.smallSubHeading : styles.subheading
          }
        >
          Start by building your first widget—it&apos;s as easy as drag, drop,
          and customize.
        </span>
      ) : (
        <span className={styles.subheading}>
          We can&apos;t find the page you&apos;re looking for. It seems the ID
          might be invalid
        </span>
      )}

      {type === "id" ? (
        <span className={styles.subheading}>
          Try checking the link, or view the dashboard for details.
        </span>
      ) : type === "list" ? (
        <span
          className={
            size === "short" ? styles.smallSubHeading : styles.subheading
          }
        >
          Your journey to a perfect dashboard begins here!
        </span>
      ) : (
        <span className={styles.subheading}>Try checking the link.</span>
      )}

      {(type === "id" || type === "list") && (
        <button onClick={handleRouting}>
          {type === "id" ? "Dashboard" : "Create Widget"}
        </button>
      )}
      {type === "brandkit" && (
        <button onClick={handleRouting}>
          {type === "brandkit" ? "Dashboard" : "Create Widget"}
        </button>
      )}
    </div>
  );
};

export default Errorpage;
