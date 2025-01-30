import { industryData } from "@/data/onboarding";
import { Industry } from "@/types/onboarding";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

const Card = ({
  industry,
  activeIndustry,
  handleIndustry,
}: {
  industry: Industry;
  activeIndustry: string | undefined;
  handleIndustry: (industry: string) => void;
}) => {
  const { name, slug, image } = industry;

  return (
    <li
      className={`shadow-[1.26px_2.53px_7.59px_0px_rgba(237,235,235,0.2)] relative flex flex-col gap-2 items-center justify-center p-4 border  bg-white w-36 h-24 rounded-lg cursor-pointer ${
        activeIndustry === slug ? "border-primary" : "border-[#E6E6E6]"
      } hover:border-primary`}
      onClick={() => handleIndustry(slug)}
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

const IndustryCards = ({
  activeIndustry,
  handleIndustry,
}: {
  activeIndustry: string;
  handleIndustry: (industry: string) => void;
}) => {
  return (
    <div className="max-w-6xl self-center">
      <ul className="flex flex-wrap justify-center gap-4">
        {industryData.map((industry) => (
          <Card
            key={industry.slug}
            activeIndustry={activeIndustry}
            industry={industry}
            handleIndustry={handleIndustry}
          />
        ))}
      </ul>
    </div>
  );
};

export default IndustryCards;
