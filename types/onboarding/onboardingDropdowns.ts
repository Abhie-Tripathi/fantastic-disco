export interface Industry {
  name: string;
  slug: string;
  type: "center" | "city";
  subCategory: boolean;
}

export interface OnboardingSelection {
  email: string;
  industry: Industry;
  subIndustry?: SubIndustry;
}

export interface SubIndustry extends Omit<Industry, "subIndustries"> {}
