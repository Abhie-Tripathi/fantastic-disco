import classNames from "classnames";
import React from "react";
import styles from "./spinner.module.css";

interface spinnerProps {
  size?: "md" | "lg" | "xl";
  color?:
    | "primary"
    | "positive"
    | "negative"
    | "notice"
    | "info"
    | "default"
    | "white";
}

const Spinner = ({ size = "lg", color = "white" }: spinnerProps) => {
  return (
    <span className={classNames(styles.spinner, styles[size], styles[color])}>
      <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22 11C22 12.7359 21.5892 14.4472 20.8011 15.9939C20.013 17.5406 18.87 18.8788 17.4657 19.8992C16.0613 20.9195 14.4353 21.593 12.7208 21.8646C11.0063 22.1361 9.25178 21.998 7.60083 21.4616L8.45063 18.8462C9.68884 19.2485 11.0047 19.3521 12.2906 19.1484C13.5765 18.9448 14.796 18.4396 15.8492 17.6744C16.9025 16.9091 17.7598 15.9055 18.3508 14.7454C18.9419 13.5854 19.25 12.3019 19.25 11H22Z"
          fill="currentColor"
        />
        <path
          d="M-1.71661e-05 11C-1.71661e-05 9.26409 0.410824 7.55282 1.19891 6.0061C1.987 4.45939 3.12996 3.12116 4.53435 2.10081C5.93873 1.08047 7.56466 0.406984 9.2792 0.135427C10.9937 -0.136129 12.7482 0.00195122 14.3992 0.538379L13.5494 3.15378C12.3112 2.75146 10.9953 2.6479 9.7094 2.85157C8.42349 3.05524 7.20404 3.56035 6.15075 4.32561C5.09747 5.09087 4.24025 6.09454 3.64918 7.25458C3.05811 8.41461 2.74998 9.69806 2.74998 11H-1.71661e-05Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
};

export default Spinner;
