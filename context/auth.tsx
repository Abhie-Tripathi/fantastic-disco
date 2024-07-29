"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authEndpoints, baseUrl, headers } from "@/constants";
import { UserResponse } from "../types/user";
import { SignUpResponse, SignInResponse, TSignInWithOTPSchema } from "../types";
import { TSignInFormSchema, SignUpDTO } from "../types";
import { myFetch } from "@/utils/myFetch";
import { usePathname, useSearchParams } from "next/navigation";
import { routeModule } from "next/dist/build/templates/app-page";

type authContextType = {
  user: UserResponse | null;
  setUser: any;
  signup: (user: SignUpDTO) => Promise<any>;
  signin: (user: TSignInFormSchema) => Promise<any>;
  signOut: () => void;
  verifyOtp: (user: any) => Promise<any>;
  verifyLoginOTP: (user: any) => Promise<any>;
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
  setUser:null,
  signup: () => Promise.resolve(null),
  signin: () => Promise.resolve(null),
  signOut: () => {},
  verifyOtp: () => Promise.resolve(null),
  verifyLoginOTP: () => Promise.resolve(null),
  setIsProfileUpdated: () => {},
  setProfilePic: () => {},
};

export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);

export const AuthContextProvider = ({ children }: any) => {
  const pathName = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const router = useRouter();
  interface SignUp {
    data?: SignUpResponse;
    error?: any;
  }
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const signup = async (userDto: SignUpDTO) => {
    console.log(userDto);
    const url = baseUrl + authEndpoints.signup;
    const { error, data }: SignUp = await myFetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(userDto),
    });
    console.log("Data", data);

    console.log("Error", error);
    if (data && !error) {
      // setLocalStorage(data);
      // setUser(data);
    } else if (
      error &&
      error.status === 401 &&
      error.message === "Credentials incorrect"
    ) {
      setLoginError("Credentials incorrect");
    } else {
      setLoginError("Something went wrong");
    }
    return [{ data, error }];
  };
  interface SignIn {
    data?: SignInResponse;
    error?: any;
  }
  const [isVerifiedToken, setIsVerifiedToken] = useState(false);


  const signin = async (userDto: TSignInFormSchema) => {
    console.log("user_data_for_signin------------>", userDto);
    const url = baseUrl + authEndpoints.signin;
    console.log(url);
    const { error, data }: SignIn = await myFetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(userDto),
    });
    if (data) {
      console.log("data", data);
      setUser(data);
      setLocalStorage(data);
      return { data };
    }

    let emailError = null;
    let passwordError = null;

    if (error) {
      console.log(error);
      if (error.message.includes("password")) {
        passwordError = error.message;
        return { passwordError };
      }
      if (error.message.includes("email") || error.message) {
        emailError = error.message;
        return { emailError };
      }
    }

    return [];
  };

  const signOut = () => {
    setUser(null);
    deleteLocalStorage();
    router.push("/signin");
  };

  const setLocalStorage = (user?: UserResponse | newUserResponse) => {
    window.localStorage.setItem("user", JSON.stringify(user));
  };

  const deleteLocalStorage = (user?: UserResponse) => {
    window.localStorage.removeItem("user");
  };

  interface VerifyOTP {
    email: string;
    otpCode: string;
  }

  const verifyOtp = async (dataToSend: VerifyOTP) => {
    const url = baseUrl + "/auth/customer/verify";

    const { data, error } = await myFetch(url, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(data, error);

    if (data) {
      console.log(data);
      if (!data.user.isVerified) {
        return;
      }
      if (data.user.isVerified) {
        setUser(data);
        setLocalStorage(data);
      }
    }

    if (error) {
      console.log(error);
      return;
    }

    return data.user;
  };

  const verifyLoginOTP = async (dataToSend: VerifyOTP) => {
    const url = baseUrl + "/auth/customer/verify-otp";

    const { data, error } = await myFetch(url, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(data, error);

    if (data) {
      console.log(data);
      if (!data.user.isVerified) {
        return;
      }
      if (data.user.isVerified) {
        setUser(data);
        setLocalStorage(data);
      }
    }

    if (error) {
      console.log(error);
      return;
    }

    return data.user;
  };

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    console.log(user);
    if (user) {
      setUser(JSON.parse(user).user);
    }
  }, [isProfileUpdated]);

  useLayoutEffect(() => {
    const user = window.localStorage.getItem("user");
    console.log(user);

    if (user) {
      setUser(JSON.parse(user).user);
    } else {
      const publicPaths = ["/signup", "/forgot-password"];

      const isPublicPath =
        publicPaths.includes(pathName) ||
        pathName.startsWith("/reset") ||
        (token && token.length > 0);

      if (!isPublicPath) {
        router.push("/signin");
      }
    }
  }, [pathName, router, isProfileUpdated]);
  useLayoutEffect(() => {
    if (user) {
      const restrictedPaths = ["/signin", "/signup"];
      if (restrictedPaths.includes(pathName)) {
        router.replace("/internal");
      }
    }
  }, [user, pathName, router]);

  const value = {
    user,
    signup,
    signin,
    signOut,
    setUser,
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
        setUser(updatedUser.user);
        setLocalStorage(updatedUser);
      }
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};