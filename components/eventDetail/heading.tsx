import { InformationFill } from "geist-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export const Heading = ({
  tooltipDescription,
  heading,
  scrollSection,
}: {
  tooltipDescription?: string;
  heading: string;
  scrollSection?: string;
}) => {
  return (
    <div
      className={`flex items-center gap-4 bg-[#FAFAFA] py-3 px-4 font-bold dark:bg-[#292929] ${scrollSection}`}
    >
      {heading}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <InformationFill
                color="#666666"
                width="12px"
                height="12px"
                className="cursor-pointe"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent className="w-60 tooltip-content-styles">
            <p className="font-medium text-[var(--secondary-text-color)]">
              {tooltipDescription}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
