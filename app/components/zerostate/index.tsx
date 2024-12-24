import React from "react";
import styles from "./zeroState.style.module.css";
import Image from "next/image";
import ZeroStateIcon from "@/public/zero_state.svg";

const ZeroState = ({ title, text }: { title?: string, text?:string }) => {
  return (
    <div className={styles.zeroState_container}>
      <div style={{width:"400px"}}>{title}</div>
      <div className={styles.text}>{text}</div>
      <Image src={ZeroStateIcon} alt="zerostate" width={200} height={160}/>
    </div>
  );
};

export default ZeroState;