"use client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SignInResponse, SignUpResponse } from "../app/components/types";
import { useRouter } from "next/navigation";
import { authEndpoints, baseUrl, headers } from "@/constants";
import { UserResponse } from "../app/components/types/user"
import { TSignInFormSchema, SignUpDTO } from "../app/components/types";
import { myFetch } from "@/utils/myFetch";
import { usePathname } from "next/navigation";

type authContextType = {
  user: UserResponse | null;
  signup: (user: SignUpDTO) => Promise<any>;
  signin: (user: TSignInFormSchema) => Promise<any>;
  signOut: () => void;
};

const authContextDefaultValues: authContextType = {
  user: null,
  signup: () => Promise.resolve(null),
  signin: () => Promise.resolve(null),
  signOut: () => {},
};

export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);

export const AuthContextProvider = ({ children }: any) => {
    
  const pathName = usePathname();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const router = useRouter();
  interface SignUp {
    data?: SignUpResponse;
    error?: any;
  }
  const signup = async (userDto: SignUpDTO) => {
    console.log(userDto)
        const url = baseUrl + authEndpoints.signup;
        
        const { error, data }: SignUp = await myFetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(userDto),
        });
        if (data && !error) {
            setLocalStorage(data);
            setUser(data);
        } else if (
            error &&
            error.status === 401 &&
            error.message === "Credentials incorrect"
        ) {
            setLoginError("Credentials incorrect");
        } else {
            setLoginError("Something went wrong");
        }
  };
  interface SignIn {
    data?: SignInResponse;
    error?: any;
  }
  const signin = async (userDto: TSignInFormSchema) => {
    console.log("user_data_for_signin------------>", userDto);
    const url = baseUrl + authEndpoints.signin;
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
    if (error) {
      if (error.status === 401 && error.message === "Credentials incorrect")
        return { error: "Credentials incorrect" };
      else {
        return { error: "Something went wrong" };
      }
    }
    return;
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

  useLayoutEffect(() => {
    const user = window.localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user).user);
    } else {
      if (pathName !== "/signup") {
        router.push("/signin");
      }
    }
  }, [pathName, router]);

  const value = {
    user,
    signup,
    signin,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};