"use client";
import { createContext, useContext, useLayoutEffect, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authEndpoints, baseUrl, headers } from "@/constants";
import { UserResponse } from "../types/user";
import { SignUpResponse, SignInResponse } from "../types";
import { TSignInFormSchema, SignUpDTO } from "../types";
import { myFetch } from "@/utils/myFetch";
import { usePathname, useSearchParams } from "next/navigation";

type authContextType = {
  user: UserResponse | null;
  signup: (user: SignUpDTO) => Promise<any>;
  signin: (user: TSignInFormSchema) => Promise<any>;
  signOut: () => void;
  verifyOtp: (user: any) => Promise<any>;
};

const authContextDefaultValues: authContextType = {
  user: null,
  signup: () => Promise.resolve(null),
  signin: () => Promise.resolve(null),
  signOut: () => { },
  verifyOtp: () => Promise.resolve(null),
};

export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);

export const AuthContextProvider = ({ children }: any) => {
  const pathName = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const router = useRouter();
  interface SignUp {
    data?: SignUpResponse;
    error?: any;
  }
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const signup = async (userDto: SignUpDTO) => {
    console.log(userDto);
    const url = baseUrl + authEndpoints.signup;
    console.log(url);
    const { error, data }: SignUp = await myFetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(userDto),
    });

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
  const [isVerifiedToken,setIsVerifiedToken]=useState(false);
  useEffect(() => {
    if (token && token.length > 0) {
      const verifyToken = async () => {
        const formData = {
          token: token,
          invite: true,
        }
        const url = `${baseUrl}/auth/customer/reset-password/page`
        try {
          const { data, error } = await myFetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (error) {
            console.error('Error fetching data:', error);
            router.push("/signin");
          } else {
            console.log('Data fetched:', data);
            // const { id, firstname, lastname, email, role }=data.info;
            // const user = { id, firstname, lastname, email, role };
            setUser(data.info);
            setLocalStorage(data.info);
          }
        } catch (err) {
          console.error('Fetch failed:', err);
          router.push("/signin");
        }
      }
      verifyToken();
    }
  }, [])
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
    }

    let emailError = null;
    let passwordError = null;

    if (error) {
      console.log(error);
      if (error.message.includes("email")) {
        emailError = error.message;
      }
      if (error.message.includes("password")) {
        passwordError = error.message;
      }
    }

    return [{ data, emailError, passwordError }];
  };

  const signOut = () => {
    setUser(null);
    deleteLocalStorage();
    router.push("/signin");
  };

  const setLocalStorage = (user?: UserResponse) => {
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
        // console.log("Not Verified");
        return;
      }
      if (data.user.isVerified) {
        // console.log("Data is verified");
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

  useLayoutEffect(() => {
    const user = window.localStorage.getItem("user");
    console.log(user);

    if (user) {
      // if(!user?.user){
      //   // console.log(1);
      //   setUser(JSON.parse(user));
      // }else 
      setUser(JSON.parse(user).user);
    } else {
      // Define an array of public paths
      const publicPaths = ["/signup", "/forgot-password"];

      // Check if the current path is in public paths or matches the dynamic /reset route
      const isPublicPath =
        publicPaths.includes(pathName) || pathName.startsWith("/reset") || (token && token.length>0);

      if (!isPublicPath) {
        router.push("/signin");
      }
    }
  }, [pathName, router]);

  const value = {
    user,
    signup,
    signin,
    signOut,
    verifyOtp,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
