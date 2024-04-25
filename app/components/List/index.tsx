import React, { useState } from "react";
import styles from "./list.module.css";
import EventCard from "./EventCard";
import ListData from '@/public/data/searchPageCard.json'
import { EventDataType } from "../types/allevents";

const List = () => {
  return (
    <div className={styles.container}>
      {ListData.map((data : any, key) => (
        <EventCard data = {data} key={key} />
      ))}
    </div>
  );
};

export default List;