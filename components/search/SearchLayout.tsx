"use client";

import { useState } from "react";
import { useFilterContext } from "@/context/filterContext";
import Filters from "@/components/search/Filters";
import { Filter } from "lucide-react";

interface SearchLayoutProps {
  children: React.ReactNode;
  type: 'events' | 'companies' | 'people';
}

const SearchLayout = ({ children, type }: SearchLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { localFilters } = useFilterContext();
  const filterCount = Object.keys(localFilters).length;

  return (
    <div className="flex relative">
      {isCollapsed && (
        <div className="fixed left-[82px] top-[84px] z-30 overflow-hidden">
          <button
            onClick={() => setIsCollapsed(false)}
            className="group relative bg-white hover:bg-[#F8F8FA] border border-[#E6E6E6] shadow-sm rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
          >
            <Filter className="w-4 h-4 text-[#6E6F89] group-hover:text-primary transition-colors" />
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-[10px] font-medium text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 border-2 border-white">
                {filterCount}
              </span>
            )}
          </button>
        </div>
      )}
      <div className={`transition-all duration-300 sticky top-0 h-screen overflow-hidden ${isCollapsed ? 'w-0' : 'w-[38%] max-w-[368px]'}`}>
        <div className={`h-full transition-transform duration-300 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
          <Filters type={type} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        </div>
      </div>
      <div className={`flex-1 transition-all duration-300 relative ${isCollapsed ? 'pl-12' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default SearchLayout; 