"use client";
import { isEventeli } from "@/config";
import { endpoints } from "@/config/endpoints";
import { baseUrl } from "@/constants";
import { sessionKeys } from "@/data/onboarding";
import { useApi } from "@/hooks/useApi";
import { useEventsService } from "@/services/eventsService";
import { useLocationService } from "@/services/locationService";
import { useProfileServices } from "@/services/profileService";
import {
  AuthFlow,
  PrimaryLocation,
  UserLocation,
  VerifyOTP,
} from "@/types/auth/user";
import { SettingsInterestData } from "@/types/onboarding";
import { GAEvent } from "@/utils/GAEvent";
import { getRestrictedUrl } from "@/utils/generateUrl";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { signOut as signOutSSO } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { SignUpDTO, TSignInFormSchema } from "../types";
import { UserResponse } from "../types/user";

type authContextType = {
  user: UserResponse | null;
  error:
    | { issues: any[]; statusCode: number; message: string }
    | null
    | undefined;
  isVerifiedToken: boolean;
  isLoading: boolean;
  userAuthenticated: boolean;
  signup: (user: SignUpDTO) => Promise<any>;
  signin: (user: TSignInFormSchema) => Promise<any>;
  setUser: Dispatch<SetStateAction<UserResponse | null>>;
  setError: (
    error:
      | ({ issues: any[]; statusCode: number; message: string } | undefined)
      | null
  ) => void;
  signOut: () => void;
  signInSSO: () => Promise<any>;
  signUpSSO10times: (
    token: string,
    userId: number,
    redirectPath: string
  ) => Promise<any>;
  updateIndustry: (formData: any) => Promise<any>;
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
  isAuthenticating: boolean;
  showOTPMessage: boolean;
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
  userAuthenticated: false,
  signup: () => Promise.resolve(null),
  signin: () => Promise.resolve(null),
  setError: (
    error:
      | ({ issues: any[]; statusCode: number; message: string } | undefined)
      | null
  ) => {},
  setUser: () => {},
  signOut: () => {},
  signInSSO: () => Promise.resolve(null),
  signUpSSO10times: () => Promise.resolve(null),
  updateIndustry: () => Promise.resolve(null),
  generateOTP: () => Promise.resolve(null),
  verifyOtp: () => Promise.resolve(null),
  setIsProfileUpdated: () => {},
  setProfilePic: () => {},
  isAuthenticating: false,
  showOTPMessage: false,
};

export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);

