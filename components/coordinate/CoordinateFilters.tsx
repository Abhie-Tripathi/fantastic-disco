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
// import { getFilterComponent } from "@/components/search/filterUtils";
import DateRangeSelector from "@/components/search/dateRange";
import InterestTypeSelector from "@/components/coordinate/interestType";
import UpvoteSelector from "@/components/coordinate/upvote";
import InterestStatusSelector from "@/components/coordinate/interestStatus";

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
  createTrackerHandler: () => void;
  searchHandler: () => void;
  coordinateActions: any;
  pipelineConfig: any;
}

const coordinateFilterData: FilterSection[] = [
  {
    id: "filters",
    label: "Filters",
    filters: [
      {
        id: "type",
        component: "InterestTypeSelector",
        filterName: "type",
        enabled: true,
      },

      {
        id: "status",
        component: "InterestStatusSelector",
        filterName: "status",
        enabled: true,
      },
      {
        id: "dateRange",
        component: "DateRangeSelector",
        enabled: true,
      },
      {
        id: "upvotedBy",
        component: "UpvoteSelector",
        filterName: "upvotedBy",
        enabled: true,
      },
    ],
  },
];

const CoordinateFilters = ({
  type,
  filterCount,
  createTrackerHandler,
  searchHandler,
  coordinateActions,
  pipelineConfig,
}: FilterContentProps) => {
  const { localFilters, deleteMultipleLocalFilters } = useFilterContext();

  return (
    <div className="flex-1">
      <div className="overflow-y-auto w-full mt-0 flex-1">
        <div className="p-3 bg-[var(--background-secondary-color)] ">
          <Accordion
            type="multiple"
            className="space-y-4"
            defaultValue={[coordinateFilterData[0]?.id]}
          >
            {coordinateFilterData.map((section: FilterSection) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-lg bg-background shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <AccordionTrigger className="hover:no-underline py-3 px-4 transition-all duration-200 [&[data-state=open]]:bg-muted">
                  <div className="text-sm flex gap-2 items-center uppercase font-medium">
                    <Filter className="w-4 h-4" />
                    {section.label}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 border-t pt-4 mt-1">
                    {section.filters.map((filter: FilterItem) => {
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
                              coordinateActions={coordinateActions}
                              pipelineConfig={pipelineConfig}
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

      <div className="w-full sticky bottom-0 bg-background z-10">
        <div className="p-4 pb-0 border-t bg-background/80 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              onClick={() => {
                deleteMultipleLocalFilters(Object.keys(localFilters) as any[]);
              }}
              disabled={filterCount === 0}
              className="text-xs text-[#6E6F89] hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
            >
              <FilterX className="w-3.5 h-3.5 mr-1" />
              Reset all filters
            </Button>
            <span className="text-xs text-[#6E6F89]">
              {filterCount} filters applied
            </span>
          </div>
          <Button onClick={searchHandler} className="w-full h-10">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoordinateFilters;

const components: { [key: string]: React.ComponentType<any> } = {
  DateRangeSelector,
  InterestTypeSelector,
  InterestStatusSelector,
  UpvoteSelector,
};

export const getFilterComponent = (componentName: string) => {
  return components[componentName];
};
