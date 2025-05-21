import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, FilterX, Lock } from "lucide-react";
import Image from "next/image";
import whrbotlogo from "@/public/whrbotlogo.svg";
import { useFilterContext } from "@/context/filterContext";
import { filters, getFilterComponent } from "@/components/search/filterUtils";
import { useIsMobile } from "@/hooks/useMediaQuery";

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
  type: "events" | "companies" | "people";
  filterCount: number;
  createTrackerHandler?: () => void;
  searchHandler: () => void;
}

const FilterContent = ({
  type,
  filterCount,
  createTrackerHandler,
  searchHandler,
}: FilterContentProps) => {
  const { localFilters, deleteMultipleLocalFilters } = useFilterContext();
  const isMobile = useIsMobile();

  return (
    <div className="flex-1">
      <div className="overflow-y-auto w-full mt-0 flex-1">
        <div className="p-3 bg-[var(--background-secondary-color)] ">
          {type === "events" && filterCount > 0 && (
            <div
              id="save-search-btn"
              className="mb-3 bg-[#F7F7FF] flex justify-between items-center dark:bg-accent/10 rounded-xl p-4 border border-border"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={whrbotlogo}
                  alt="WHR bot"
                  className="w-8 h-8 rounded-full bg-background"
                />
                <div className="text-sm font-medium text-foreground">
                  Save this search
                </div>
              </div>
              {createTrackerHandler && (
                <div className=" flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={createTrackerHandler}
                    className="h-8"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          )}
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
                <AccordionTrigger id={section.id} className="hover:no-underline py-3 px-4 transition-all duration-200 [&[data-state=open]]:bg-muted">
                  <div className="text-sm flex gap-2 items-center uppercase font-medium">
                    <Filter className="w-4 h-4" />
                    {section.label}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 border-t pt-4 mt-1">
                    {section.filters
                      .filter(
                        (filter: FilterItem) =>
                          !isMobile || filter.id !== "eventIds"
                      )
                      .map((filter: FilterItem) => {
                        const Component = getFilterComponent(filter.component);
                        if (!Component) return null;

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