export const AuthContextProvider = ({ children }: any) => {
  const router = useRouter();
  const pathName = usePathname();
  const { updateMyProfileData } = useProfileServices();
  const [user, setUser] = useState<UserResponse | null>(null);
  const { getLocationName } = useLocationService();
  const [showOTPMessage, setShowOTPMessage] = useState(false);
  const { request, error, isLoading, setError } = useApi<any>();
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const eventService = useEventsService();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerifiedToken, setIsVerifiedToken] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const categories = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const sessionCategories = sessionStorage.getItem("categories");
      return sessionCategories ? JSON.parse(sessionCategories) : null;
    } catch (error) {
      console.log("Failed to parse sessionStorage categories", error);
      return null;
    }
  }, [user]);

  const formatDateForFilter = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const urlParams = useMemo(() => {
    const params = new URLSearchParams();
    const currentDate = new Date();
    const startDate = formatDateForFilter(startOfMonth(currentDate));
    const endDate = formatDateForFilter(endOfMonth(currentDate));

    params.set("view", "map");
    params.set("status", "active,cancelled,postponed");
    params.set("active_gte", startDate);
    params.set("active_lte", endDate);
    params.set("locationIds", "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef");

    if (categories && categories.length > 0) {
      params.set("categories", categories);
    }
    return params;
  }, [categories]);

  const fetchUserData = async () => {
    try {
      const userData = await request<UserResponse>(endpoints.auth.me);
      return userData;
    } catch (error) {
      console.log("Error and setting user undefined");
      return undefined;
    }
  };

  const newcheckAuth = useCallback(async () => {
    const userData = await fetchUserData();
    if (!userData) {
      setUser(null);
      return;
    }
    setUser(userData);
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
      await request(url, {
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
        await request(endpoints.auth.signUp, {
          method: "POST",
          data: { ...userDto },
        });
        setShowOTPMessage(true);
        router.push(`/verify-otp?email=${userDto.email}`);
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
        setShowOTPMessage(true);
        router.push(`/verify-otp?email=${userDto.email}`);
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
    signOutSSO({ callbackUrl: "/signin" });
    // router.push("/signin");
  }, [request, router]);

  const signInSSO = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      const origin = window.location.origin;
      const res = await fetch(`${origin}/api/auth/session`);
      const session = await res.json();
      const redirectPath = sessionStorage.getItem("redirect");
      const result = await request<{ user: UserResponse }>(
        endpoints.auth.ssoSignIn(session.user.provider),
        {
          method: "POST",
          data: { accessToken: session.user.accessToken },
        }
      );
      if (result) {
        if (result.user) {
          window.localStorage.setItem("user", JSON.stringify(result.user));
          setUser(result.user);
        }

        if (!result.user.isNewUser) {
          localStorage.setItem(
            "walkthroughCompleted",
            JSON.stringify(["research"])
          );
          sessionKeys.forEach((key) => sessionStorage.removeItem(key));
          router.push(redirectPath ? `/internal/${redirectPath}` : "/internal");
        } else {
          localStorage.removeItem("walkthroughCompleted");
          router.push("/signup");
        }
      }
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setTimeout(() => {
        setIsAuthenticating(false);
      }, 2500);
    }
  }, [request, router]);

  const signUpSSO10times = useCallback(
    async (token: string, userId: number, redirectPath: string) => {
      try {
        const formData = { token, userId };

        const result = await request<{ user: UserResponse }>(
          `${endpoints.auth.ssoSignIn("10times")}`,
          {
            method: "POST",
            data: formData,
          }
        );

        if (result) {
          setUserAuthenticated(true);

          if (result.user) {
            window.localStorage.setItem("user", JSON.stringify(result.user));
            setUser(result.user);
          }

          if (!result.user.isNewUser) {
            localStorage.setItem(
              "walkthroughCompleted",
              JSON.stringify(["research"])
            );
            if (redirectPath) router.push(redirectPath);
            else router.push("/internal/search/events");
          } else {
            localStorage.removeItem("walkthroughCompleted");
            router.push("/signup");
          }
        }
      } catch (error) {
        console.error("Verification failed:", error);
        router.push("https://whr.ai/gtm");
      }
    },
    [request, router]
  );

  const updateIndustry = useCallback(
    async (formData: any) => {
      try {
        delete formData.email;
        const response = (await updateMyProfileData({ formData })) as {
          user: UserResponse;
        };
        const redirectPath = sessionStorage.getItem("redirect");
        window.localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        const categories = sessionStorage.getItem("categories");
        const modifiedParams = new URLSearchParams(urlParams);
        if (categories) {
          modifiedParams.set("categories", JSON.parse(categories));
        }
        if (isEventeli) {
          router.push(`/location`);
        } else {
          router.push(
            redirectPath
              ? `/internal/${redirectPath}`
              : `/internal/search/events?${modifiedParams.toString()}`
          );
        }
      } catch (error) {
        console.log("Error", error);
      }
    },
    [request, router]
  );

  const setLocalStorage = (user?: UserResponse | newUserResponse) => {
    window.localStorage.setItem("user", JSON.stringify(user));
  };

  const deleteLocalStorage = (user?: UserResponse) => {
    window.localStorage.removeItem("user");
  };

  const signInActions = (redirectTo: string | undefined) => {
    localStorage.setItem("walkthroughCompleted", JSON.stringify(["research"]));
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    router.push(redirectTo || "/internal");
  };

  const signUpActions = async (redirectTo: string | undefined) => {
    localStorage.removeItem("walkthroughCompleted");
    const restrictedData: any = await eventService.fetchEnabledFilters(
      "filter"
    );
    const restrictedUrl = getRestrictedUrl(redirectTo || "", restrictedData);
    const duplicateSessionKeys = sessionKeys.filter(
      (key) => key !== "industry" && key !== "subIndustry" && key !== "redirect"
    );
    if (isEventeli) {
      duplicateSessionKeys.forEach((key) => sessionStorage.removeItem(key));
    } else {
      sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    }
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
    }
  }, [pathName, router, isProfileUpdated]);

  const value = {
    user,
    error,
    signup,
    isVerifiedToken,
    userAuthenticated,
    signin,
    signOut,
    signInSSO,
    signUpSSO10times,
    updateIndustry,
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
    isAuthenticating,
    showOTPMessage,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
