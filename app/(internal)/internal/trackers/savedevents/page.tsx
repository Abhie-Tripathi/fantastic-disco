import EventTable from "@/app/components/internal/trackers/EventTable/EventTable";
import React from "react";

const eventData = [
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
];

const SavedEvents = () => {
  return (
    <div>
      <EventTable eventData={eventData} />
    </div>
  );
};

export default SavedEvents;