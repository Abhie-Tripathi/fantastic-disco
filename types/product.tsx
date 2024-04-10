export interface ProductResponse {
    id: string;
    name: string;
    email: string;
    url: string;
    userAadded: string;
    imageId: string;
    publishStatus: string | null;
    productStatus: string | null;
    platformType: string | null;
    productFormat: string | null;
    shortDescription: string | null;
    description: string | null;
    twitterUrl: string | null;
    linkedinUrl: string | null;
    countryOfOrigin: string | null;
    yearOfLaunch: number | null;
    employees: keyof typeof EmployeeCount;
    companyName: string;
    rating: number;
    _count: {
      upvotes: number;
      reviews: number;
    };
    topics: {
      name: string;
      slug: string;
    }[];
  
    createdAt: Date;
    updatedAt: Date;
    isUpvoted: boolean;
  }
  
  export const EmployeeCount = {
    RANGE_0_TO_10: "0-10",
    RANGE_10_TO_50: "10-50",
    RANGE_50_TO_100: "50-100",
    RANGE_100_TO_250: "100-250",
    RANGE_250_TO_500: "250-500",
    RANGE_500_PLUS: "500+",
  } as const;
  
  export type ProductSuggestion = Pick<
    ProductResponse,
    "id" | "name" | "shortDescription" | "url"
  >;