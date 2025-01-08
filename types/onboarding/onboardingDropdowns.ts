import { StaticImageData } from "next/image";

export interface Industry {
  name: string;
  slug: string;
  image?: StaticImageData;
  type: "category" | "location";
  subCategory: boolean;
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

export interface SubIndustry extends Omit<Industry, "subIndustries"> {}
