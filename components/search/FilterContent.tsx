import { filters, getFilterComponent } from "@/components/search/filterUtils";
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
}

const FilterContent = ({
  source,
  type,
  filterCount,
  createTrackerHandler,
  searchHandler,
  closeHandler,
  refs,
}: FilterContentProps) => {
  const { localFilters, deleteMultipleLocalFilters } = useFilterContext();
  const isMobile = useIsMobile();

  return (
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
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div
                    className="space-y-4 border-t pt-4 mt-1"
                    ref={refs?.advanceFilterRef}
                  >
                    {section.filters
                      .filter(
                        (filter: FilterItem) =>
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
                      })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;
