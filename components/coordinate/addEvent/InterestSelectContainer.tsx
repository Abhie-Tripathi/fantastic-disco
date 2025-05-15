"use client";
import React from "react";
import { AddEventFormState } from "@/types/Formstate";
import { useConfiguration } from "@/hooks/useConfiguration";

interface Props {
  handleChange: (field: keyof AddEventFormState, value: any) => void;
  formState: AddEventFormState;
  formTheme: string;
  heading: string;
  size: string;
  theme?: string;
  type: string;
}

const InterestSelectContainer = ({
  size,
  theme,
  type,
  handleChange,
  formState,
  formTheme,
  heading,
}: Props) => {
  const { interestConfiguration } = useConfiguration.interest();

  const handleSelection = (type: string) => {
    handleChange("participationType", type);
    handleChange("isEventParticipationEmpty", false);
  };

  const options =
    interestConfiguration?.interest?.map((option) => ({
      label: option.label,
      value: option.status,
    })) || [];

  return (
    <div>
      <div className="text-[var(--tertiary-text-color)] text-sm font-medium">
        {heading}
      </div>
      <div className="flex flex-wrap items-center gap-3 md:gap-6 pt-3">
        {options.map((option) => (
          <div
            key={option.value}
            className={`px-6 py-1.5 rounded-md border-2 border-[#E6E6E6] flex items-center gap-2 cursor-pointer hover:bg-accent transition-all duration-300 font-medium text-sm ${
              option.value === formState.participationType
                ? "border-primary text-primary"
                : ""
            }`}
            onClick={() => handleSelection(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestSelectContainer;
