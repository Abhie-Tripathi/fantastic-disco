"use client";

import Events from "@/app/components/Events";
import SearchLayout from "@/components/search/SearchLayout";

const EventsSearch = () => {
  return (
    <SearchLayout type="events">
      <Events />
    </SearchLayout>
  );
};

export default EventsSearch;
