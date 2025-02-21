"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authEndpoints, baseUrl } from "@/constants";
import { UserResponse } from "../types/user";
import { SignUpResponse, SignInResponse } from "../types";
import { TSignInFormSchema, SignUpDTO } from "../types";
import { myFetch } from "@/utils/myFetch";
import { usePathname, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useProductSettingServices } from "@/services/settingservices/productService";
import { SettingResearchData, SettingsInterestData } from "@/types/onboarding";
import { useEventsService } from "@/services/eventsService";
import { getRestrictedUrl } from "@/utils/generateUrl";
import { GAEvent } from "@/utils/GAEvent";
import { endpoints } from "@/config/endpoints";
import {
  AuthFlow,
  PrimaryLocation,
  UserLocation,
  VerifyOTP,
} from "@/types/auth/user";
import { sessionKeys } from "@/data/onboarding";
import { useLocationService } from "@/services/locationService";

type authContextType = {
  user: UserResponse | null;
  error:
    | { issues: any[]; statusCode: number; message: string }
    | null
    | undefined;
  isVerifiedToken: boolean;
  isLoading: boolean;
  signup: (user: SignUpDTO) => Promise<any>;
  signin: (user: TSignInFormSchema) => Promise<any>;
  setUser: Dispatch<SetStateAction<UserResponse | null>>;
  setError: (
    error:
      | ({ issues: any[]; statusCode: number; message: string } | undefined)
      | null
  ) => void;
  signOut: () => void;
  generateOTP: (
    email: string,
    industry?: string,
    categories?: string,
    flow?: string,
    type?: string
  ) => void;
  verifyOtp: (
    verifyOtpDTO: VerifyOTP,
    flow: "signIn" | "signUp",
    redirectTo?: string,
    settingsInterestData?: SettingsInterestData
  ) => Promise<any>;
  setIsProfileUpdated: Dispatch<SetStateAction<boolean>>;
  setProfilePic: any;
};
interface newUserResponse {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    token?: string;
    profilePicture: string | null;
  };
}
const authContextDefaultValues: authContextType = {
  user: null,
  error: null,
  isLoading: false,
  isVerifiedToken: false,
  signup: () => Promise.resolve(null),
  signin: () => Promise.resolve(null),
  setError: (
    error:
      | ({ issues: any[]; statusCode: number; message: string } | undefined)
      | null
  ) => {},
  setUser: () => {},
  signOut: () => {},
  generateOTP: () => Promise.resolve(null),
  verifyOtp: () => Promise.resolve(null),
  setIsProfileUpdated: () => {},
  setProfilePic: () => {},
};

export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);

