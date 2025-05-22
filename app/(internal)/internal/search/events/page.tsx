"use client";

import Events from "@/app/components/Events";
import SearchLayout from "@/components/search/SearchLayout";
import { useRef } from "react";
import { Step } from "react-joyride";

const EventsSearch = () => {
  const walkThroughRefs = {
    viewRef: useRef<HTMLDivElement>(null),
  };
  return (
    <SearchLayout type="events" walkThroughRefs={walkThroughRefs}>
      <Events walkThroughRefs={walkThroughRefs} />
    </SearchLayout>
  );
};

export default EventsSearch;
