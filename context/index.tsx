export * from "./auth";

// export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ROUTE;
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const authEndpoints = {
  signup: "/auth/customer/signup",
  signin: "/auth/customer/signin",
};

export const headers = {
  "Content-Type": "application/json",
};