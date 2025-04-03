"use client";

import { PeopleList } from "@/app/components/prospect/PeopleList";
import SearchLayout from "@/components/search/SearchLayout";

const PeopleSearch = () => {
  return (
    <SearchLayout type="people">
      <PeopleList />
    </SearchLayout>
  );
};

export default PeopleSearch; 