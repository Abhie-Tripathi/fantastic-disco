import { Location } from "../locations";
import { SaveLocationDTO } from "../locations/savedLocationsInsights";

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string | null;
  phoneNumber: string;
  currentOnboardingState: string;
  imageUri: string | null;
  primaryLocation: PrimaryLocation;
  cityId: string;
  token: string;
  industry: string;
  subIndustry: string;
  userLocation?: UserLocation;
}

export interface VerifyOTP {
  email: string;
  otp: string;
}

export type PrimaryLocation = LOCATION_ID | GEO_JSON;
export type UserLocation = Location | any;
export type LocationType = "LOCATION_ID" | "GEO_JSON";

export interface LOCATION_ID {
  locationId: string;
  locationType: "LOCATION_ID";
}

export interface GEO_JSON extends Pick<SaveLocationDTO, "geoJson"> {
  locationType: "GEO_JSON";
}
