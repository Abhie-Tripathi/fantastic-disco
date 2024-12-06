"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { industryData } from "@/data/onboarding";

const IndustryDropdown = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  const handleChange = (slug: string) => {
    setSelected((prev) => (prev === slug ? "" : slug));
    setIsOpen(!isOpen);
  };

  const renderIndustries = () => {
    return (
      <ul className="flex flex-col gap-2">
        {industryData &&
          industryData.length > 0 &&
          industryData.map((industry) => (
            <li key={industry.slug} className="">
              <div key={industry.slug} className="flex items-center space-x-2">
                <Checkbox
                  className="rounded-none"
                  id={industry.slug}
                  value={industry.slug}
                  checked={selected === industry.slug}
                  onCheckedChange={() => handleChange(industry.slug)}
                />
                <label
                  htmlFor={industry.slug}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                >
                  {industry.name}
                </label>
              </div>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">
              {industryData.find((industry) => industry.slug === selected)
                ?.name || "Select an Industry"}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] max-w-2xl border rounded-md shadow-sm p-0"
        align="start"
      >
        <div className="p-4">{renderIndustries()}</div>
      </PopoverContent>
    </Popover>
  );
};

export default IndustryDropdown;
