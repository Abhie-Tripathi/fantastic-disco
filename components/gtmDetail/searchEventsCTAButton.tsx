"use client";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Event } from "@/types/events";
import { useRouter } from "next/navigation";

interface Props {
  categories: Event["basic"]["categories"];
  format: Event["basic"]["format"];
  eventLocation: Event["basic"]["eventLocation"];
}

const SearchEventsCTAButton = ({
  categories,
  format,
  eventLocation,
}: Props) => {
  const router = useRouter();
  const { enabledFilters } = useFilterContext();
  const params = new URLSearchParams();

  const generateSearchEventsParams = (): string => {
    const enabledCategories =
      enabledFilters &&
      enabledFilters.eventCategory &&
      enabledFilters.eventCategory.enabledValue &&
      enabledFilters.eventCategory.enabledValue.length > 0
        ? enabledFilters.eventCategory.enabledValue
            .map((category) => category.slug)
            .join(",")
        : categories && categories.length > 0
        ? (() => {
            const groupedCategories = categories.map(
              (category) => category.slug
            );
            return groupedCategories.length > 0
              ? groupedCategories
                  .slice(0, 2)
                  .map((category) => category)
                  .join(",")
              : null;
          })()
        : null;

    const locationIds =
      (format === "offline" || format === "in_person" || format === "hybrid") && eventLocation
        ? eventLocation?.country?.id ||
          eventLocation?.state?.id ||
          eventLocation?.city?.id ||
          eventLocation?.venue?.id ||
          null
        : null;

    enabledCategories && params.set("categories", enabledCategories);
    locationIds && params.set("locationIds", locationIds);

    return params.toString();
  };

  return (
    <div className="flex items-center justify-between bg-[#F6F6FF] dark:bg-[#2E2E2E] border border-[#E6E6F9] dark:border-[#2E2E2E] px-4 py-2 rounded-sm">
      <p className="text-var(--primary-text-color) text-sm">
        Start searching similar events
      </p>
      <Button
        className="w-fit max-lg:shadow-none max-lg:font-medium"
        onClick={() =>
          router.push(`/internal/search/events?${generateSearchEventsParams()}`)
        }
      >
        Search Events
      </Button>
    </div>
  );
};

export default SearchEventsCTAButton;