export const AuthContextProvider = ({ children }: any) => {
  const router = useRouter();
  const pathName = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const { getLocationName } = useLocationService();
  const { request, error, isLoading, setError } = useApi<any>();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const { updateResearchData } = useProductSettingServices();
  const eventService = useEventsService();
  const [isVerifiedToken, setIsVerifiedToken] = useState(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const fetchUserData = async () => {
    try {
      const userData = await request<UserResponse>(endpoints.auth.me);
      return userData;
    } catch (error) {
      console.log("Error and setting user undefined");
      return undefined;
    }
  };

  const fetchUserLocation = async (primaryLocation: PrimaryLocation) => {
    try {
      if (
        primaryLocation &&
        primaryLocation.locationType === "LOCATION_ID" &&
        primaryLocation.locationId
      ) {
        const userLocation = await request<{
          formattedLocations: Location[] | undefined;
        }>(`${endpoints.locations}?locationIds=${primaryLocation.locationId}`);
        return userLocation?.formattedLocations?.[0];
      }

      if (
        primaryLocation &&
        primaryLocation.locationType === "GEO_JSON" &&
        primaryLocation.geoJson
      ) {
        const coordinates = primaryLocation.geoJson.geometry?.coordinates || [];
        const lat = coordinates[0];
        const lng = coordinates[1];
        const userLocation = await getLocationName(lat, lng);
        return userLocation;
      }
    } catch (error) {
      console.error("Error fetching user location:", error);
      return undefined;
    }
  };

  const newcheckAuth = useCallback(async () => {
    const userData = await fetchUserData();
    if (!userData) {
      setUser(null);
      return;
    }
    const userLocation = await fetchUserLocation(userData?.primaryLocation);
    setUser({ ...userData, userLocation: userLocation as UserLocation });
  }, [request]);

  const generateOTP = async (
    email: string,
    industry?: string | undefined | null,
    categories?: string | null,
    flow?: string | null,
    type?: string | null
  ) => {
    const url = `${baseUrl}/auth/customer/verify/generate`;
    const dataToSend = {
      email: email.trim(),
    };
    const queryParams = new URLSearchParams({
      email: email.trim(),
      ...(industry && { industry }),
      ...(flow && { flow }),
    });
    try {
      const data = await request(url, {
        method: "POST",
        data: { ...dataToSend },
      });
      if (flow === "signup") {
        if (type === "resend") {
          GAEvent(
            "Onboarding",
            "Onboarding",
            "Sign Up",
            "Verify OTP | Resend OTP"
          );
        } else {
          GAEvent(
            "Onboarding",
            "Onboarding",
            "Sign Up",
            "Sign Up | Email Entered OTP Sent"
          );
        }
      } else {
        if (type === "resend") {
          GAEvent(
            "Onboarding",
            "Onboarding",
            "Sign In",
            "Verify OTP | Resend OTP"
          );
        } else {
          GAEvent(
            "Onboarding",
            "Onboarding",
            "Sign In",
            "Sign In | Email Entered OTP Sent"
          );
        }
      }
      router.push(`/verify-otp?${queryParams.toString()}`);
    } catch (err: any) {
      console.error("Cannot generate otp:", err);
      if (err?.status === 404)
        GAEvent(
          "Onboarding",
          "Onboarding",
          "Sign In",
          "Sign In | Email - No Account"
        );
      else
        GAEvent(
          "Onboarding",
          "Onboarding",
          "Sign In",
          "Sign In | Email Invalid"
        );
    }
  };

  const signup = useCallback(
    async (userDto: SignUpDTO) => {
      try {
        const data = await request(endpoints.auth.signUp, {
          method: "POST",
          data: { ...userDto },
        });
        router.push("/verify-otp");
      } catch (err: any) {
        console.error("Sign up error:", err);
        if (err?.status === 406) {
          GAEvent(
            "Onboarding",
            "Onboarding",
            "Sign Up",
            "Sign Up | Email - Non Business"
          );
        } else if (err?.status === 409) {
          GAEvent(
            "Onboarding",
            "Onboarding",
            "Sign Up",
            "Sign Up | Email Already Exists"
          );
        }
      }
    },
    [request, router]
  );

  const signin = useCallback(
    async (userDto: TSignInFormSchema) => {
      try {
        await request(endpoints.auth.signIn, {
          method: "POST",
          data: { ...userDto },
        });
        router.push("/verify-otp");
        // await generateOTP(userDto.email);
      } catch (err) {
        console.error("Sign in error:", err);
      }
    },
    [request, router]
  );

  const signOut = useCallback(async () => {
    setUser(null);
    deleteLocalStorage();
    localStorage.removeItem("walkthroughCompleted");
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    await request(endpoints.auth.logout, {
      method: "POST",
    });
    router.push("/signin");
  }, [request, router]);

  useEffect(() => {
    if (token && token.length > 0) {
      const verifyToken = async () => {
        const formData = {
          token: token,
          invite: true,
        };
        const url = `${baseUrl}/auth/customer/reset-password/page`;
        try {
          const { data, error } = await myFetch(url, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(data, error);
          if (error) {
            console.error("Error fetching data:", error);
            router.push("/signin");
          } else {
            const { id, firstname, lastname, email, role, profilePicture } =
              data.info;
            const user = {
              user: {
                id: id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,
                profilePicture: profilePicture,
              },
            };
            const userObject = {
              user: {
                id: id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,
                profilePicture: profilePicture,
              },
            };
            localStorage.setItem(
              "walkthroughCompleted",
              JSON.stringify(["research"])
            );
            setUser(data.info);
            setLocalStorage(userObject);
            setIsVerifiedToken(true);
          }
        } catch (err) {
          console.error("Fetch failed:", err);
          router.push("/signin");
        }
      };
      verifyToken();
    } else setIsVerifiedToken(true);
  }, []);

  const setLocalStorage = (user?: UserResponse | newUserResponse) => {
    window.localStorage.setItem("user", JSON.stringify(user));
  };

  const deleteLocalStorage = (user?: UserResponse) => {
    window.localStorage.removeItem("user");
  };

  const signInActions = (redirectTo: string | undefined) => {
    localStorage.setItem("walkthroughCompleted", JSON.stringify(["research"]));
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    // router.push(redirectTo || "/internal");
  };

  const signUpActions = async (redirectTo: string | undefined) => {
    localStorage.removeItem("walkthroughCompleted");
    const restrictedData: any = await eventService.fetchEnabledFilters(
      "filter"
    );
    const restrictedUrl = getRestrictedUrl(redirectTo || "", restrictedData);
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    router.push(restrictedUrl || "/");
  };

  const handleFlowAction = (flow: AuthFlow, redirectTo: string | undefined) => {
    if (flow === "signIn") {
      signInActions(redirectTo);
    } else {
      signUpActions(redirectTo);
    }
  };

  const verifyOtp = useCallback(
    async (verifyOtpDTO: VerifyOTP, flow: AuthFlow, redirectTo?: string) => {
      try {
        const result = await request<{ user: UserResponse }>(
          endpoints.auth.verifyOTP,
          {
            method: "POST",
            data: verifyOtpDTO,
          }
        );
        if (result) {
          if (!result.user) {
            GAEvent(
              "Onboarding",
              "Onboarding",
              "Sign Up",
              "Verify OTP | Invalid Submitted"
            );
            return;
          }
          if (result.user) {
            GAEvent(
              "Onboarding",
              "Onboarding",
              "Sign Up",
              "Verify OTP | Valid Submitted"
            );
            // setUser(result.user);
            await newcheckAuth();
            setLocalStorage(result.user);
            handleFlowAction(flow, redirectTo);
          }
        }
      } catch (err) {
        console.error("OTP verification error:", err);
      }
    },
    [request, router]
  );

  useEffect(() => {
    if (!user) {
      const userData = window.localStorage.getItem("user");
      userData && setUser(JSON.parse(userData));
    }
  }, [user]);

  useLayoutEffect(() => {
    const user = window.localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user).user);
    } else {
      const publicPaths = ["/signup", "/forgot-password", "/verify-otp"];

      const isPublicPath =
        publicPaths.includes(pathName) ||
        pathName.startsWith("/reset") ||
        (token && token.length > 0);

      if (!isPublicPath) {
        // router.push("/signin");
      }
    }
  }, [pathName, router, isProfileUpdated]);

  const value = {
    user,
    error,
    signup,
    isVerifiedToken,
    signin,
    signOut,
    setError,
    isLoading,
    setUser,
    generateOTP,
    verifyOtp,
    isProfileUpdated,
    setIsProfileUpdated,
    setProfilePic: (profilePic: string | null) => {
      if (user) {
        const updatedUser = {
          user: {
            ...user,
            profilePicture: profilePic,
          },
        };
        // setUser(updatedUser.user);
        // setLocalStorage(updatedUser);
      }
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
