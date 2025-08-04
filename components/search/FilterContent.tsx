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
import { Filter, Lock, Unlock } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import PremiumModal from "../premium-modal";
import PaymentSuccessModal from "@/app/components/payment/successModal";
import { useAuthContext } from "@/context";
import { MembershipPlan } from "@/data/membershipPlans";
import { basicFilters, advancedFilter, countFilters } from "@/constants/filters";
import { Switch } from "@/components/ui/switch";
import { isEventeli } from "@/config";

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
  group?: string; // Added group property
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
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false)
  const {membershipData} = useAuthContext()
  const {enabledFilters} = useFilterContext()
  const isRestriction = Object.keys(enabledFilters?.filter || {}).length > 0
  const { localFilters, setMultipleLocalFilters } = useFilterContext();
  const isPremium = !!membershipData && membershipData.membership != null && membershipData.membership > MembershipPlan.Freemium;
  const isFreemium = !!membershipData && membershipData.membership != null && membershipData.membership === MembershipPlan.Freemium;
  const isMobile = useIsMobile();

  const totalFilterCount = useMemo(() => {
    const allFilterKeys = [...basicFilters, ...advancedFilter];
    return countFilters(localFilters, allFilterKeys);
  }, [localFilters]);

  const basicFilterCount = useMemo(() => {
    return countFilters(localFilters, basicFilters);
  }, [localFilters]);

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
            defaultValue={
              type === "events"
                ? ["basic-filters", "advanced-details"]
                : [filters[type][0]?.id]
            }
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
                  <div className="text-sm flex gap-2 items-center w-full">
                    {/* Remove Filter icon for both Basic and Advanced */}
                    <span 
                      className={isPremium && ["Advanced", "Insights & Scores", "Audience Intel"].includes(section.label) ? "bg-clip-text text-transparent capitalize" : ""}
                      style={isPremium && ["Advanced", "Insights & Scores", "Audience Intel"].includes(section.label) ? {
                        background: "linear-gradient(96.48deg, #F3B28E 14.76%, #E579C6 36.95%, #AC75E5 71.57%, #AEBFFF 99.98%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      } : {}}
                    >
                      {section.label}
                    </span>
  
                    {/* End Advanced Toggle */}
                    {(["Advanced"].includes(section.label) && (totalFilterCount - basicFilterCount) > 0) &&
                      <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                        {totalFilterCount - basicFilterCount}
                      </span>}
                    {(["Basic"].includes(section.label) && basicFilterCount > 0) &&
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                        {basicFilterCount}
                      </span>}
                    {isPremium &&  ["Advanced", "Insights & Scores", "Audience Intel"].includes(section.label) && <span className="flex items-center px-2 border bg-background capitalize rounded-xl font-normal text-xs">
                      <Unlock className="w-3 h-3 mr-1"/>
                      Premium</span>}
                    {["Advanced", "Insights & Scores", "Audience Intel"].includes(section.label)&& isFreemium  && (
                      <RainbowButton size="sm"  className="h-6 rounded-sm" onClick={()=>setPremiumModalOpen(true)}>Premium</RainbowButton>
                    )}
                     {/* Advanced Toggle */}
                     {section.id === "advanced-details" && !isRestriction && (
                      <Switch
                        className="ml-auto mr-[13px]"
                        checked={
                          advancedFilter.some(key =>
                            localFilters[key as keyof typeof localFilters] &&
                            localFilters[key as keyof typeof localFilters] !== "" &&
                            localFilters[key as keyof typeof localFilters] !== "[]"
                          ) ||
                          (typeof localFilters.show !== "undefined" && localFilters.show !== "" && localFilters.show !== "[]" && localFilters.show !== "rating")
                        }
                                                 onCheckedChange={checked => {
                           if (!checked) {
                             // Clear all advanced filters
                             let cleared = Object.fromEntries(advancedFilter.map(key => [key, ""]));
                             // Preserve rating if it exists in current show
                             const currentShow = localFilters.show || "";
                             if (currentShow.includes("rating")) {
                               cleared = {...cleared, show: "rating"};
                             } else {
                               cleared = {...cleared, show: ""};
                             }
                             setMultipleLocalFilters(cleared);
                           } else {
                             // Set show value based on isEventeli condition
                             let showValue = isEventeli 
                               ? "branded,series,forecasted,frequency,estimatedExhibitors,scores,economicImpact,rankings"
                               : "branded,series,forecasted,frequency,estimatedExhibitors,audienceZone,rankings";
                             
                             // Preserve rating if it exists in current show
                             const currentShow = localFilters.show || "";
                             if (currentShow.includes("rating")) {
                               showValue = showValue + ",rating";
                             }
                             
                             setMultipleLocalFilters({ show: showValue });
                           }
                         }}
                        disabled={section.filters.every(f => !f.enabled)}
                        aria-label="Enable/Disable all advanced filters"
                        onClick={e => e.stopPropagation()}
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div
                    className="space-y-3 pt-2"
                    ref={refs?.advanceFilterRef}
                  >
                    {type === "events" && section.id === "advanced-details" ? (() => {
                      // Group filters by 'group' property
                      const grouped = section.filters.reduce((acc: any, filter: FilterItem) => {
                        const group = filter.group || "Other";
                        if (!acc[group]) acc[group] = [];
                        acc[group].push(filter);
                        return acc;
                      }, {});
                      return Object.entries(grouped).map(([groupName, filters]) => (
                        <React.Fragment key={groupName}>
                          <div className="text-xs text-muted-foreground" style={{marginBottom: "-6px"}}>{groupName}</div>
                          {(filters as FilterItem[]).map((filter) => {
                            const Component = getFilterComponent(filter.component);
                            if (!Component || (source === "tracker" && filter.id === "eventIds")) return null;
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
                          })}
                        </React.Fragment>
                      ));
                    })() : type === "companies" || type === "people" ? (() => {
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
        <PremiumModal open={isPremiumModalOpen} onOpenChange={setPremiumModalOpen}/>
        {/* <PaymentSuccessModal isSuccess={true} membership={40} onOpenChange={()=>{}} open={true}/> */}
      </>
  );
};

export default FilterContent;