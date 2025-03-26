"use client";

import { ProspectList } from "@/app/components/prospect/ProspectList";
import SearchLayout from "@/components/search/SearchLayout";

const CompaniesSearch = () => {
  return (
    <SearchLayout type="companies">
      <ProspectList />
    </SearchLayout>
  );
};

export default CompaniesSearch; 