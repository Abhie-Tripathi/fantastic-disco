import { StaticImageData } from "next/image";

export interface Industry {
  name: string;
  slug: string;
  image?: StaticImageData;
  type: "category" | "location";
  mappedSettingResearch: SettingResearchData[];
  subCategory: boolean;
}

export interface TeliIndustry {
  name: string;
  slug: string;
  image?: StaticImageData;
  radius?: number;
  unit?: "miles" | "kilometers";
  type: "center" | "city";
  subIndustries?: SubIndustry[];
}

export interface OnboardingSelection {
  email: string;
  industry: Industry;
  subIndustry?: SubIndustry;
}

export interface VerificationProps {
  params: {
    email: string;
    industry?: string;
    categories?: string[];
    path: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SettingResearchData {
  label: string;
  source: string;
  status: string;
  position: number;
}

export interface SettingsInterestData {
  data: SettingResearchData[];
  source: string;
}

export interface SubIndustry extends Omit<TeliIndustry, "subIndustries"> {}
