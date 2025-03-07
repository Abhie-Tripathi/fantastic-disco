"use client";

import { useFilterState } from "@/hooks/useFilterState";
import Filters from "@/components/search/Filters";
import { PeopleList } from "@/app/components/prospect/PeopleList";
import { ProspectList } from "@/app/components/prospect/ProspectList";
import Events from "@/app/components/Events";

const Search = () => {
  const { getFilterValue, setFilter } = useFilterState();

  const view = getFilterValue("viewBy") || "event";

  return (
    <div className="flex relative">
      <div className="transition-all duration-300 sticky top-0 h-screen overflow-hidden w-[342px]">
        <div className={`h-full w-[342px] transition-transform duration-300`}>
          <Filters />
        </div>
      </div>
      {view == "event" && <Events />}
      {view == "user" && <PeopleList />}
      {view == "company" && <ProspectList />}
    </div>
  );
};

export default Search;
