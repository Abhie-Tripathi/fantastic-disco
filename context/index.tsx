export * from "./auth";

// export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ROUTE;
export const baseUrl = process.env.EVENTGENI_URL_NEXT_PUBLIC_BASE_URL;
export const authEndpoints = {
  signup: "/auth/admin/signup",
  signin: "/auth/admin/signin",
};

export const headers = {
  "Content-Type": "application/json",
};