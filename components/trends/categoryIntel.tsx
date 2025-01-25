import { format } from "date-fns";
import Text from "../new-ui/Text";
import PieChartComponent from "./pieChart";
import TestChartComponent from "./testChart";
import { useEffect, useState } from "react";
import SunburstChartComponent from "../eCharts/sunBurstChart";

interface IProps {
  location?: string;
  startingDate: string;
  endingDate: string;
  categoryIntel: any;
}

const CategoryIntel = ({
  location,
  startingDate,
  endingDate,
  categoryIntel,
}: IProps) => {
  const [subCategory, setSubCategory] = useState<any>({});
  const [activeCategory, setActiveCategory] = useState<string>("Social");

  useEffect(() => {
    if (categoryIntel) {
      const allSubCategories = {
        ...categoryIntel.Social,
      };
      setSubCategory(allSubCategories); // Set default subCategory to "All" (Social + Business)
    }
  }, [categoryIntel]); // This effect runs whenever categoryIntel changes

  return (
    <div className="flex flex-col gap-4">
      <Text size="large">
        Total number of events in the selected data range
      </Text>
      <div className="flex flex-row gap-8 justify-between">
        <div className="flex flex-col pb-4 px-8 rounded shadow-md border-[var(--neutral-light-color)] gap-8">
          <div className="flex flex-row gap-12">
            <div className="flex flex-col">
              <Text size="normal">Location</Text>
              {location && (
                <p className="font-semibold text-lg text-[var(--primary-color)]">
                  {location}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Text size="normal">Date Range</Text>
              {startingDate && endingDate && (
                <p className="font-semibold text-lg text-[var(--primary-color)]">{`${format(
                  new Date(startingDate),
                  "dd MMM"
                )}-${format(new Date(endingDate), "dd MMM")}`}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <Text size="large" color="secondary">
              No of Events
            </Text>
            <div className="border-t pt-8 mt-2">
              <TestChartComponent
                categoryIntel={categoryIntel}
                setSubCategory={setSubCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
            <div className="mt-4 flex flex-col justify-center border-[#FFDD8F] border bg-[#FFF6E6] py-4 px-6 rounded">
              <p className="m-0 text-sm">
                Click on any bar to see a detailed view of all categories
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1 items-center gap-8">
          <div className="flex flex-row w-fit gap-3 items-end py-4 px-6 border border-[var(--neutral-light-color)] bg-[var(--accent-color)] rounded">
            <Text size="normal">Showing</Text>
            <p className="text-lg text-[var(--primary-color)] font-bold">
              {activeCategory}
            </p>
          </div>
          <PieChartComponent
            subCategory={subCategory}
            activeCategory={activeCategory}
          />
          {/* <SunburstChartComponent /> */}
        </div>
      </div>
    </div>
  );
};

export default CategoryIntel;
