import { filters, getFilterComponent } from "@/components/search/filterUtils";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import whrbotlogo from "@/public/whrbotlogo.svg";
import { Filter, Lock } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import PremiumModal from "../premium-modal";

interface FilterSection {
  id: string;
  label: string;
  filters: FilterItem[];
}

interface FilterItem {
  id: string;
  component: string;
  enabled: boolean;
  filterName?: string;
}

interface FilterContentProps {
  source?: string;
  type: "events" | "companies" | "people";
  filterCount: number;
  createTrackerHandler?: () => void;
  searchHandler?: () => void;
  closeHandler?: (value: boolean) => void;
  refs?: any;
  trackerType?: string;
}

const FilterContent = ({
  source,
  type,
  filterCount,
  createTrackerHandler,
  searchHandler,
  closeHandler,
  refs,
  trackerType
}: FilterContentProps) => {
  const { localFilters, deleteMultipleLocalFilters } = useFilterContext();
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false)
  const isMobile = useIsMobile();

  console.log("is", isPremiumModalOpen)
  
  return (
    <>
    <div className="flex-1">
      <div className="overflow-y-auto w-full mt-0 flex-1">
        {source === "tracker" && isMobile && (
          <div className="flex items-center justify-between">
            <div>FILTERS</div>
            <div onClick={() => closeHandler?.(false)}>X</div>
          </div>
        )}
        <div className="p-3 bg-[var(--background-secondary-color)] ">
          <Accordion
            type="multiple"
            className="space-y-4"
            defaultValue={[filters[type][0]?.id]}
          >
            {filters[type].map((section: FilterSection) => (
              <>
              {(section.id==="advanced-details" && trackerType==="T_EVENT_PARTICIPATION")&&
                      <div className="ml-1 font-bold text-[12px]" style={{color:"var(--secondary-text-color)"}}>* Below filters are not applicable on this template</div>}
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-lg bg-background shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <AccordionTrigger
                  id={section.id}
                  // ref={section.label==="Basic Filters"?refs?.basicFilterRef:refs?.advanceFilterRef}
                  className="hover:no-underline py-3 px-4 transition-all duration-200 [&[data-state=open]]:bg-muted"
                >
                  <div className="text-sm flex gap-2 items-center uppercase font-medium">
                    <Filter className="w-4 h-4"/>
                    {section.label}
                    {["Advanced Details", "Insights & Scores", "Audience Intel"].includes(section.label) && (
                      <RainbowButton size="sm"  className="ml-2 h-6 rounded-sm" onClick={()=>setPremiumModalOpen(true)}>Premium</RainbowButton>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div
                    className="space-y-3 pt-2"
                    ref={refs?.advanceFilterRef}
                  >
                    {type === "companies" || type === "people" ? (() => {
                      // Define groupings
                      const companiesFilters = [
                        "category",
                        "location",
                        "product-topics",
                        "companyType",
                        "upcoming-event",
                        "company-followers"
                      ];
                      const eventFilters = [
                        "locationIds",
                        "event-followers"
                      ];
                      const peopleCompaniesFilters = [
                        "category",
                        "location",
                        "product-topics",
                        "company-followers"
                      ];
                      // Track which headings have been rendered
                      let companiesRendered = false;
                      let eventRendered = false;
                      let peopleRendered = false;
                      return section.filters
                        .filter((filter: FilterItem) =>
                          !isMobile || filter.id !== "eventIds"
                        )
                        .map((filter: FilterItem, idx) => {
                          let heading = null;
                          if (type === "companies") {
                            if (!companiesRendered && companiesFilters.includes(filter.id)) {
                              heading = <div key="Companies-heading" className=" text-xs" style={{ color: "var(--secondary-text-color)" }}>Companies</div>;
                              companiesRendered = true;
                            } else if (!eventRendered && eventFilters.includes(filter.id)) {
                              heading = <div key="Event-heading" className=" text-xs" style={{ color: "var(--secondary-text-color)" }}>Event</div>;
                              eventRendered = true;
                            } else if (!peopleRendered && !companiesFilters.includes(filter.id) && !eventFilters.includes(filter.id)) {
                              heading = <div key="People-heading" className=" text-xs" style={{ color: "var(--secondary-text-color)" }}>People</div>;
                              peopleRendered = true;
                            }
                          } else if (type === "people") {
                            if (!eventRendered && eventFilters.includes(filter.id)) {
                              heading = <div key="Event-heading" className=" text-xs" style={{ color: "var(--secondary-text-color)" }}>Event</div>;
                              eventRendered = true;
                            } else if (!companiesRendered && peopleCompaniesFilters.includes(filter.id)) {
                              heading = <div key="Companies-heading" className=" text-xs" style={{ color: "var(--secondary-text-color)" }}>Companies</div>;
                              companiesRendered = true;
                            } else if (!peopleRendered && !peopleCompaniesFilters.includes(filter.id) && !eventFilters.includes(filter.id)) {
                              heading = <div key="People-heading" className=" text-xs" style={{ color: "var(--secondary-text-color)" }}>People</div>;
                              peopleRendered = true;
                            }
                          }
                          const Component = getFilterComponent(filter.component);
                          if (!Component || (source === "tracker" && filter.id === "eventIds")) return null;
                          return (
                            <React.Fragment key={filter.id}>
                              {heading}
                              <div
                                className="flex items-center justify-between group relative transition-opacity duration-200"
                                style={{ opacity: filter.enabled ? 1 : 0.5 }}
                              >
                                <div className="w-full">
                                  <Component
                                    variant="accordion"
                                    disabled={!filter.enabled}
                                    filterName={filter.filterName}
                                  />
                                </div>
                                {!filter.enabled && (
                                  <Lock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text-color)]" />
                                )}
                              </div>
                            </React.Fragment>
                          );
                        });
                    })() : (
                      section.filters
                        .filter((filter: FilterItem) =>
                          !isMobile || filter.id !== "eventIds"
                        )
                        .map((filter: FilterItem) => {
                          const Component = getFilterComponent(filter.component);
                          if (
                            !Component ||
                            (source === "tracker" && filter.id === "eventIds")
                          )
                            return null;
                          return (
                            <div
                              key={filter.id}
                              className="flex items-center justify-between group relative transition-opacity duration-200"
                              style={{ opacity: filter.enabled ? 1 : 0.5 }}
                            >
                              <div className="w-full">
                                <Component
                                  variant="accordion"
                                  disabled={!filter.enabled}
                                  filterName={filter.filterName}
                                />
                              </div>
                              {!filter.enabled && (
                                <Lock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text-color)]" />
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              </>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
      {
        isPremiumModalOpen &&
        <div className="fixed">
        <PremiumModal/>
        </div>
      }
      </>
  );
};

export default FilterContent;