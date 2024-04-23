export const baseUrl = process.env.NEXT_PUBLIC_EVENTGENI_URL;

export const headers = {
    "Content-Type": "application/json",
  };

export const authEndpoints = {
    signup: "/auth/customer/signup",
    signin: "/auth/customer/signin",
  };