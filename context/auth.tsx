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
import { SettingResearchData } from "@/types/onboarding";
import { useEventsService } from "@/services/eventsService";
import { getRestrictedUrl } from "@/utils/generateUrl";
import { GAEvent } from "@/utils/GAEvent";
import { endpoints } from "@/config/endpoints";
import { VerifyOTP } from "@/types/auth/user";

type authContextType = {
  user: UserResponse | null;
  error:
    | {
        response: string;
        status: number;
        message: string;
        name: string;
      }
    | null
    | undefined;
  isVerifiedToken: boolean;
  isLoading: boolean;
  signup: (user: SignUpDTO) => Promise<any>;
  signin: (user: TSignInFormSchema) => Promise<any>;
  setUser: Dispatch<SetStateAction<UserResponse | null>>;
  setError: (
    error:
      | (
          | {
              response: string;
              status: number;
              message: string;
              name: string;
            }
          | undefined
        )
      | null
  ) => void;
  signOut: () => void;
  generateOTP: (
    email: string,
    industry?: string,
    categories?: string,
    internalConfigSetBy?: string,
    flow?: string,
    type?: string
  ) => void;
  verifyOtp: (
    verifyOtpDTO: VerifyOTP,
    redirectTo?: string,
    settingsInterestData?: {
      data: SettingResearchData[];
      source: string;
    },
    internalConfigSetBy?: string
  ) => Promise<any>;
  verifyLoginOTP: (user: any, redirectTo?: string) => Promise<any>;
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
      | (
          | {
              response: string;
              status: number;
              message: string;
              name: string;
            }
          | undefined
        )
      | null
  ) => {},
  setUser: () => {},
  signOut: () => {},
  generateOTP: () => Promise.resolve(null),
  verifyOtp: () => Promise.resolve(null),
  verifyLoginOTP: () => Promise.resolve(null),
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
  const { request, error, isLoading, setError } = useApi<any>();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const { updateResearchData } = useProductSettingServices();
  const eventService = useEventsService();
  const [isVerifiedToken, setIsVerifiedToken] = useState(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const generateOTP = async (
    email: string,
    industry?: string | undefined | null,
    categories?: string | null,
    internalConfigSetBy?: string,
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
      ...(internalConfigSetBy && { internalConfigSetBy }),
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
        await generateOTP(
          userDto.email,
          userDto.industry,
          userDto.categories,
          data.internalConfigSetBy,
          "signup"
        );
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

  const signOut = () => {
    setUser(null);
    deleteLocalStorage();
    myFetch(endpoints.auth.logout, { method: "POST" }).then(() =>
      router.push("/signin")
    );
  };

  useEffect(() => {
    console.log(token);
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

  const verifyOtp = useCallback(
    async (
      verifyOtpDTO: VerifyOTP,
      redirectTo?: string,
      settingsInterestData?: { data: SettingResearchData[]; source: string },
      internalConfigSetBy?: string
    ) => {
      try {
        const result = await request<{ user: UserResponse }>(
          endpoints.auth.verifyOTP,
          {
            method: "POST",
            data: verifyOtpDTO,
          }
        );
        if (result) {
          if (!result.user.isVerified) {
            GAEvent(
              "Onboarding",
              "Onboarding",
              "Sign Up",
              "Verify OTP | Invalid Submitted"
            );
            setError({
              response: "Invalid Code",
              status: 400,
              message: "Invalid code entered",
              name: "InvalidCodeError",
            });
            return;
          }
          if (result.user.isVerified) {
            GAEvent(
              "Onboarding",
              "Onboarding",
              "Sign Up",
              "Verify OTP | Valid Submitted"
            );
            setUser(result.user);
            setLocalStorage(result.user);
            localStorage.removeItem("walkthroughCompleted");
            internalConfigSetBy === "internal" &&
              (await updateResearchData({ formData: settingsInterestData }));
            const restrictedData: any = await eventService.fetchEnabledFilters(
              "research"
            );
            const restrictedUrl = await getRestrictedUrl(
              redirectTo || "",
              restrictedData
            );
            router.push(restrictedUrl || "/");
          }
        }
      } catch (err) {
        console.error("OTP verification error:", err);
      }
    },
    [request, router]
  );

  const verifyLoginOTP = useCallback(
    async (dataToSend: VerifyOTP, redirectTo?: string) => {
      try {
        const url = baseUrl + "/auth/customer/verify-otp";
        const result = await request<{ user: UserResponse }>(url, {
          method: "POST",
          data: dataToSend,
        });
        if (result) {
          if (!result.user.isVerified) {
            GAEvent(
              "Onboarding",
              "Onboarding",
              "Sign In",
              "Verify OTP | Invalid Submitted"
            );
            setError({
              response: "Invalid Code",
              status: 400,
              message: "Invalid code entered",
              name: "InvalidCodeError",
            });
          }
          if (result.user.isVerified) {
            GAEvent(
              "Onboarding",
              "Onboarding",
              "Sign In",
              "Verify OTP | Valid Submitted"
            );
            setUser(result.user);
            setLocalStorage(result.user);
            localStorage.setItem(
              "walkthroughCompleted",
              JSON.stringify(["research"])
            );
            router.push(redirectTo || "/internal");
            return result.user;
          }
        }
      } catch (err) {
        console.log("OTP verification error:", err);
        GAEvent(
          "Onboarding",
          "Onboarding",
          "Sign In",
          "Verify OTP | Invalid Submitted"
        );
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
    verifyLoginOTP,
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
