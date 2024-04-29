export * from "./auth";
export * from "./theme";

// export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ROUTE;
export const baseUrl =process.env.NEXT_PUBLIC_EVENTGENI_URL;
export const authEndpoints = {
  signup: "/auth/admin/signup",
  signin: "/auth/admin/signin",
};

export const headers = {
  "Content-Type": "application/json",
};