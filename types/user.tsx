// export interface UserResponse {
//   id: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   token?: string;
//   profilePicture: string | null;
//   companyId?: string | null;
//   isVerified?: boolean;
//   role?: string | null;
// }

import { PrimaryLocation } from "./auth/user";
import { NominatimSearchResult } from "./nominatim";

export interface UserResponse {
  id: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  primaryLocation: PrimaryLocation;
  phoneNumber: string | null;
  imageUrl: string | null;
  industry: string | null;
  subIndustry: string | null;
  category: string | null;
  designation: string | null;
  department: string | null;
  companyId?: string;
  userLocation?: UserLocation;
}

export type UserLocation = Location | NominatimSearchResult;

export interface MembershipData {
  membership: number | null;
  endDate: string | null;
}
