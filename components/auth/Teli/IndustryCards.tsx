import { industryData } from "@/data/onboardingDropdownsData";
import { TeliIndustry } from "@/types/onboarding";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Card = ({
  industry,
  activeIndustry,
  hasSubIndustries,
  handleIndustry,
  handleSubIndustry,
}: {
  industry: TeliIndustry;
  activeIndustry: string | undefined;
  hasSubIndustries: boolean | undefined;
  handleIndustry: (industry: string) => void;
  handleSubIndustry: (industry: string) => void;
}) => {
  const { name, slug, image } = industry;

  return (
    <li
      className={`shadow-[1.26px_2.53px_7.59px_0px_rgba(237,235,235,0.2)] relative flex flex-col gap-2 items-center justify-between p-4 border bg-white w-36 h-24 rounded-lg cursor-pointer ${
        activeIndustry === slug ? "border-primary" : "border-[#E6E6E6]"
      } hover:border-primary`}
      onClick={
        !hasSubIndustries
          ? () => handleIndustry(slug)
          : () => handleSubIndustry(slug)
      }
    >
      <Image
        className="w-8 h-8 aspect-square"
        src={image ?? ""}
        width={"32"}
        height={"32"}
        alt={"Industry Icon"}
      />
      <p className="text-[var(--tertiary-text-color)] text-center text-xs font-medium">
        {name}
      </p>
      {activeIndustry === slug && (
        <Checkbox
          checked={activeIndustry === slug}
          className="absolute top-2 right-2 rounded-full"
        />
      )}
    </li>
  );
};

const ActiveCard = ({
  selectedIndustry,
  handleBackButton,
}: {
  selectedIndustry: TeliIndustry;
  handleBackButton: () => void;
}) => {
  const { name, image } = selectedIndustry;
  return (
    <div className="flex">
      <ArrowLeft
        className="text-primary cursor-pointer"
        color="#6750a4"
        onClick={handleBackButton}
      />
      <div
        className={`relative flex flex-col gap-2 items-center justify-between p-4 mb-6 bg-white w-36 h-24 rounded-lg border border-primary mx-auto`}
      >
        <Image
          className="w-8 h-8 aspect-square"
          src={image ?? ""}
          width={"32"}
          height={"32"}
          alt={"Industry Icon"}
        />
        <p className="text-[var(--tertiary-text-color)] text-xs text-center font-medium">
          {name}
        </p>
        <Checkbox checked className="absolute top-2 right-2 rounded-full" />
      </div>
    </div>
  );
};

const IndustryCards = ({
  activeIndustry,
  activeSubIndustry,
  selectedIndustry,
  hasSubIndustries,
  handleIndustry,
  handleSubIndustry,
  handleBackButton,
}: {
  activeIndustry: string;
  activeSubIndustry: string;
  selectedIndustry: TeliIndustry | undefined;
  hasSubIndustries: boolean | undefined;
  handleIndustry: (industry: string) => void;
  handleSubIndustry: (subIndustry: string) => void;
  handleBackButton: () => void;
}) => {
  return (
    <div className="max-w-5xl self-center">
      {hasSubIndustries && selectedIndustry && (
        <ActiveCard
          selectedIndustry={selectedIndustry}
          handleBackButton={handleBackButton}
        />
      )}
      {hasSubIndustries && selectedIndustry && (
        <p className="text-[var(--secondary-text-color)] text-center font-semibold my-6">
          Choose a relevant Sub Industry
        </p>
      )}
      <ul className="flex flex-wrap justify-center gap-4">
        {!hasSubIndustries &&
          industryData.map((industry) => (
            <Card
              key={industry.slug}
              activeIndustry={activeIndustry}
              industry={industry}
              hasSubIndustries={hasSubIndustries}
              handleIndustry={handleIndustry}
              handleSubIndustry={handleSubIndustry}
            />
          ))}
        {hasSubIndustries &&
          selectedIndustry &&
          selectedIndustry.subIndustries?.map((subIndustry) => (
            <Card
              key={subIndustry.slug}
              activeIndustry={activeSubIndustry}
              industry={subIndustry}
              hasSubIndustries={hasSubIndustries}
              handleIndustry={handleIndustry}
              handleSubIndustry={handleSubIndustry}
            />
          ))}
      </ul>
    </div>
  );
};

export default IndustryCards;
